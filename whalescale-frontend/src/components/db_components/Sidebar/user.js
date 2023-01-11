import React from 'react'
import axios from 'axios';

class user extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: 'default', //what is your username?
          firstName: '',
          lastName: '',
          logged_in: localStorage.getItem('token') ? true: false, //are you logged in?
          mytoke: localStorage.getItem('token'),
        };
        const axios = require('axios');
      }

    componentDidMount() {
        axios.get('https://whalescale-stagingcicd.herokuapp.com/account-detail/${props.username}')
        .then(
          res => {
            this.setState({
                username: res.data.username,
                //firstName: res.data.firstName,
                //lastName: res.data.lastName
            })
            console.log(res.data.username);
        }
        ).catch(function (error) {
          console.log(error);
        })
    }
    render() {
        return ( <div></div>);
    }
}
export default user;
