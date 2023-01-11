import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core';
import {Grid} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import { green, pink } from '@material-ui/core/colors';
import PageviewIcon from '@material-ui/icons/Pageview';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

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
    benefitCard: {
        maxWidth: 275,
        minWidth: 200,
        minHeight: 250,
        borderRadius: '10px',
    }, 
    contentCard: {
        marginTop: theme.spacing(2),
        maxWidth: '1000px',
        display: 'flex',
        padding: '15px',
        backgroundColor: 'rgb(158,185,237)',
        background: 'radial-gradient(circle, rgba(158,185,237,0.8547794117647058) 13%, rgba(212,160,226,0.8491771708683473) 88%)',
        fontColor: 'white',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'fullScreen',
        justify: 'center',
        fontSize: '24px',
        margin: '0 auto',
        borderRadius: '25px'
    },
    cardTitle: {
        fontSize: '16px',
        textAlign: 'center',
    }, 
    avatar: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
        justifyContent: 'center'
    },
    pink: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
    }
  }));

function Avatar1(props) {
    const classes=useStyles();
    return(
        <Avatar display='flex' style={{justifyContent:'center', display: 'flex'}}>
                            <FolderIcon></FolderIcon>
                        </Avatar>
    );
}
function Avatar2(props) {
    const classes=useStyles();
    return(
        <Avatar display='flex' className={classes.green} style={{justifyContent:'center', display: 'flex'}}>
                            <PageviewIcon></PageviewIcon>
                        </Avatar>
    );
}

