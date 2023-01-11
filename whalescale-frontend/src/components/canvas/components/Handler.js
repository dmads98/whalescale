import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';

class Handler extends Component {
  onMouseDown(event) {
    // event.preventDefault();

    if (event.target.classList.contains('handler')) {
      this.props.onDrag(event);
    }
  }

  render() {
    let {props} = this;
    let {boundingBox} = props;

    let handlerStyle = {
      ...styles.handler,
      ...boundingBox,
      width: boundingBox.width + 10,
      height: boundingBox.height + 10,
      left: boundingBox.left - 5,
      top: boundingBox.top - 5,
    };

    return (
      <div className={'handler'}
        style={handlerStyle}
        onMouseLeave={props.onMouseLeave}
        onDoubleClick={props.onDoubleClick}
        onMouseDown={this.onMouseDown.bind(this)}>
      </div>
    );
  }
}

const styles = {
  handler: {
    'position': 'absolute',
    'border': '2px solid #dedede',
    'zIndex': 999999
  },
  anchor: {
    'width': 10,
    'height': 10
  },
  anchorHovered: {
    'borderColor': 'gray'
  },
};

export default Handler;
