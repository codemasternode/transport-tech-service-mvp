import React, { Fragment, useEffect, useState } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { useStyles } from '../../utils/styles';
import { Container, Button, Headings, RootElement } from '../../utils/theme'
import { Accordion } from '../shared/AnimateAccordion/Accordion'
import { fetchCustomerData, createNewBase, createNewVehicle, dropCustomerBase } from '../../reducers/dashboard/duck/operations';
import Header from '../shared/Header/Header.jsx'
import NewVehicleContent from './NewVehicleContent.jsx'
import AuthService from '../../services/AuthService'
import { useDispatch, useSelector } from 'react-redux'
import NewBaseContent from './NewBaseContent.jsx'
import DetailsBaseContent from './DetailBaseContent.jsx'
import BaseComponent from './BaseComponent.jsx'
import DialogAlert from './DialogAlert.jsx'

const themes = createMuiTheme({
    palette: {
        error: {
            main: '#ff9900',
        }
    },
})

const Dashboard = () => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [state, setState] = useState({
        selectedBase: "",
        selectedVehicle: "",
    })
    const dispatch = useDispatch()
    const { customerData } = useSelector(state => state.dashboard)
    // console.log(customerData)

    useEffect(() => {
        // fetch user data
        _fetchUserData();
        _validAuthCustomer();
        // dispatch(fetchCustomerData());

    }, [])

    const _fetchUserData = () => {
        // get user data from api
        dispatch(fetchCustomerData());
    }

    const _validAuthCustomer = () => {
        setInterval(() => {
            AuthService.isLoggedIn()
        }, 1000)
    }

    const _setStatus = (e, value, baseName) => {
        const { name } = e.target;
        // console.log(name, value, baseName)
        if (baseName === "base") {
            setState({
                ...state,
                selectedBase: value
            })
        } else if (baseName === "vehicle") {
            setState({
                ...state,
                selectedVehicle: value
            })
        }
        setStatus(name)
        setOpen(true)
    }

    const _confirmAction = data => {
        const { selectedBase } = state;
        switch (status) {
            case "create_base":
                dispatch(createNewBase(data));
                break;
            case "create_vehicle":
                dispatch(createNewVehicle(data));
                break;
            case "drop_base":
                dispatch(dropCustomerBase(selectedBase));
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

    const _createNewBase = () => {

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
        const { selectedBase } = state;
        console.log(state)
        switch (status) {
            case "create_base":
                title = "Dodawanie bazy"
                info = <NewBaseContent switchAlert={_switchAlert} />
                break;
            case "create_vehicle":
                title = "Dodawanie pojazdu"
                info = <NewVehicleContent switchAlert={_switchAlert} />
                break;
            case "drop_base":
                title = "Czy na pewno chcesz usunąć tą bazę?"
                info = selectedBase;
                break;
            case "drop_vehicle":
                title = "Czy na pewno chcesz usunąć ten pojazd? "
                break;
            case "info_base":
                // get info 
                title = "Informacje o bazie";
                info = <DetailsBaseContent selectedBase={selectedBase} />
                break;
            case "info_vehicle":
                // get info 
                break;
            default:
                return;
        }

        return (
            <DialogAlert open={open} switchAlert={_switchAlert} confirmAction={_confirmAction} status={status}>
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {info}
                </DialogContent>
            </DialogAlert>
        )
    }

    const _vehiclesList = () => {
        // render accordion width list of available vehicles
        console.log(customerData)
        if (customerData.company !== undefined) {
            const { companyBases } = customerData.company;
            console.log(companyBases)
            return (companyBases.map((item, key) => (
                <Accordion key={key} i={key} expanded={expanded} setExpanded={setExpanded} name={item.name} setStatus={_setStatus}>
                    <BaseComponent vehicles={item.vehicles} dropUserVehicle={_dropUserVehicle} getVehicleInfo={_getVehicleInfo} />
                </Accordion>
            )));
        } else {
            // return <h2> :/</h2>
        }
    }

    const _init = () => {
        return (
            // <Nav />
            <ThemeProvider theme={themes}>
                {/* <div className={classes.root}> */}
                <RootElement>
                    <Header />
                    <Container>
                        <Headings>
                            <h3>Lista pojazdów</h3>
                            <div>
                                <Button name="create_base" bColor="#ff9900" onClick={e => _setStatus(e)}>
                                    Dodaj bazę
                                </Button>
                                <Button name="create_vehicle" bColor="#000000" onClick={e => _setStatus(e)}>
                                    Dodaj pojazd
                                </Button>
                            </div>
                        </Headings>
                        {_vehiclesList()}
                        {_renderDialogAlert()}
                    </Container>
                </RootElement>
                {/* </div> */}
            </ThemeProvider>
        )
    }

    return _init();
}

export default Dashboard;