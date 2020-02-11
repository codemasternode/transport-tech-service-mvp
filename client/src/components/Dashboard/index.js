import React, { Fragment, useEffect, useState } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { useStyles } from '../../utils/styles';
import { Container, Button, Headings } from '../../utils/theme'
import { Accordion } from '../shared/AnimateAccordion/Accordion'
import { DashboardModel } from './DashboardModel'
import BaseComponent from './BaseComponent.jsx'
import DialogAlert from './DialogAlert.jsx'

const themes = createMuiTheme({
    palette: {
        error: {
            main: '#ff9900',
        }
    },
})

const mock = [
    {
        id: 0, name: "BAZA 1", vehicles: [
            { name: "WWW" },
            { name: "EEE" },
            { name: "HEEHE" },
        ]
    },
    {
        id: 1, name: "BAZA 2", vehicles: [
            { name: "EEE" },
            { name: "HEEHE" },
        ]
    },
]

const Dashboard = () => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [state, setState] = useState({
        selectedBase: "",
        selectedVehicle: "",
    })

    useEffect(() => {
        // fetch user data
        _fetchUserData();
    }, [])

    const _fetchUserData = () => {
        // get user data from api

    }

    const _setStatus = (e, baseName) => {
        const { name } = e.target;
        setStatus(name)
        setOpen(true)
    }

    const _confirmAction = () => {
        switch (status) {
            case "drop_base":
                // DashboardModel.dropUserBase()
                return;
            case "drop_vehicle":
                break;
            case "info_base":
                // get info 
                break;
            case "info_vehicle":
                // get info 
                break;
            default:
                return;
        }
    }

    const _dropUserBase = () => {
        // allow customers to drop their bases;
        // setStatus("drop_base")

    }

    const _dropUserVehicle = () => {
        // allow customers to drop their vehicles;
        // setStatus("drop_vehicle")
        setOpen(true)

    }

    const _getBaseInfo = () => {
        // allow customers to see info about bases;
        // setStatus("info_base")
        setOpen(true)
    }

    const _getVehicleInfo = () => {
        // allow customers to see info about bases;
        // setStatus("info_vehicle")
        setOpen(true)
    }

    const _switchAlert = value => {
        setOpen(value)
    }

    const _renderDialogAlert = () => {
        let info, title = "";
        console.log(status)
        switch (status) {
            case "drop_base":
                title = "Czy na pewno chcesz usunąć tą bazę?"
                break;
            case "drop_vehicle":
                title = "Czy na pewno chcesz usunąć ten pojazd?"
                break;
            case "info_base":
                // get info 
                break;
            case "info_vehicle":
                // get info 
                break;
            default:
                return;
        }

        return (
            <DialogAlert open={open} switchAlert={_switchAlert} confirmAction={_confirmAction}>
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {info}
                </DialogContent>
            </DialogAlert>
        )
    }

    const _vehiclesList = () => {
        // render accordion width list of available vehicles
        return (mock.map((item, key) => (
            <Accordion key={key} i={key} expanded={expanded} setExpanded={setExpanded} name={item.name} dropUserBase={_dropUserBase} setStatus={_setStatus}>
                <BaseComponent vehicles={item.vehicles} dropUserVehicle={_dropUserVehicle} getVehicleInfo={_getVehicleInfo} />
            </Accordion>
        )));
    }

    const _init = () => {
        return (
            // <Nav />
            <ThemeProvider theme={themes}>
                <div className={classes.root}>
                    <Container>
                        <Headings>
                            <h3>Lista pojazdów</h3>
                            <div>
                                <Button bColor="#ff9900">
                                    Dodaj bazę
                                </Button>
                                <Button bColor="#000000">
                                    Dodaj pojazd
                                </Button>
                            </div>
                        </Headings>
                        {_vehiclesList()}
                        {_renderDialogAlert()}
                    </Container>
                </div>
            </ThemeProvider>
        )
    }

    return _init();
}

export default Dashboard;