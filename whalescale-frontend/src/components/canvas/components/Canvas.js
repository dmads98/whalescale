import React, { Component } from 'react';
import _ from 'lodash';
import {HotKeys} from 'react-hotkeys';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MeasurementDialog from '../../MeasurementDialog';


import SVGRenderer from './SVGRenderer';
import {modes} from '../modes';
import {API_URL} from '../../../constants';
import Circle from './objects/Circle';
import Path from './objects/Path';
import Handler from './Handler';
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import ProgressBackdrop from '../../ProgressBackdrop';
import Legend from '../../Legend';

const MeasureButton = withStyles((theme) => ({
  root: {
      margin: '5px 0px 5px 0px'
  },
}))(Button);

class Canvas extends Component {
  static defaultProps = {
    objectTypes: {
      'circle': Circle,
      'polygon': Path,
    },
    snapToGrid: 1,
    svgStyle: {},
  };

  state = {
    mode: modes.FREE,
    handler: {
      top: 200,
      left: 200,
      width: 50,
      height: 50,
    },
    currentObjectIndex: null,
    selectedObjectIndex: null,
    selectedTool: null,
    curMeasurementType: null,
    bezierFit: true,
    widthSegments: 10,
    focalLength: 50,
    altitude: 50,
    pixelDimension: 0.00391667,
    measureLengthActive: true,
    measureWidthActive: false,
    measureAreaActive: true,
    measureAngleActive: true,
    curWidthSegment: 0,
    curLengthObjIndexForWidths: 0,
    lengthsMeasured: [],
    areasMeasured: [],
    anglesMeasured: [],
    focalLengthMeasured: 0,
    altitudeMeasured: 0,
    pixelDimensionMeasured: 0,
    imageNameMeasured: "",
    curMeasurmentName: "",
    showDialog: false,
    imageName: "",
    buttonsDisabled: false,
    widthsButtonText: "Measure Widths",
    curNumPins: null,
    pinsNeeded: null
  };

  keyMap = {
    'removeObject': ['del', 'backspace'],
    'moveLeft': ['left', 'shift+left'],
    'moveRight': ['right', 'shift+right'],
    'moveUp': ['up', 'shift+up'],
    'moveDown': ['down', 'shift+down'],
    // 'moveLeft': ['left'],
    // 'moveRight': ['right'],
    // 'moveUp': ['up'],
    // 'moveDown': ['down'],
    'closePath': ['enter']
  };

  componentWillMount() {
    this.objectRefs = {};
  }

  showHandler(index) {
    let {mode} = this.state;
    let {objects} = this.props;
    let object = objects[index];
    if (mode !== modes.FREE || object.measurementtype === "width" || object.type === "circle") {
      return;
    }
    console.log(object);
    this.updateHandler(index, object);
    this.setState({
      currentObjectIndex: index,
      selectedObjectIndex: index,
      showHandler: true
    });
  }

  hideHandler() {
    let {mode} = this.state;
    if (mode === modes.FREE) {
      this.setState({
        showHandler: false
      });
    }
  }

  getStartPointBundle(event, object) {
    let {currentObjectIndex} = this.state;
    let {objects} = this.props;
    let mouse = this.getMouseCoords(event);
    object = object || objects[currentObjectIndex];
    return {
      clientX: mouse.x,
      clientY: mouse.y,
      objectX: object.x,
      objectY: object.y,
      width: object.width,
      height: object.height
    };
  }

  startDrag(mode, event) {
    let {currentObjectIndex} = this.state;
    let object = this.props.objects[currentObjectIndex];
    //blocking drag for length drawing with bezier fit
    //possibly temporary; just so that width objects are correctly added
    if (object.bezier){
      return;
    }
    this.setState({
      mode: mode,
      startPoint: this.getStartPointBundle(event),
      selectedObjectIndex: currentObjectIndex
    });
  }

  resetSelection() {
    this.setState({
      selectedObjectIndex: null
    });
  }

