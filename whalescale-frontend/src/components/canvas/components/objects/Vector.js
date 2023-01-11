import React, {Component} from 'react';
import _ from 'lodash';

export default class Vector extends Component {

  getStyle() {
    let {object} = this.props;
    return {
      mixBlendMode: object.blendMode
    }
  }

  getTransformMatrix({x, y, width, height}) {

  }

  getObjectAttributes() {
    let {object, onRender, ...rest} = this.props;
    return {
      ...object,
      transform: this.getTransformMatrix(object),
      ref: onRender,
      ...rest
    };
  }
}
