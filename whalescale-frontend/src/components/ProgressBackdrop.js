import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function ProgressBackdrop() {
  const classes = useStyles();

  return (
    <div>
      <Backdrop open className={classes.backdrop}>
          <Box position="relative" display="inline-flex">
          <CircularProgress color="primary" size={160}/>
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6" component="div" color="inherit"><b>Calculating...</b></Typography>
          </Box>
        </Box>
      </Backdrop>
    </div>
  );
}

export default ProgressBackdrop;