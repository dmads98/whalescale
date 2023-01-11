import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import axios from "axios";
import {API_URL} from '../constants';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';


const useStyles = makeStyles({
  root: {
    minWidth: 275,
    background: 'radial-gradient(circle, rgba(165,196,233,1) 60%, rgba(230,185,204,1) 92%)',
    backgroundColor: 'rgb(165,196,233)',
    borderRadius: '10px'
  },
  container: {
    maxHeight: 600,
    maxWidth: 800,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
    marginLeft: 12
  },
  table: {
    minWidth: 650
  },
});

const StyledHeaderRow = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.action.hover
    },
}))(TableRow);


export default function Results(props) {

    const downloadCSV = (e, imageId, imageName) => {
        axios({
            url: API_URL + 'get-excel/' + imageId,
            method: 'GET',
            responseType: 'blob'
        })
        .then((response)=> {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', imageName + '_measurements.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
    }

    const downloadImage = () => {
        const url = window.URL.createObjectURL(props.screenshot);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', props.imageName + '.png'); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const classes = useStyles();
    let numWidths = 1;
    for (let i = 0; i < props.lengths.length; i++){
        numWidths = Math.max(numWidths, props.lengths[i].widths.length + 1);
    }
    return (
    <Card elevation={3} raised className={classes.root} variant="outlined">
        <CardContent>
            <h1>🐳 Measurements Completed! 🐳</h1>
            <TableContainer className={classes.container} component={Paper}>
                <Table className={classes.table} aria-label="a dense sticky table" stickyHeader>
                    <TableHead>
                        <StyledHeaderRow>
                            <TableCell><b>Image Name</b></TableCell>
                            <TableCell align="right"><b>{props.imageName}</b></TableCell>
                            {_.times(numWidths, i => <TableCell/>)}
                        </StyledHeaderRow>
                    </TableHead>
                    <TableBody>
                        <StyledHeaderRow>
                            <TableCell><b>Focal Length</b></TableCell>
                            <TableCell align="right">{props.focalLength}</TableCell>
                            {_.times(numWidths, i => <TableCell/>)}
                        </StyledHeaderRow>
                        <StyledHeaderRow>
                            <TableCell><b>Altitude</b></TableCell>
                            <TableCell align="right">{props.altitude}</TableCell>
                            {_.times(numWidths, i => <TableCell/>)}
                        </StyledHeaderRow>
                        <StyledHeaderRow>
                            <TableCell><b>Pixel Dimension</b></TableCell>
                            <TableCell align="right">{props.pixelDimension}</TableCell>
                            {_.times(numWidths, i => <TableCell/>)}
                        </StyledHeaderRow>
                        <StyledHeaderRow>
                            <TableCell><b>Length Names</b></TableCell>
                            <TableCell align="right"><b>Length (m)</b></TableCell>
                            <TableCell align="right"><b>Widths (%)</b></TableCell>
                            {_.times(numWidths - 1, i => <TableCell/>)}
                        </StyledHeaderRow>
                        {props.lengths.length > 0 ? (props.lengths.map((length) => (
                            <TableRow key={length.name}>
                                <TableCell component="th" scope="row">
                                    {length.name}
                                </TableCell>
                                <TableCell align="right">{length.value.toFixed(5)}</TableCell>
                                {length.widths.map((width) => (
                                    <TableCell align="right">{width.toFixed(5)}</TableCell>
                                ))}
                                {_.times(numWidths - length.widths.length, i => <TableCell/>)}
                            </TableRow>
                        ))) : 
                        (<TableRow>
                            <TableCell>None</TableCell>
                            {_.times(numWidths + 1, i => <TableCell/>)}
                        </TableRow>)}
                        <StyledHeaderRow>
                            <TableCell><b>Angle Names</b></TableCell>
                            <TableCell align="right"><b>Angle (°)</b></TableCell>
                            {_.times(numWidths, i => <TableCell/>)}
                        </StyledHeaderRow>
                        {props.angles.length > 0 ? (props.angles.map((angle) => (
                            <TableRow key={angle.name}>
                                <TableCell component="th" scope="row">
                                    {angle.name}
                                </TableCell>
                                <TableCell align="right">{angle.value.toFixed(5)}</TableCell>
                                {_.times(numWidths, i => <TableCell/>)}
                            </TableRow>
                        ))) : 
                        (<TableRow>
                            <TableCell>None</TableCell>
                            {_.times(numWidths + 1, i => <TableCell/>)}
                        </TableRow>)}
                        <StyledHeaderRow>
                            <TableCell><b>Area Names</b></TableCell>
                            <TableCell align="right"><b>Area (m²)</b></TableCell>
                            {_.times(numWidths, i => <TableCell/>)}
                        </StyledHeaderRow>
                        {props.areas.length > 0 ? (props.areas.map((area) => (
                            <TableRow key={area.name}>
                                <TableCell component="th" scope="row">
                                    {area.name}
                                </TableCell>
                                <TableCell align="right">{area.value.toFixed(5)}</TableCell>
                                {_.times(numWidths, i => <TableCell/>)}
                            </TableRow>
                        ))) :
                        (<TableRow>
                            <TableCell>None</TableCell>
                            {_.times(numWidths + 1, i => <TableCell/>)}
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </CardContent>
        <CardActions className={classes.pos}>
        <Button size="medium"
            variant="contained" color="primary"
            onClick={e => downloadCSV(e, props.imageId, props.imageName)}
            endIcon={<GetAppRoundedIcon/>}>
            Export CSV
        </Button>
        <Button size="medium"
            variant="contained" color="primary"
            onClick={e => downloadImage()}
            endIcon={<GetAppRoundedIcon/>}>
            Download Image
        </Button>
        </CardActions>
    </Card>
    );
}