function Avatar3(props) {
    const classes=useStyles();
    return(
        <Avatar display='flex' className={classes.pink} style={{justifyContent:'center', display: 'flex'}}>
                            <AssignmentIcon></AssignmentIcon>
                        </Avatar>
    );
}
function BenefitCard(props) {
    const classes = useStyles();

    let avatar;

    if (props.one === 'true') {
        avatar = <Avatar1></Avatar1>
    }
    else if (props.two === 'true') {
        avatar = <Avatar2></Avatar2>
    }
    else {
        avatar = <Avatar3></Avatar3>
    }

    return(
        <div>
            <Card className={classes.benefitCard}>
                <CardContent>
                    <div className={classes.avatar}>
                       {avatar}
                    </div>
                    
                    <Typography className={classes.cardTitle}>
                        {props.title}
                    </Typography>
                    <Typography variant='body2' color='textSecondary' component='p'>
                        {props.text}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}
function TitleCard(props) {
    const classes = useStyles();
    return (
        <div>
            <Typography variant='h1' style= {{width: '100%', maxWidth: 500}} component='h2' gutterBottom> 
                About
            </Typography>
        </div>
    );
}

function HeroSection(props) {
    const classes = useStyles();
    return (
        <div>
            <Card className={classes.contentCard}>
                <Typography variant='h4' style={{minHeight: 75, justifyContent: 'center', padding: 25}}>
                    <b>Welcome to WhaleScale!</b>
                </Typography>
                <Typography variant='subtitle1'>
                This page will teach you all you need to know to get started measuring a whale right from your own browser.

                WhaleScale is a project sponsored by the Duke Marine Lab, a subset of the Duke Nicholas School of the Environment. It aspires to connect you, the public, with the tools to humanely and safely measure whales from drone images, right on your own computer. WhaleScale uses software inspired by MorphimetriX, an image processing program developed by marine megafauna researchers Walter Torres and KC Bierlich. Like ImageJ and other UAS photogrammetry tools, MorphimetriX and by extension WhaleScale give you the user the ability to draw vectors, curves, and points to measure whales.
                </Typography>
            </Card>
        </div>
    );
}

function ImageSize(props) {
    const classes = useStyles();
    return (
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            <Card className={classes.contentCard}>
                <Typography variant='h4' style={{minHeight: 50, justifyContent: 'center', paddingTop: 25, paddingBottom: 15}}>
                   <b>Image Size</b>
                </Typography>
                <Typography variant='subtitle1' style={{justifyContent: 'center', alignText: 'center', padding: 25}}>
                    First, you need an image of a whale. This may seem easy at first, but not just any whale will do. You need a jpg or png file of a whale that is greater than 1000 by 666 pixels in dimension. Additionally, you need to make sure the whale in frame is not oblique; in other words, you need to view the whale from top down, not from the side.
                </Typography>
            </Card>
        </div>
    );
}

function Tutorial(props) {
    const classes = useStyles();
    return (
        <div style={{maxWidth: '1000px', marginTop: '64px', marginBottom: '0px', marginLeft: 'auto', marginRight: 'auto'}}>
            <Card className={classes.contentCard}>
                <Typography variant='h4' style={{minHeight: 50, justifyContent: 'center', paddingTop: 25, paddingBottom: 15}}>
                   <b>How to use the Canvas</b>
                </Typography>
                <Typography variant='subtitle1' style={{justifyContent: 'center', alignText: 'center', padding: 25}}>
                    Now, you can measure your whale by drawing vectors on your drone image! Draw vectors that mimic the curvature of the whale or its individual features, 
                    such as its fluke or its unique characteristics. Enable Bezier Fit on vectors that need a curve versus a vector. Measure angles by clicking
                    the measure angles button. When you are ready, click calculate! Then you can download your measurements as a csv or an image.
                </Typography>
            </Card>
        </div>
    );
}

function Parameters(props) {
    const classes = useStyles();
    return (
        <div style={{maxWidth: '1000px', marginTop: '64px', marginBottom: '0px', marginLeft: 'auto', marginRight: 'auto'}}>
            <Card style={{borderRadius: '25px'}}>
                <Typography variant='h4' style={{minHeight: 75, justifyContent: 'center', paddingTop: 35, paddingBottom: 15}}>
                   <b>Parameters</b>
                </Typography>
                <Typography variant='subtitle1' style={{justifyContent: 'center', alignText: 'center', padding: 25}}>
                Next, we need to fill out our parameters. No matter what whale image you capture, it’s important that you record several important parameters so the calculator knows how to apply it!

First, you need the altitude from which you took the photo in meters, and the focal length of your camera in millimeters.

Next, you need the pixel dimension of the photo itself, measured in millimeters per pixel. Don’t worry if you don’t know off the top of your head; we will autogenerate it for you! 

Next, you need the widths. This is important for measuring individual components of your whale. It can be any number you want; the software will divide your image into equal components set to the number you specify. If you want to measure your whale in quarters, put 4. If you want to be more specific, just specify! Enable that on your previous vector you have enabled Bezier fit so the widths know which vector to intersect.

                </Typography>
            </Card>
        </div>
    );
}

function FAQ() {
    const classes = useStyles();
    return (
        <div style={{maxWidth: '1000px', marginTop: '64px', marginBottom: '0px', marginLeft: 'auto', marginRight: 'auto'}}>
            <Card style={{ padding: 20, borderRadius: '25px'}}>
                <Typography variant='h4' style={{minHeight: 75, justifyContent: 'left', padding: 25}}>
                    <b>FAQ</b>
                </Typography>
                
                <Typography variant = 'h6' style={{paddingLeft: 10, paddingRight: 10}}>
                    <b>Q: How does WhaleScale make its measurements?</b>
                </Typography>

                <Typography variant= 'subtitle1' style={{paddingLeft: 10, paddingRight: 10}}>
                    A: WhaleScale uses the conceptual framework behind MorphimetriX, an image processing program developed by marine megafauna researchers at the
                    Duke Marine Robotics Lab, Walter Torres and KC Bierlich. Their research and documentation has been documented at this site, (https://joss.theoj.org/papers/10.21105/joss.01825). The conceptual framework and logic behind it has been published and peer reviewed at the Journal of Open Source Software.
                </Typography>

                <Typography variant = 'h6' style={{paddingLeft: 10, paddingRight: 10}}>
                    <b>Q: Who has access to my measurements?</b>
                </Typography>

                <Typography variant= 'subtitle1' style={{paddingLeft: 10, paddingRight: 10}}>
                    A: While WhaleScale saves copies of measurement files within its database, WhaleScale does not use any of it for scientific research or publication purposes, nor does it lay claim to the intellectual property of the users, including their measurements. Users can trust that all user data is used
                    only for authentification and safety purposes.
                </Typography>

                <Typography variant = 'h6' style={{paddingLeft: 10, paddingRight: 10}}>
                    <b>Q: What if I can't remember my password?</b>
                </Typography>

                <Typography variant= 'subtitle1' style={{paddingLeft: 10, paddingRight: 10}}>
                    A: Reach out to the database manager for technical support. 
                </Typography>

            </Card>
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

function About() {
    return (
        <div>
            <TitleCard></TitleCard>
            <HeroSection></HeroSection>
            

            <Typography variant='h3' style={{padding: '25px'}}>
                Morphometric analysis of cetaceans from aerial drone images
            </Typography>

            <iframe width="728" height="409.5" src="https://www.youtube.com/embed/1CM2SmLNMcI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            
            <Grid container spacing={6} style={{justifyContent:'center', alignContent: 'center', display:'grid', gridAutoFlow: 'column', padding: '32px',}}>
                <Grid item xs ={4}>
                    <BenefitCard title= 'Keep Organized' text='Save, view, and organize your measurements through your user dashboard' one ='true' ></BenefitCard>
                </Grid>
                <Grid item xs ={4}>
                    <BenefitCard title= 'Make Measurements' text='Use the canvas tool from your browser anywhere in the world and make trusted measurements.' two = 'true'></BenefitCard>
                </Grid>
                <Grid item xs ={4}>
                    <BenefitCard title= 'Share Your Findings' text='All content is completely open source and can be downloaded and shared within minutes.' three = 'true'></BenefitCard>
                </Grid>
            </Grid>

            <ImageSize></ImageSize>
            <Parameters></Parameters>
            <Tutorial></Tutorial>
            <FAQ></FAQ>
            <Box mt={8}>
                <Copyright />
            </Box>
        </div>
    )
}

export default About