  newObject(event) {
    let {mode, selectedTool} = this.state;
    let mouse = this.getMouseCoords(event);
    if (mode === modes.PINS){
      let {curWidthSegment, curLengthObjIndexForWidths} = this.state;
      this.addPin(curWidthSegment, curLengthObjIndexForWidths, mouse);
      return;
    }

    this.resetSelection(event);

    if (mode !== modes.DRAW) {
      return;
    }
    let {meta} = this.getObjectComponent(selectedTool);
    let object = {
      ...meta.initial,
      type: selectedTool,
      x: mouse.x,
      y: mouse.y
    };
    if (this.state.curMeasurementType !== "width"){
      object.name = this.state.curMeasurmentName;
    }

    let {objects, onUpdate} = this.props;
    onUpdate([...objects, object]);
    this.setState({
      currentObjectIndex: objects.length,
      selectedObjectIndex: objects.length,
      startPoint: this.getStartPointBundle(event, object),
      mode: meta.editor ? modes.EDIT_OBJECT : modes.FREE,
      selectedTool: null
    });

  }

  highlightSegment(index, highlight, objects){
    let newObjects = []
    for (let i = 0; i < objects.length; i++){
      if (i == index){
        let newObject = {
          ...objects[i],
          highlighted: highlight ? 1 : 0
        };
        newObjects.push(newObject);
      }
      else{
        newObjects.push(objects[i]);
      }
    }
    return newObjects;
  }

  undoPinDrop(){
    console.log("undo pin drop");
    let {objects, onUpdate} = this.props;
    let curSegmentIndex = objects.length - this.state.pinsNeeded;
    let newObjects = this.highlightSegment(curSegmentIndex, false, objects);
    newObjects = newObjects.slice(0, newObjects.length - 1);
    console.log("pin removed from " + (this.state.curWidthSegment - 1));
    this.setState({
      curNumPins: this.state.curNumPins - 1,
      curWidthSegment: this.state.curWidthSegment - 1
    }, () => {
      this.objectRefs = {};
      onUpdate(newObjects);
    });
  }

  addPin(curWidthSegment, lengthIndex, mouseCoords){
    if (this.state.curNumPins === this.state.pinsNeeded){
      console.log("all pins added");
      return;
    }
    let {objects} = this.props;
    let totalSegments = (objects[lengthIndex].widthsegments - 1) * 2;
    let curIndex = lengthIndex + curWidthSegment + 1;
    let widthObj = objects[curIndex];
    let k = Math.floor(curWidthSegment/2) + 1;
    let x0 = this.state.xp[k];
    let y0 = this.state.yp[k];
    let x1 = mouseCoords.x;
    let y1 = mouseCoords.y;
    let vx = this.state.slopes[1][k];
    let vy = -this.state.slopes[0][k];

    axios.get(API_URL + "calcPinLocation", {
      params:{
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        vx: vx,
        vy: vy
      }
    }).then(res => {
      // let data = JSON.parse(res.data);
      let pinX = res.data.x;
      let pinY = res.data.y;
      let {objects, onUpdate} = this.props;
      let {meta} = this.getObjectComponent("circle");
      let radius = meta.initial.radius;
      let object = {
        ...meta.initial,
        type: "circle",
        x: pinX - Math.floor(radius/2),
        y: pinY - Math.floor(radius/2)
      };
      let newObjects = [...objects, object];
      console.log("pin added to " + curWidthSegment);
      if (curWidthSegment + 1 < totalSegments){
        newObjects = this.highlightSegment(curIndex + 1, true, newObjects);
      }
      
      this.setState({
        curNumPins: this.state.curNumPins + 1,
        curWidthSegment: curWidthSegment + 1
      }, () => {
        this.objectRefs = {};
        onUpdate(newObjects);
      });
      console.log("pin added");
    });

  }

