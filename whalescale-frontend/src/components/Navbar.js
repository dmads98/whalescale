import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import {FaBars, FaTimes } from 'react-icons/fa';
import {Button} from './Button'; 
import './Navbar.css';
import  {IconContext} from 'react-icons/lib';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const showButton = () => {
        if(window.innerWidth <= 960) { //if width of screen is Mobile size, show hamburger menu instead of navBar.
            setButton(false)
        }
        else {
            setButton(true);
        }
    }

    window.addEventListener('resize', showButton);
    return (
    <>
    <IconContext.Provider value= {{color: '#fff'}}>
    <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-logo"> 🐳 </div>
            <Link to="/" className="navbar-logo" onClick= {closeMobileMenu}>
                WhaleScale <i className='i.fab-typo3' />
            </Link>
            <div className ='menu-icon' onClick={handleClick}>
                {click ? <FaTimes /> : <FaBars />}
            
            </div>    
            <ul className = {click ? 'nav-menu active' : 'nav-menu'}>
                <li className = 'navitem'>
                    <Link to= '/home' className='nav-links' onClick= {closeMobileMenu}>
                        <Button buttonColor='navy' buttonStyle ='btn--outline' onClick= {closeMobileMenu}>
                            Home
                        </Button>
                    </Link>
                </li>
                <li className = 'navitem'>
                    <Link to= '/search' className='nav-links' onClick= {closeMobileMenu}>
                        <Button buttonColor='navy'>
                            About
                        </Button>
                    </Link>
                </li>
                <li className='nav-btn'>
                    {button ? (
                        <Link to= '/sign-up' className= 'btn-link' onClick= {closeMobileMenu}>
                            <Button buttonStyle='btn--outline'> Sign up 
                            </Button>
                        </Link>) :
                        (<Link className = 'btn-link'>
                            <Button buttonStyle = 'btn--outline' onClick= {closeMobileMenu}
                            buttonSize= 'btn--mobile'> Sign Up </Button>
                        </Link>)
                    }
                </li>
            </ul>
           
        </div>
    </nav>
    </IconContext.Provider>
    </>);
}

export default Navbar