import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    maxWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
        
      <CardContent>
              <Chip
                  avatar={<Avatar>M</Avatar>}
                  label="Martin Stoyanov"
                  variant="outlined"
              /><br/>
        <Typography variant="h5" component="h2">
          154 images
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          6 species
        </Typography>
        {/* <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
      <CardActions>
              <Button size="small" color="primary">Export Data</Button>
              <Button size="small" color="primary">Measure new</Button>

      </CardActions>
    </Card>
  );
}