  //never used
  updatePath(object) {
    let {path} = object;
    let diffX = object.x - object.movex;
    let diffY = object.y - object.movey;

    let newPath = path.map(({x1, y1, x2, y2, x, y}) => ({
      x1: diffX + x1,
      y1: diffY + y1,
      x2: diffX + x2,
      y2: diffY + y2,
      x: diffX + x,
      y: diffY + y
    }));

    return {
      ...object,
      path: newPath,
      movex: object.x,
      movey: object.y
    };
  }

  //TODO: FIX KEYPRESS HANDLER
  moveSelectedObject(attr, points, event) {
    let {selectedObjectIndex} = this.state;
    let {objects} = this.props;
    let object = objects[selectedObjectIndex];
    if (event.shiftKey) {
      points *= 10;
    }
    let changes = {
      ...object,
      [attr]: object[attr] + points
    };

    this.updateObject(selectedObjectIndex, changes);
    this.updateHandler(selectedObjectIndex, changes);
  }

  updateObject(objectIndex, changes, updatePath) {
    let {objects, onUpdate} = this.props;
    onUpdate(objects.map((object, index) => {
      if (index === objectIndex) {
        let newObject = {
          ...object,
          ...changes
        };
        return newObject;
      } else {
        return object;
      }
    }));
  }

  updateHandler(index, object) {
    let target = this.objectRefs[index];
    let bbox = target.getBoundingClientRect();
    let {canvasOffsetX, canvasOffsetY} = this.getCanvas();

    let handler = {
      ...this.state.handler,
      width: object.width || bbox.width,
      height: object.height || bbox.height,
      top: object.y + canvasOffsetY,
      left: object.x + canvasOffsetX,
    };
    if (!object.width) {
      let offset = this.getOffset();
      handler = {
        ...handler,
        left: bbox.left - offset.x - 1,
        top: bbox.top - offset.y - 1
      };
    }
    this.setState({
      handler: handler
    });
  }

  getOffset() {
    let parent = this.svgElement.getBoundingClientRect();
    let {canvasWidth, canvasHeight} = this.getCanvas();
    return {
      x: parent.left,
      y: parent.top,
      width: canvasWidth,
      height: canvasHeight
    };
  }

  applyOffset(bundle) {
    //SEE ? if u comment this out it looks good, but crashes
    let offset = this.getOffset();
    return {
      ...bundle,
      x: bundle.x - offset.x,
      y: bundle.y - offset.y
    }
  }

  snapCoordinates({x, y}) {
    let {snapToGrid} = this.props;
    return {
      x: x - (x % snapToGrid),
      y: y - (y % snapToGrid)
    };
  }

  getMouseCoords({clientX, clientY}) {
    let coords = this.applyOffset({
      x: clientX,
      y: clientY
    });

    return this.snapCoordinates(coords);
  }
  
  drag({object, startPoint, mouse}) {
    return {
        ...object,
        x: mouse.x - (startPoint.clientX - startPoint.objectX),
        y: mouse.y - (startPoint.clientY - startPoint.objectY)
    };
    };

  onDrag(event) {
    let {currentObjectIndex, startPoint, mode} = this.state;
    let {objects} = this.props;
    let object = objects[currentObjectIndex];
    let mouse = this.getMouseCoords(event);

    if (mode !== modes.DRAG) {
      return;
    }

    let newObject = this.drag({
        object,
        startPoint,
        mouse,
        objectIndex: currentObjectIndex,
        objectRefs: this.objectRefs
    });
    this.updateObject(currentObjectIndex, newObject);
    this.updateHandler(currentObjectIndex, newObject);
  }

  stopDrag() {
    let {mode} = this.state;

    if (_.includes([modes.DRAG], mode)) {
      this.setState({
        mode: modes.FREE
      });
    }
  }

