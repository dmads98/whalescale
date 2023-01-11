import React, { Component } from 'react';
import Canvas from "./canvas/components/Canvas";
import FileDrop from "./FileDrop";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import Results from './Results';
import {API_URL} from '../constants';
import axios from "axios";

export default class extends Component {
  state = {
    files: [],
    objects: [],
    curImageWidth: 0,
    curImageHeight: 0,
    imagePath: "",
    showWarning: false,
    canvasHeight: 666,
    canvasWidth: 1000,
    canvasOpen: false,
    showResults: false,
    measuredLengths: [],
    measuredAreas: [],
    measuredAngles: [],
    measuredFocalLength: 0,
    measuredAltitude: 0,
    measuredPixelDimension: 0,
    measuredImageName: "",
    imageId: ""
  };

  handleUpdate(objects) {
    this.setState({
      objects: objects
    });
  }

  resetObjects(){
    this.setState({
      objects: []
    });
  }

  handleClose = (event, reason) => {
    this.setState({
        showWarning: false
    })
  };

  showFinalResults(lengths, areas, angles, focalLength, altitude, pixelDimension, imageName, imageId, screenshot, screenshotName){
    this.setState({
      canvasOpen: false,
      measuredLengths: lengths,
      measuredAreas: areas,
      measuredAngles: angles,
      measuredFocalLength: focalLength,
      measuredAltitude: altitude,
      measuredPixelDimension: pixelDimension,
      measuredImageName: imageName,
      screenshot: screenshot,
      imageId: imageId,
      showResults: true
    });
    this.uploadImages(imageId, screenshot, screenshotName);
  }

  uploadImages(imageId, screenshot, screenshotName){
    let curImage = this.state.files[0];
    let form_data = new FormData();
    form_data.append('image', curImage, curImage.name);
    form_data.append('measurementsImage', screenshot, screenshotName); 
    axios.post(API_URL + "uploadImages/" + imageId + "/", form_data).then(res => {
      console.log(res);
    });
  }

  //TODO: move logic to filedrop
  //only accepting first image
  handleFileDropUpdate(files){
    this.resetObjects();
    this.setState({
        canvasOpen: false,
        showResults: false,
        files: [files[0]]
    });
    let img = new Image();
    img.onload = e => {
        if (img.height < this.state.canvasHeight || img.width < this.state.canvasWidth){
            this.setState({
                showWarning: true
            });
        }
        else {
            this.setState({
                curImageHeight: img.height,
                curImageWidth: img.width,
                imagePath: this.state.files[0].preview,
                canvasOpen: true,
                curImage: img
            });
        }
    }
    img.src = files[0].preview;
  }

  render() {
    return (
        <div>
            <div style={{margin: 'auto'}} className="grid">
              <FileDrop fileDropUpdate={this.handleFileDropUpdate.bind(this)}/>
            </div>
            <br/>
            <br/>
            {this.state.canvasOpen ?
                  (<div style={{
                    margin: 'auto',
                    position: 'relative',
                    width: '1000px'}} id="box">
                    <Canvas
                        width={this.state.canvasWidth} height={this.state.canvasHeight}
                        imageWidth={this.state.curImageWidth}
                        imageHeight={this.state.curImageHeight}
                        imagePath={this.state.imagePath}
                        reset={this.resetObjects.bind(this)}
                        image={this.state.files[0]}
                        curImageElement={this.state.curImage}
                        objects={this.state.objects}
                        closeCanvas={this.showFinalResults.bind(this)}
                        onUpdate={this.handleUpdate.bind(this)}/>
                  </div>)
                      : ("")
              }
            
            {this.state.showResults && 
              <Results
                screenshot={this.state.screenshot}
                imageId={this.state.imageId}
                imageName={this.state.measuredImageName}
                pixelDimension={this.state.measuredPixelDimension}
                altitude={this.state.measuredAltitude}
                focalLength={this.state.measuredFocalLength}
                lengths={this.state.measuredLengths}
                areas={this.state.measuredAreas}
                angles={this.state.measuredAngles}
              />
            }
            <Snackbar
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
                open={this.state.showWarning}
                autoHideDuration={6000}
                onClose={this.handleClose.bind(this)}
                message="Image Resolution Too Low"
                action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose.bind(this)}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }/>
        </div>
    );
  }
}