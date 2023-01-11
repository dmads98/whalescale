import React, { useState } from 'react';
import axios from 'axios';
import FileDrop from './components/FileDrop';
import './App.css';
import Navbar_Material from './components/Navbar_Material';
import SignIn from './components/SignIn';
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Snackbar} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useHistory, withRouter } from "react-router-dom";
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Measure from './components/Measure';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import {API_URL} from './constants';
import Logo from './whalescalelogo.transparent.gif';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import About from './pages/About';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 //+ rand();
  const left = 50 //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    borderCollapse: 'collapsed',
    borderRadius: '25px',
    backgroundColor: theme.palette.background.paper,
    border: '0px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function LoginModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openReg, setOpenReg] = React.useState(false);

  const handleOpenReg = () => {
    setOpenReg(true);
  };

  const handleCloseReg = () => {
    setOpenReg(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <SignIn />
    </div>
  );

  const signUpBody = (
    <div style={modalStyle} className={classes.paper}>
      <Register />
    </div>
  );

  return (
    <div>
      <div className="grid">

      <button type="button" onClick={handleOpen}>
<a className="card" style={{ border: "1px solid #eaeaea" }} >
          <h3>🔑 Login</h3>
          <p>Login into your WhaleScale account.</p>
          </a>   </button>      <button type="button" onClick={handleOpenReg}>  <a className="card" style={{ border: "1px solid #eaeaea" }}>
            <h3>🌟 Register</h3>
            <p>Create a WhaleScale account to save and tag your measurements.</p>
          </a> </button></div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Fade in={open}>

        {body}
        </Fade>

      </Modal>
      <Modal
        open={openReg}
        onClose={handleCloseReg}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Fade in={open}>

          {signUpBody}
        </Fade>

      </Modal>

    </div>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://whalescale-one.vercel.com/">
        WhaleScale
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Home() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [showForm, setShowForm] = useState(false);
  const [registered, isLoggedIn] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.history.go()
  };

  const body = (
    <div style={modalStyle} className={classes.paper} id='btn'>
      <Dashboard logged_in={localStorage.getItem('token')} username={'default'} token={localStorage.getItem('token')}></Dashboard>
    </div>
  );

  function UserGreeting(props) {
    return <div className="grid">
      <a onClick={handleOpen} className="card" style={{ border: "1px solid #eaeaea" }} >
        <h3>📏 Dashboard</h3>
        <p>View and browse your measurements.</p>
      </a> <a onClick={handleLogout} className="card" style={{ border: "1px solid #eaeaea" }} >
        <h3>💨 Log out</h3>
        <p>Log out of your account.</p>
      </a>
         <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Fade in={open}>

          {body}
        </Fade>

      </Modal>
      
      </div>

  }

  function GuestGreeting(props) {
    return <div className="grid">
      <a href="/login" className="card" style={{ border: "1px solid #eaeaea" }} >
        <h3>🔑 Login</h3>
        <p>Login into your WhaleScale account.</p>
      </a>
      <a href="/register" className="card" style={{ border: "1px solid #eaeaea" }}>
        <h3>🌟 Register</h3>
        <p>Create a WhaleScale account to save and tag your measurements.</p>
      </a></div>
  }

  function Greeting(props) {
    if (localStorage.getItem('token')) {
      return <UserGreeting />;
    }
    return <GuestGreeting />;
  }

  return (
    <>
        {/* <div className="grid22"><a href="#" className="button" style={{ border: "1px solid #eaeaea" }}>
          <h2>Login</h2>
        </a>
          <a href="#" className="button" style={{ border: "1px solid #eaeaea" }}>
            <h2>Register</h2>
          </a> </div> */}
        {/* <div className="title">
          <img src={Logo} style={{width: '100px', height: '200px'}}/>
        </div> */}

        <img src={Logo} style={{width: '150px', height: '150px'}}/><br></br>
        <h1 className="title">
          Welcome to <a href="https://whalescale-one.vercel.app">WhaleScale!</a>
        </h1>

        <p className="description">
          Morphometric analysis of cetaceans from aerial drone images
        </p>
        <br/>
        <br/>
          <Measure/>
        <div className="grid" style={{margin: '0 auto'}}>
          {/* <LoginModal /> */}
          <Greeting />

          <a href="/about" className="card" style={{ border: "1px solid #eaeaea" }}>
            <h3>🤷🏽‍♀️ Tutorial</h3>
            <p>Learn more about how to use WhaleScale.</p>
          </a>

          <a href="https://github.com/wingtorres/morphometrix" className="card" style={{ border: "1px solid #eaeaea" }}>
            <h3>🔬 Open Science</h3>
            <p>WhaleScale uses open-source photogrammetry software packages.</p>
          </a>

          <a href="https://sites.nicholas.duke.edu/johnston/" className="card" style={{ border: "1px solid #eaeaea" }}>
            <h3>🐋 Johnston Lab</h3>
            <p>To learn more about conservation of marine species visit the Johnston Lab.</p>
          </a>
        </div><br />
        <Box mt={8}>
          <Copyright />
        </Box>
    </>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '', //what page are you on?
      logged_in: localStorage.getItem('token') ? true: false, //are you logged in?
      mytoke: localStorage.getItem('token'),
      username: 'default', //what is your username?
      password: '', //idk why but its necessary
      activeEdit: false, //are you actively editing an image?
      history: ''
    };
    const axios = require('axios');
    
  }

  componentDidMount() {
    if (this.state.logged_in) { 
      {/*
      axios.post('https://whalescale-stagingcicd.herokuapp.com/login/', 
      { auth: {
        username: this.state.username,
        password: this.state.password
      }}).then(
        res => res.json //save the data? unclear
      )
      //show that user is logged in. SignUp is not an option. Dashboard is an option
      */}
    }
    else {
      //SignUp is an option. Dashboard is invisible
    }
  }

  storeLoginInfo(username, token){
    localStorage.setItem('token', token);
    this.setState({
      logged_in: true,
      username: username,
      mytoke: token
    });
    window.location='/';
  }

  handle_signup = (e, data) => {
    e.preventDefault();
    axios.post(API_URL + 'register/', data)
    .then (
      res => {
        this.storeLoginInfo(data.username, res.data.token);
      }
    )
  }

  render() {
    
    return(
      <main>
      <React.Fragment>
        <CssBaseline />
    <div className="App" style={{minHeight: '100%'}}>
      <Router>
      {/* <Navbar_Material/> */}
      <Switch>
            <Route path="/login">
            <SignIn storeLoginInfo = {this.storeLoginInfo.bind(this)}/> 
              {/*this.state.logged_in ?  <SignIn handle_login = {this.handle_login}/> :<Redirect from = '/login' to='/dashboard'></Redirect>*/ }
            </Route>
            <Route path="/register">
              <Register handle_signup = {this.handle_signup} />
            </Route>
            <Route path="/" exact component = {Home}>
              
            </Route>
            <Route path="/dashboard">
              <Dashboard logged_in = {this.state.logged_in} username = {this.state.username} token = {this.state.mytoke}></Dashboard>
            </Route>
            <Route path='/about'>
              <About></About>
            </Route>
      </Switch>
      </Router>
    </div> 
      </React.Fragment>
    </main>
    );
  }
}

export default App;
