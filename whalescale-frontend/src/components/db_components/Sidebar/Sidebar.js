
import React from 'react'
import styled from 'styled-components';
import Menu from './Menu';
import Profile from './Profile';
import ToggleSwitch from './ToggleSwitch';
import user from './user';


const Container = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 16rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`



const Sidebar = props => {
    console.log(props.username);
    return (
        <Container>
            <Profile username = {props.username}> 
            </Profile>
            <Menu />
        </Container>
    )
}

export default Sidebar
