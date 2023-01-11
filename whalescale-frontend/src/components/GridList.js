import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import GetAppIcon from '@material-ui/icons/GetApp';
import axios from 'axios';
import {withStyles} from "@material-ui/core/styles";
import {API_URL} from '../constants';



const useStyles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        //backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    title: { 
        paddingLeft: '0px', 
        paddingRight: '0px'
    }
});

 
class TitlebarGridList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mylist: [],
            mytoke: props.token
        }
    }

    componentDidMount() {
        const classes = useStyles();
        const mylist = [];
        axios.get(API_URL + 'image-list/', {
        headers: { Authorization: `Token ${this.state.mytoke}`}
    })
        .then(
            res => {
            const mylist = res.data;
            console.log(mylist);
            // mylist.map( (tile, i) => console.log(tile.id));
            this.setState({mylist: res.data.reverse()});
        }

        ).catch(function (error) {
            console.log(error);
        })
    }

    
    render() {
        const {classes} = this.props;
        const download = (e, data) => {
            axios({
                url: API_URL + 'get-excel/'+data.id,
                method: 'GET',
                responseType: 'blob'
            })
            .then((response)=> {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', data.name + '_measurements.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
        }
    
        return (
        <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
                    <ListSubheader component="div" className={classes.title}><h1 style={{fontSize: '40px', marginTop: '10px', marginBottom: '10px'}}>Your Images</h1></ListSubheader>
                </GridListTile>
                {this.state.mylist.map((tile, i) => (
                    <GridListTile key={i}>
                        <img src={tile.measured_link}/>
                        <GridListTileBar
                            title={tile.name}
                            subtitle={<span>View Measurements</span>}
                            actionIcon={
                                <IconButton aria-label={`info about ${tile.id}`} className={classes.icon} onClick = {e => download(e, tile)}>
                                    <GetAppIcon />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
        );
    }
} export default withStyles(useStyles, {withTheme: true}) (TitlebarGridList);