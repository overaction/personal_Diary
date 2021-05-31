import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {Menu} from 'semantic-ui-react';
import { AuthContext } from '../context/auth';

const Menubar = () => {
    const context = useContext(AuthContext);

    let pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substr(1);
    const [activeItem, setActiveItem] = useState(path);
    const handleItemClick = (e, {name}) => {
        setActiveItem(name);
        console.log(name)
    }

    const contextCheck = () => {
        const userDataJSON = JSON.parse(localStorage.getItem('userData'));
        if(userDataJSON) context.login(userDataJSON.username)
        console.log(userDataJSON)
    }

    useEffect(() => {
        contextCheck()
    },[])

    const logout = () => {
        context.logout();
        setActiveItem('home')
        localStorage.removeItem('userData');
    }
    
    const menuBar = context.user ? (
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item
                name={context.user}
                content={context.user}
                onClick={handleItemClick}
                active={activeItem === context.user || activeItem === 'home' || activeItem === 'login'}
                as={Link}
                to="/"
            />
            <Menu.Menu position="right">
                <Menu.Item
                    name="create"
                    active={activeItem === "create"}
                    as={Link}
                    to="/createpost"
                    onClick={handleItemClick}
                />
                <Menu.Item name="logout" onClick={logout} />
            </Menu.Menu>
        </Menu>
    ) : (
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item
                name="home"
                active={activeItem === "home"}
                onClick={handleItemClick}
                as={Link}
                to="/"
            />
            <Menu.Menu position="right">
                <Menu.Item
                    name="login"
                    active={activeItem === "login"}
                    onClick={handleItemClick}
                    as={Link}
                    to="/login"
                />
            </Menu.Menu>
            <Menu.Item
                name="register"
                active={activeItem === "register"}
                onClick={handleItemClick}
                as={Link}
                to="/register"
            />
        </Menu>
    );

    return menuBar;
}

export default Menubar