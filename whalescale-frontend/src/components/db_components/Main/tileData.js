import React from 'react'
import axios from 'axios';
import {API_URL} from '../../../constants';

class tileData extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            list: [1, 2, 3],
        }
        const axios = require('axios');
    }

    componentDidMount() {
        axios.get(API_URL + 'image-list/')
        .then(
            res => {
                this.state.list = res.data
            }
        ).catch(function (error) {
            console.log(error);
        })
    }

    render() {
        return(
            <div>

            </div>
        );
    }
    
}

export default tileData
