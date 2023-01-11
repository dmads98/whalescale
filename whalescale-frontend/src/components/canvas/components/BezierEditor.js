import React, { Component } from 'react';


class BezierEditor extends Component {
  state = {
    mode: 'source',
    measurementtype: null
  };

  getMouseCoords(event) {
    let {object, offset} = this.props;
    let res = {
      x: event.clientX - offset.x - (object.x - object.movex),
      y: event.clientY - offset.y - (object.y - object.movey)
    };
    return res;
  }

  componentWillMount(props) {
    let {object, measurementtype} = this.props;
    if (!object.path.length) {
      this.props.onUpdate({
        path: [
          {x1: object.x, y1: object.y, x: object.x, y: object.y}
        ],
        movex: object.x,
        movey: object.y,
        measurementtype: measurementtype
      });
      this.setState({
        measurementtype: measurementtype
      });
    } 
    // else {
    //   this.setState({
    //     mode: 'edit'
    //   });
    // }
  }

  getCurrentPath() {
    let {path} = this.props.object;
    return path[path.length - 1];
  }

  //used when editing existing path
  // updatePath(updates, index) {
  //   let {path} = this.props.object;
  //   let current = path[index];

  //   this.props.onUpdate({
  //     path: [
  //       ...path.slice(0, index),
  //       {
  //         ...current,
  //         ...updates
  //       },
  //       ...path.slice(index + 1)
  //     ]
  //   });
  // }

  updateCurrentPath(updates, close=false) {
    let {path} = this.props.object;
    let current = this.getCurrentPath();

    this.props.onUpdate({
      closed: close,
      path: [
        ...path.slice(0, path.length - 1),
        {
          ...current,
          ...updates
        }
      ]
    });
  }

  onMouseMove(event) {
    let {mode} = this.state;
    let mouse = this.getMouseCoords(event);
    let {object} = this.props;
    let {movex, movey} = object;
    let {x, y} = mouse;
    let snapToInitialVertex;
    if (this.state.measurementtype === "area"){
      snapToInitialVertex = (
        this.isCollides(movex, movey, x, y)
      );

      if (snapToInitialVertex) {
        x = movex;
        y = movey;
      }
    }

    // if (mode === 'source') {
    //   this.updateCurrentPath({
    //     x1: mouse.x,
    //     y1: mouse.y
    //   });
    // }

    if (mode === 'target') {
      this.updateCurrentPath({
        // x2: x,
        // y2: y,
        x: x,
        y: y
      })
    }

    // if (mode === 'connect') {
    //   this.updateCurrentPath({x, y})
    // }
    if (this.state.measurementtype === "area"){
      if (mode === 'target' || mode === 'connect') {
        this.setState({
          closePath: snapToInitialVertex
        });
      }
    }

    // if (mode === 'move') {
    //   let {movedPathIndex,
    //        movedTargetX,
    //        movedTargetY} = this.state;
    //   this.updatePath({
    //     [movedTargetX]: x,
    //     [movedTargetY]: y
    //   }, movedPathIndex);
    // }

    // if (mode === 'moveInitial') {
    //   this.props.onUpdate({
    //     movex: x,
    //     movey: y
    //   });
    // }
  }

  isCollides(x1, y1, x2, y2, radius=5) {
    let xd = x1 - x2;
    let yd = y1 - y2;
    let wt = radius * 2;
    return (xd * xd + yd * yd <= wt * wt);
  }

  onMouseDown(event) {
    if (this.state.closePath) {
      return this.closePath();
    }

    // if (event.target.tagName === 'svg') {
    //   return this.props.onClose();
    // }
    let mouse = this.getMouseCoords(event);
    let {path} = this.props.object;
    if (path.length === 1 && path[0].x1 === path[0].x && path[0].y1 === path[0].y){
      return;
    }
    if (this.state.measurementtype === "angle" && path.length === 2 && path[1].x1 === path[1].x && path[1].y1 === path[1].y){
      return;
    }

    let {mode} = this.state;
    if (mode === 'target') {
      this.setState({
        mode: 'connect'
      });
    }
  }

  onMouseUp(event) {
    let {mode} = this.state;
    let {path} = this.props.object;
    let mouse = this.getMouseCoords(event);
    let currentPath = this.getCurrentPath();

    // if (this.state.closePath) {
    //   return this.closePath();
    // }

    if (mode === 'source') {
      this.setState({
        mode: 'target'
      });
    }


    if (mode === 'connect') {
      this.setState({
        mode: 'target'
      });
      if (this.state.measurementtype === "angle"){
        if (this.props.object.path.length === 2){
          this.props.onClose();
          return;
        }
      }
      this.props.onUpdate({
        path: [
          ...path,
          {
            x1: currentPath.x,
            y1: currentPath.y,
            // x2: mouse.x,
            // y2: mouse.y,
            x: mouse.x,
            y: mouse.y
          }
        ]
      });
    }

    // if (mode === 'move' || mode === 'moveInitial') {
    //   this.setState({
    //     mode: 'edit'
    //   });
    // }
  }