  showEditor() {
    let {selectedObjectIndex} = this.state;

    let {objects} = this.props,
      currentObject = objects[selectedObjectIndex],
      objectComponent = this.getObjectComponent(currentObject.type);

    if (objectComponent.meta.editor) {
      this.setState({
        mode: modes.EDIT_OBJECT,
        showHandler: false
      });
    }
  }

  getObjectComponent(type) {
    let {objectTypes} = this.props;
    return objectTypes[type];
  }

  getCanvas() {
    let {width, height} = this.props;
    let {
      canvasWidth=width,
      canvasHeight=height
    } = this.props;
    return {
      width, height, canvasWidth, canvasHeight,
      canvasOffsetX: (canvasWidth - width) / 2,
      canvasOffsetY: (canvasHeight - height) / 2
    };
  }

  renderSVG() {
    let canvas = this.getCanvas();
    let {width, height, canvasOffsetX, canvasOffsetY} = canvas;
    let {background, objects, svgStyle, objectTypes} = this.props;

    return (
      <SVGRenderer
        id="svgCanvas"
        background={background}
        width={width}
        canvas={canvas}
        height={height}
        objects={objects}
        onMouseOver={this.showHandler.bind(this)}
        objectTypes={objectTypes}
        objectRefs={this.objectRefs}
        onRender={(ref) => this.svgElement = ref}
        onMouseDown={this.newObject.bind(this)}
        image={this.props.imagePath}
        mode={this.state.mode}
        />
    );
  }

  selectTool() {
    this.setState({
      selectedTool: 'polygon',
      mode: modes.DRAW,
      currentObjectIndex: null,
      showHandler: false,
      handler: null
    });
  }

  removeCurrent() {
    if (!this.state.showHandler){
      return;
    }
    let {selectedObjectIndex} = this.state;
    let {objects} = this.props;
    let rest = []
    let objectToRemove = false;
    let endIndex = -1;
    for (let i = 0; i < objects.length; i++){
      if (selectedObjectIndex !== i && !objectToRemove){
        rest.push(objects[i]);
      }
      else{
        if (objectToRemove && i === endIndex){
          objectToRemove = false;
        }
        else{
          let curObject = objects[i];
          if (curObject.bezier && curObject.widthsegments !== -1){
            objectToRemove = true;
            endIndex = i + (curObject.widthsegments - 1)*4;
          }
        }
      }
    }

    this.setState({
      currentObjectIndex: null,
      selectedObjectIndex: null,
      showHandler: false,
      handler: null
    }, () => {
      this.objectRefs = {};
      this.props.onUpdate(rest);
    });
  }

  handleCheckbox(){
    this.setState({
      bezierFit: !this.state.bezierFit
    });
  }

  updateImageName(event){
    this.setState({
      imageName: event.target.value.trim()
    });
  }

  updateWidthSegments(event){
    this.setState({
      widthSegments: event.target.value
    });
  }

  updateFocalLength(event){
    this.setState({
      focalLength: event.target.value
    });
  }

  updateAltitude(event){
    this.setState({
      altitude: event.target.value
    });
  }

  updatePixelDimension(event){
    this.setState({
      pixelDimension: event.target.value
    });
  }

  getKeymapHandlers() {
    let handlers = {
      removeObject: this.removeCurrent.bind(this),
      moveLeft: this.moveSelectedObject.bind(this, 'x', -2),
      moveRight: this.moveSelectedObject.bind(this, 'x', 2),
      moveUp: this.moveSelectedObject.bind(this, 'y', -2),
      moveDown: this.moveSelectedObject.bind(this, 'y', 2),
      closePath: this.closeOnEnter.bind(this)
    };

    return _.mapValues(handlers, (handler) => (event, key) => {
      if (event.target.tagName !== 'INPUT') {
        event.preventDefault();
        handler(event, key);
      }
    });
  }

  deactivateButtons(){
    this.setState({
      measureLengthActive: false,
      measureWidthActive: this.state.mode === modes.PINS,
      measureAreaActive: false,
      measureAngleActive: false
    });
  }

