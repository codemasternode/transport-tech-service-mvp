import React from 'react';

import { Drawer, List, Divider, ListItem, IconButton, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";
import { routes } from '../../App'
import MenuIcon from '@material-ui/icons/Menu';

export default function TemporaryDrawer() {

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            style={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {routes.map((value, index) => (
                    <ListItem button key={index}>

                        <Link to={value.path}>{value.name}</Link>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </div>
    );

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon onClick={toggleDrawer('left', true)} />
                    </IconButton>
                    <Typography variant="h6">
                        News
            </Typography>
                </Toolbar>
            </AppBar>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                {sideList('left')}
            </Drawer>
        </div>
    );
}