  //never used
  // getCurrentPoint(pathIndex) {
  //   let {state} = this;
  //   let {object} = this.props;
  //   if (pathIndex === 0) {
  //     return {x: object.movex, y: object.movey}
  //   } else {
  //     let path = state.path[pathIndex - 1];
  //     return {x: path.x, y: path.y};
  //   }
  // }

  closePath() {
    this.setState({
      mode: null
    });

    this.props.onClose();

    this.updateCurrentPath({
      x: this.props.object.movex,
      y: this.props.object.movey
    }, true);
  }

  //removed edit abilities
  moveVertex(pathIndex, targetX, targetY, event) {
    // event.preventDefault();

    // if (this.state.mode !== 'edit') {
    //   return;
    // }

    // let mouse = this.getMouseCoords(event);

    // this.setState({
    //   mode: 'move',
    //   movedPathIndex: pathIndex,
    //   movedTargetX: targetX,
    //   movedTargetY: targetY
    // });
  }

  //not implemented
  moveInitialVertex(event) {
    this.setState({
      mode: 'moveInitial'
    });
  }

  render() {
    let {object, width, height} = this.props;
    // let {path} = object;
    // let {state} = this;

    let {movex, movey, x, y} = object;

    let offsetX = x - movex,
        offsetY = y - movey;

    return (
      <div style={styles.canvas}
           onMouseUp={this.onMouseUp.bind(this)}
           onMouseMove={this.onMouseMove.bind(this)}
           onMouseDown={this.onMouseDown.bind(this)}>
        <svg style={{width, height}}>
          <g transform={`translate(${offsetX} ${offsetY})`}>
            {object.path.map(({x1, y1, x, y}, i) => (
              <g key={i}>
                {i === 0 && (
                  <g>
                    {/* <line x1={movex} y1={movey}
                      style={styles.edge}
                      onMouseDown={this.moveVertex.bind(this, i, 'x1', 'y1')}
                      x2={x1} y2={y1} stroke="black" /> */}

                    {/* <circle style={styles.vertex} r={3} cx={x1} cy={y1}
                      onMouseDown={this.moveVertex.bind(this, i, 'x1', 'y1')} /> */}

                    <circle r={3} cx={movex} cy={movey}
                      style={{...styles.vertex, ...styles.initialVertex}} />
                  </g>
                )}
                {x && y && (
                  <g>
                    {/* <line x1={x2} y1={y2}
                      x2={x} y2={y}
                      style={styles.edge}
                      onMouseDown={this.moveVertex.bind(this, i, 'x', 'y')}  />

                    <circle r={3} cx={x2} cy={y2}
                      style={styles.vertex}
                      onMouseDown={this.moveVertex.bind(this, i, 'x2', 'y2')} /> */}

                    <circle r={3} cx={x} cy={y}
                      style={styles.vertex}
                      onMouseDown={this.moveVertex.bind(this, i, 'x', 'y')} />
                  </g>
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>
    );
  }



  // return (
  //   <div style={styles.canvas}
  //        onMouseUp={this.onMouseUp.bind(this)}
  //        onMouseMove={this.onMouseMove.bind(this)}
  //        onMouseDown={this.onMouseDown.bind(this)}>
  //     <svg style={{width, height}}>
  //       <g transform={`translate(${offsetX} ${offsetY})`}>
  //         {object.path.map(({x1, y1, x2, y2, x, y}, i) => (
  //           <g key={i}>
  //             {x2 && y2 && (
  //               <g>
  //                 <line x1={x2} y1={y2}
  //                   x2={x} y2={y}
  //                   style={styles.edge}
  //                   onMouseDown={this.moveVertex.bind(this, i, 'x', 'y')}  />

  //                 <circle r={3} cx={x2} cy={y2}
  //                   style={styles.vertex}
  //                   onMouseDown={this.moveVertex.bind(this, i, 'x2', 'y2')} />

  //                 <circle r={3} cx={x} cy={y}
  //                   style={styles.vertex}
  //                   onMouseDown={this.moveVertex.bind(this, i, 'x', 'y')} />
  //               </g>
  //             )}
  //             {i === 0 && (
  //               <g>
  //                 <line x1={movex} y1={movey}
  //                   style={styles.edge}
  //                   onMouseDown={this.moveVertex.bind(this, i, 'x1', 'y1')}
  //                   x2={x1} y2={y1} stroke="black" />

  //                 <circle style={styles.vertex} r={3} cx={x1} cy={y1}
  //                   onMouseDown={this.moveVertex.bind(this, i, 'x1', 'y1')} />

  //                 <circle r={3} cx={movex} cy={movey}
  //                   style={{...styles.vertex, ...styles.initialVertex}} />
  //               </g>
  //             )}
  //           </g>
  //         ))}
  //       </g>
  //     </svg>
  //   </div>
  // );

}

const styles = {
  vertex: {
    fill: "red",
    strokeWidth: 0
  },
  initialVertex: {
    fill: "#ffd760"
  },
  edge: {
    stroke: "#b9b9b9"
  },
  canvas: {
    position: "absolute",
    cursor: "crosshair"
  }
};

export default BezierEditor;