  activateButtons(widthActive){
    this.setState({
      measureLengthActive: true,
      measureWidthActive: widthActive,
      measureAreaActive: true,
      measureAngleActive: true
    });
  }

  measureLength(){
    this.selectTool();
    this.setState({
      showDialog: true,
      curMeasurementType: "length"
    });
    this.deactivateButtons();
  }

  measureWidth(){
    if (this.state.mode === modes.PINS){
      this.setState({
        curWidthSegment: 0,
        widthsButtonText: "Measure Widths",
        curNumPins: null,
        pinsNeeded: null
      });
      this.closeEditor();
      return;
    }
    let {objects} = this.props;
    let lastLength = objects[objects.length - 1];
    this.selectTool();
    this.setState({
      curMeasurementType: "width",
      curLengthObjIndexForWidths: objects.length - 1,
      widthsButtonText: "Confirm Pins",
      curNumPins: 0
    });
    this.widthsApiRequest(lastLength);
  }

  widthsApiRequest(lengthObj){
    let numSegments = parseInt(this.state.widthSegments);
    this.setState({
      pinsNeeded: (numSegments - 1) * 2
    })
    let index = this.props.objects.length - 1;
    axios.post(API_URL + "measureWidths", {
      params:{
        xs: lengthObj.xs,
        ys: lengthObj.ys,
        m: lengthObj.m,
        l: lengthObj.l,
        numSegments: numSegments,
        canvasHeight: this.props.height,
        canvasWidth: this.props.width
      }
    }).then(res => {
      this.updateObject(index, {
        widthsegments: numSegments
      });
      let data = JSON.parse(res.data)
      console.log(data);
      this.setState({
        xp: data.xp,
        yp: data.yp,
        slopes: data.slopes
      });
      this.addWidthSegments(data.lines);
      this.deactivateButtons();
    });
  }

  addWidthSegments(lines){
    let {selectedTool} = this.state;
    this.setState({
      // currentObjectIndex: objects.length,
      // selectedObjectIndex: objects.length,
      // startPoint: this.getStartPointBundle(event, object),
      mode: modes.PINS,
      // selectedTool: null
    });
    let measurementtype = this.state.curMeasurementType;
    let i;
    for (i = 0; i < lines.length; i++){
      let line = lines[i];
      let {meta} = this.getObjectComponent(selectedTool);
      let {objects, onUpdate} = this.props;
      let start = line['start'];
      let end = line['end'];
      // let color = i === 0 ? "yellow" : "black";
      let object = {
        ...meta.initial,
        type: selectedTool,
        x: start[0],
        y: start[1],
        path: [
          {x1: start[0], y1: start[1], x: end[0], y: end[1]}
        ],
        movex: start[0],
        movey: start[1],
        measurementtype: measurementtype,
        highlighted: i === 0 ? 1 : 0
      };
      onUpdate([...objects, object]);
    }
  }

  measureArea(){
    this.selectTool();
    this.setState({
      showDialog: true,
      curMeasurementType: "area"
    });
    this.deactivateButtons();
  }

  measureAngle(){
    this.selectTool();
    this.setState({
      showDialog: true,
      curMeasurementType: "angle"
    });
    this.deactivateButtons();
  }

  closeOnEnter(){
    if (this.state.curMeasurementType === "length"){
      let {selectedObjectIndex} = this.state;
      let {objects} = this.props;
      let curObject = objects[selectedObjectIndex];
      if (curObject.path.length === 1 && curObject.path[0].x1 === curObject.path[0].x && curObject.path[0].y1 === curObject.path[0].y){
        let newObjects = objects.slice(0, objects.length - 1);
        this.props.onUpdate(newObjects);
      }
      else{
        let i = curObject.path.length - 1;
        let newPath = curObject.path;
        while(i > 0){
          if (newPath[i].x1 === newPath[i].x && newPath[i].y1 === newPath[i].y){
            i--;
          }
          else{
            break;
          }
        }
        newPath = newPath.slice(0, i + 1);
        this.updateObject(selectedObjectIndex, {
          bezier: this.state.bezierFit,
          path: newPath
        });
      }
      this.closeEditor();
    }
  }

