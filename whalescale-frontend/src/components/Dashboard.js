import React, {useContext} from 'react'
import Main from './db_components/Main/Main';
import SideBar from './db_components/Sidebar/Sidebar';
import {ThemeProvider} from 'styled-components';
import {GlobalStyles} from './db_components/styles/global';
import {lightTheme,darkTheme} from './db_components/styles/theme';
import {ThemeContext} from './db_components/styles/themeContext';

const Dashboard = props => {
    const context = useContext(ThemeContext);
    const {theme} = context; 
    console.log(props.username);
    console.log(props.token);
    return (
        <div>
            <ThemeProvider theme={theme ==='light' ? lightTheme : darkTheme}>
            < GlobalStyles/>
            <div>
                {/* <SideBar username = {props.username}/> */}
                <Main token = {props.token} />
            </div>
            </ThemeProvider>
        </div>
    )
}

export default Dashboard