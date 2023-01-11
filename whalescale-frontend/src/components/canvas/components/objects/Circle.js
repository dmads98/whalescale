import React from 'react';

import Vector from './Vector';

class Circle extends Vector {
  static meta = {
    initial: {
      fill: "red",
      strokeWidth: 0,
      radius: 5
    }
  };

  render() {
    let {object} = this.props;
    return (
      <ellipse style={this.getStyle()}
         {...this.getObjectAttributes()}
         rx={object.radius / 2}
         ry={object.radius / 2}
         cx={object.x + object.radius / 2}
         cy={object.y + object.radius / 2} />
    );
  }
}

export default Circle;