  closeEditor(){
    console.log("editor closed");
    this.setState({
      mode: modes.FREE,
    });
    this.activateButtons(this.state.curMeasurementType === "length" && this.state.bezierFit);
  }

  isValidWSInput(){
    let ws = this.state.widthSegments;
    let input;
    if (typeof ws === "string"){
      var trim = ws.trim();
      input = trim.split(" ");
      if (input.length > 1){
        return false;
      }
      if (input[0].match(/^[0-9]+$/) === null){
        return false;
      }
      input = parseInt(input[0]);
    }
    else{
      input = ws;
    }
    return input > 1 && input <= 50;
  }

  isValidMeasurementFieldInput(value){
    let input;
    if (typeof value === "string"){
      var trim = value.trim();
      input = trim.split(" ");
      if (input.length > 1){
        return false;
      }
      if (input[0].match(/^\d+(\.\d+)?$/) === null){
        return false;
      }
      input = parseFloat(input[0]);
    }
    else{
      input = value;
    }
    return input > 0;
  }

  //TODO: Don't need to pass the entire object, should pass minimal data
  completeMeasurements(){
    this.disableAllButtons();
    this.takeScreenshot();
  }

  calculateMeasurements(){
    let focalLength = parseFloat(this.state.focalLength);
    let altitude = parseFloat(this.state.altitude);
    let pixelDimension = parseFloat(this.state.pixelDimension);
    var tokenStr = 'Token ';
    var token = localStorage.getItem('token');
    var res = token ? tokenStr.concat(token) : "";
    axios.post(API_URL + "completeMeasurements", {
      params:{
        objects: this.props.objects,
        focalLength: focalLength,
        altitude: altitude,
        pixelDimension: pixelDimension,
        imageWidth: this.props.imageWidth,
        imageHeight: this.props.imageHeight,
        canvasHeight: this.props.height,
        canvasWidth: this.props.width,
        imageName: this.state.imageName
      }
    }, {
      headers: {
        'Authorization': res
      }
    }).then(res => {
      console.log(res);
      let data = JSON.parse(res.data);
      this.props.reset();
      this.enableAllButtons();
      this.props.closeCanvas(
        data.lengths,
        data.areas,
        data.angles,
        data.focalLength,
        data.altitude,
        data.pixelDimension,
        data.name,
        data.imageId,
        this.state.measurementScreenShot,
        this.state.measurementScreenShotName
      );
    });
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
  }

