import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MeasurementDialog(props) {
  const [open, setOpen] = React.useState(true);
  const [disabled, setDisabled] = React.useState(true);
  const [name, setName] = React.useState("");
  const measurementType = props.measurementType.charAt(0).toUpperCase() + props.measurementType.slice(1);
  const dialogTitle = "New " + measurementType + " Measurement";

  const handleClose = () => {
    setOpen(false);
    props.onClose(name);
  };

  const handleValueChange = (event) => {
    setName(event.target.value);
    if (event.target.value.length > 0){
      setDisabled(false);
    }
    else {
      setDisabled(true);
    }
  }

  const handleEnterPress = (event) => {
    if(event.key === 'Enter'){
      if (!disabled){
        handleClose();
      }
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
      onKeyPress={open ? handleEnterPress : undefined }
      TransitionComponent={Transition}
      disableBackdropClick
      disableEscapeKeyDown>
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Measurement Name"
            variant="outlined"
            fullWidth
            onChange={handleValueChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" disabled={disabled}>
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}