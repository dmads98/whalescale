import React, {Component} from 'react';
import {modes} from '../modes';

class SVGRenderer extends Component {
  static defaultProps = {
    onMouseOver() {}
  };

  getObjectComponent(type) {
    let {objectTypes} = this.props;
    return objectTypes[type];
  }

  renderObject(object, index) {
    let {objectRefs, onMouseOver} = this.props;
    let Renderer = this.getObjectComponent(object.type);
    return (
      <Renderer onRender={(ref) => objectRefs[index] = ref}
        onMouseOver={onMouseOver.bind(this, index)}
        object={object}  key={index} index={index} />
      );
  }

  render() {
    let {background, objects, svgStyle, canvas,
         onMouseDown, onRender, mode} = this.props;
    let {width, height, canvasOffsetX, canvasOffsetY} = canvas;

    let style = {
      backgroundSize: width + "px " + height + "px",
      ...{
        ...svgStyle,
        marginTop: canvasOffsetY,
        marginLeft: canvasOffsetX,
        backgroundImage: 'url(' + this.props.image + ')',
        borderRadius: "10px"
        // borderStyle: "solid",
        // borderColor: "gray"
      },
      ...(mode === modes.DRAW || mode === modes.PINS || mode === modes.EDIT_OBJECT) ? {
        cursor: "crosshair"
      } : {
        cursor: "auto"
      }
    };
    return (
      <svg xmlns="http://www.w3.org/2000/svg" id="svgCanvas" onMouseDown={onMouseDown}
         ref={onRender}
         width={width}
         height={height}
         style={style}
         isroot={true}
         >
        {objects.map(this.renderObject.bind(this))}
      </svg>
    );
  }
}


export const styles = {
  canvas: {
    backgroundSize: 400
  }
};

export default SVGRenderer;