  takeScreenshot(){
    var svgElement = document.getElementById('svgCanvas');
    let width = this.props.imageWidth;
    let height = this.props.imageHeight;
    let clonedSvgElement = svgElement.cloneNode(true);
    let outerHTML = clonedSvgElement.outerHTML;
    let blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
    let blobURL = URL.createObjectURL(blob);
    let image = new Image();
    image.onload = e => {
      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext('2d');
      // draw image in canvas starting left-0 , top - 0  
      context.drawImage(this.props.curImageElement, 0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      let png = canvas.toDataURL();
      let origImageInfo = this.props.image.name.split(".");
      let newImageName = origImageInfo[0] + "_measured";
      this.setState({
        measurementScreenShot: this.dataURItoBlob(png),
        measurementScreenShotName: newImageName
      });
      this.calculateMeasurements();
    };
    image.src = blobURL;
  }

  handleCompleteMeasurementsButton(){
    let {mode} = this.state;
    if (mode === modes.FREE){
      if (this.props.objects.length > 0){
        return true;
      }
    }
    return false;
  }

  cancelMeasurement(){
    this.setState({
      showDialog: false,
      curMeasurementType: null
    });
    this.closeEditor();
  }

  beginMeasurement(name){
    this.setState({
      showDialog: false,
      curMeasurmentName: name
    });
  }

  resetCanvas(){
    if (this.state.mode == modes.PINS){
      this.setState({
        curWidthSegment: 0,
        widthsButtonText: "Measure Widths",
        curNumPins: null,
        pinsNeeded: null
      });
    }
    this.setState({
      curMeasurementType: null
    });
    this.closeEditor();
    this.props.reset();
  }

  disableAllButtons(){
    this.setState({
      buttonsDisabled: true
    });
  }

  enableAllButtons(){
    this.setState({
      buttonsDisabled: false
    });
  }


  render() {

    let {showHandler, handler, mode,
         selectedObjectIndex, selectedTool} = this.state;

    let {
      objects,
      objectTypes
    } = this.props;

    let currentObject = objects[selectedObjectIndex],
        isEditMode = mode === modes.EDIT_OBJECT;;

    let {width, height, canvasWidth, canvasHeight} = this.getCanvas();

    let objectComponent, objectWithInitial, ObjectEditor;
    if (currentObject) {
      objectComponent = this.getObjectComponent(currentObject.type);
      objectWithInitial = {
        ...objectComponent.meta.initial,
        ...currentObject
      };
      ObjectEditor = objectComponent.meta.editor;
    }
    let validWSInput = this.isValidWSInput();
    let validFocalInput = this.isValidMeasurementFieldInput(this.state.focalLength);
    let validAltitudeInput = this.isValidMeasurementFieldInput(this.state.altitude);
    let validPixelInput = this.isValidMeasurementFieldInput(this.state.pixelDimension);
    let completeMeasurementsDisabled = !this.handleCompleteMeasurementsButton() || !validFocalInput || !validAltitudeInput || !validPixelInput;
    
    return (
      <Grid container spacing={10} 
        direction="row"
        justify="flex-start"
        alignItems="center">
        <Grid item xs={4}>
          <form>
            <div>
              <TextField label="Image Name" variant="outlined"
              fullWidth
                placeholder="Enter name..."
                margin="dense"
                className={{
                  width: '25ch'
                }}
                inputProps={{
                  maxlength: 25
                }}
                onChange={this.updateImageName.bind(this)}
              />
            </div>
            <div>
              <TextField label="↔️ Width Segments" variant="outlined"
                fullWidth
                placeholder="Enter info..."
                margin="dense"
                defaultValue={this.state.widthSegments}
                error={!validWSInput}
                inputProps={{
                  maxlength: 2
                }}
                onChange={this.updateWidthSegments.bind(this)}
              />
            </div>
            <div>
              <TextField label="📷 Focal Length (mm)" variant="outlined"
                required
                fullWidth
                placeholder="Enter info..."
                margin="dense"
                defaultValue={this.state.focalLength}
                error={!validFocalInput}
                inputProps={{
                  maxlength: 25
                }}
                onChange={this.updateFocalLength.bind(this)}
              />
            </div>
            <div>
              <TextField label="🛫 Altitude (m)" variant="outlined"
                required
                fullWidth
                placeholder="Enter info..."
                margin="dense"
                defaultValue={this.state.altitude}
                error={!validAltitudeInput}
                inputProps={{
                  maxlength: 25
                }}
                onChange={this.updateAltitude.bind(this)}
              />
            </div>
            <div>
              <TextField label="👾 Pixel Dimension (mm/px)" variant="outlined"
                required
                fullWidth
                placeholder="Enter info..."
                margin="dense"
                defaultValue={this.state.pixelDimension}
                error={!validPixelInput}
                inputProps={{
                  maxlength: 25
                }}
                onChange={this.updatePixelDimension.bind(this)}
              />
            </div>
            <div>
              <FormControlLabel
                value="start"
                control={<Checkbox
                  checked={this.state.bezierFit}
                  onChange={this.handleCheckbox.bind(this)}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  label="Bezier Fit"
                />}
                label="Bezier Fit"
                labelPlacement="start"
              />
            </div>
          </form>
            <MeasureButton onClick={this.measureLength.bind(this)} 
            disabled={this.state.buttonsDisabled || !this.state.measureLengthActive}
            variant="contained" color="secondary"
            >Measure Length</MeasureButton>

            <MeasureButton onClick={this.measureWidth.bind(this)} 
            disabled={this.state.buttonsDisabled || (!validWSInput || !this.state.measureWidthActive) || 
                  (this.state.mode === modes.PINS && this.state.curNumPins !== this.state.pinsNeeded)}
            variant="contained" color="secondary"
            >{this.state.widthsButtonText}</MeasureButton>

            <MeasureButton onClick={this.measureArea.bind(this)}
              disabled={this.state.buttonsDisabled || !this.state.measureAreaActive}
              variant="contained" color="secondary"
            >Measure Area</MeasureButton>

            <MeasureButton onClick={this.measureAngle.bind(this)} 
              disabled={this.state.buttonsDisabled || !this.state.measureAngleActive}
              variant="contained" color="secondary"
              >Measure Angle</MeasureButton>

            <MeasureButton onClick={this.undoPinDrop.bind(this)} 
            variant="contained" color="secondary"
            disabled={this.state.buttonsDisabled || this.state.mode !== modes.PINS || this.state.curNumPins === 0}
            >Undo Pin Drop</MeasureButton>

            <MeasureButton onClick={this.resetCanvas.bind(this)} 
            variant="contained" color="secondary"
            disabled={this.state.buttonsDisabled}
            >Reset Canvas</MeasureButton>

            <MeasureButton onClick={this.completeMeasurements.bind(this)} 
              disabled={this.state.buttonsDisabled || completeMeasurementsDisabled}
              variant="contained" color="primary"
              >Complete Measurements</MeasureButton>

            {this.state.buttonsDisabled && <ProgressBackdrop />}

            {this.state.showDialog && <MeasurementDialog measurementType={this.state.curMeasurementType} 
              onCancel={this.cancelMeasurement.bind(this)} 
              onClose={this.beginMeasurement.bind(this)}/>}
          <Legend/>

        </Grid>
        <Grid item xs={8}>
          <HotKeys
            keyMap={this.keyMap}
            style={styles.keyboardManager}
            handlers={this.getKeymapHandlers()}>
            <div className={'container'}
                style={{
                    ...styles.container,
                    ...this.props.style,
                    padding: 0
                }}
                onMouseMove={this.onDrag.bind(this)}
                onMouseUp={this.stopDrag.bind(this)}
                >
              <div style={styles.canvasContainer}>
                {isEditMode && ObjectEditor && (
                  <ObjectEditor object={currentObject}
                      offset={this.getOffset()}
                      onUpdate={(object) =>
                          this.updateObject(selectedObjectIndex, object)}
                      onClose={this.closeEditor.bind(this)}
                      measurementtype={this.state.curMeasurementType}
                      width={width}
                      height={height} />)}

                {showHandler && (
                  <Handler
                    boundingBox={handler}
                    onMouseLeave={this.hideHandler.bind(this)}
                    // onDoubleClick={this.showEditor.bind(this)} 
                    // removing ability to edit created object
                    onDrag={this.startDrag.bind(this, modes.DRAG)} /> )}

                {this.renderSVG()}
              </div>
              
            </div>
          </HotKeys>
        </Grid>
      </Grid>

    );
  }
}

export const styles = {
  container: {
    position: 'relative',
    // display: 'flex',
    // flexDirection: 'column',
    float: 'left',
    // width: '960px'
  },
  canvasContainer: {
    position: 'relative',
    float: 'left',
    borderRadius: 25,
  },
  keyboardManager: {
    outline: 'none'
  },
  measureButton: {
    margin: '5px 0px 5px 0px'
  }
}

export default Canvas;