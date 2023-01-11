import React, {Component} from 'react';
import {modes} from '../../modes';
import {API_URL} from '../../../../constants';
import _ from 'lodash';

import Vector from './Vector';
import BezierEditor from '../BezierEditor';
import axios from "axios";

class Path extends Vector {
  static meta = {
    initial: {
      fill: `rgba(153, 136, 133, 0.4)`,
      closed: false,
      movex: 0,
      movey: 0,
      path: [],
      highlighted: 0,
      strokeWidth: 1,
      measurementtype: "length",
      bezier: false,
      bezierinstructions: "",
      xs: [],
      ys: [],
      m: [],
      l: [],
      widthsegments: -1
    },
    mode: modes.DRAW,
    editor: BezierEditor
  };

  runBezierFit(data, movex, movey){
    let instructions = [];
    instructions.push(`M ${movex} ${movey}`);
    let i;
    for (i = 1; i < data.xs.length - 1; i++){
      let startX = data.xs[i - 1];
      let startY = data.ys[i - 1];
      let midX = data.xs[i];
      let midY = data.ys[i];
      let endX = data.xs[i + 1];
      let endY = data.ys[i + 1];
      instructions.push(`C ${startX} ${startY} ${midX} ${midY} ${endX} ${endY}`);
    }
    let {object} = this.props;
    object.bezierinstructions = instructions.join('\n');
    object.xs = data.xs;
    object.ys = data.ys;
    object.m = data.m;
    object.l = data.l;
    this.setState({});
  }

  buildPath(object) {
    let {path} = object;
    if(object.bezierinstructions){
      return object.bezierinstructions;
    }
    if (object.bezier){
      let data;
      axios.get(API_URL + "bezierFit", {
        params:{
          path: object.path
        }
      }).then(res => {
        data = JSON.parse(res.data);
        this.runBezierFit(data, object.movex, object.movey);
      });
      
    }

    let lines = path.map(({x1, y1, x, y}, i) => (
      `L ${x} ${y}`
    ));

    let instructions = [
      `M ${object.movex} ${object.movey}`,
      ...lines
    ];

    if (object.closed) {
      instructions = [
        ...instructions, 'Z'
      ];
    }

    return instructions.join('\n');
  }

  getTransformMatrix({x, y, movex, movey}) {
    return `
      translate(${x - movex} ${y - movey})
    `;
  }

  render() {
    let {object} = this.props;
    let fill = (object.closed ? object.fill
                              : "transparent");
    let strokeColor = object.highlighted === 1 ? "yellow" : "black";
    return (
      <path style={{stroke: strokeColor}}
         {...this.getObjectAttributes()}
         d={this.buildPath(object)}
         fill={fill} />
    );
  }
}

export default Path;
