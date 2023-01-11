import React, {useState} from 'react'
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// Buttons With Icons

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


// function Navbar_Material() {
//     const classes = useStyles();

//     return (
//     <>
//             <Div d="flex">
//             <Button
//                 suffix={
//                     <Icon
//                         name="LongRight"
//                         size="16px"
//                         color="white"
//                         m={{ l: "1rem" }}
//                     />
//                 }
//                 shadow="3"
//                 hoverShadow="4"
//                 m={{ r: "1rem" }}
//             >
//                 Contact Us
//   </Button>
//             <Button
//                 prefix={
//                     <Icon
//                         name="EyeSolid"
//                         size="16px"
//                         color="white"
//                         m={{ r: "0.5rem" }}
//                     />
//                 }
//                 bg="warning700"
//                 hoverBg="warning800"
//                 rounded="circle"
//                 p={{ r: "1.5rem", l: "1rem" }}
//                 shadow="3"
//                 hoverShadow="4"
//             >
//                 Preview
//   </Button>
//         </Div>

// {/*     
//             <AppBar position="static">
//                 <Toolbar>
// <Typography variant="h6" className={classes.title}>
//                         <Link to="/" className="login">

//                         WhaleScale
//                         </Link>
//     </Typography>
//                     <Link to="/login" className="login">
//                         <Button color="inherit">Login</Button>
//                     </Link>
//                     <Link to= '/dashboard' className = "dashboard">
//                         <Button color = "inherit"> Dashboard </Button>
//                     </Link>
//                     <Link to="/register" className="register">
//                         <Button color="inherit">Register</Button>
//                     </Link>
                    
//                 </Toolbar>
//             </AppBar> */}

//     </>);
// }

// export default Navbar_Material