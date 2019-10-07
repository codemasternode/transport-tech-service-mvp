import React, { useState } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, FormHelperText, Checkbox, Grid, Typography, Container, Paper, MenuItem, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TableBase from './baseTable';
import NewTable from './newTable';
import { frequencies, currencies, currName } from '../../utils/dataOfDashboard';
import { withRouter, Link } from "react-router-dom";
import './index.scss';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    root: {
        flexGrow: 1,
        minheight: '100vh',
        background: 'linear-gradient(top, #f2f2f2 70%, #232f3e 30%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    paperNewOrder: {
        height: '500px',
        overflowY: 'scroll'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
    },
    tts_logo: {
        maxWidth: '10%',
        height: 'auto',
    },
    button: {
        backgroundColor: '#ff9900',
    }

}));

export default withRouter(({ data, history, handleAddVehicle, handleChangeBase, handleNewForm, handleAdding }) => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        data: [],
        waitForRes: false
    })

    const handleRemoveOrder = (id) => {
        console.log(id)

        let data = state.data.filter((item, key) => {
            console.log(id, key)
            if (id !== key) { return item }
        })
        setState({ data })
    }


    const isRenderList = () => {
        if (data.bases.length === 0) {
            return (

                <React.Fragment>
                    <h5>Nie wybrałeś żadnej bazy firmy</h5>
                    <Button variant="contained" className={classes.button}>
                        <Link to="/database-dashboard">Wróć</Link>
                    </Button>
                </React.Fragment>
            )
        } else {
            return (
                data.bases.map((item, key) => (
                    <TableBase allData={data} handleChangeBase={handleChangeBase} handleAddVehicle={handleAddVehicle} data={item} key={key} id={key} length={data.bases.length} />
                ))
            )
        }
    }

    // const addNewForm = () => {
    //     let useFull = state.useFull
    //     useFull.push("2")
    //     console.log(useFull)
    //     setState({ ...state, useFull })
    // }

    const isRenderTable = () => {
        return (
            data.useFull.map((item, key) => (
                <NewTable key={key} handleAdding={handleAdding} handleChangeBase={handleChangeBase} allData={data} id={key} />
            ))
        )

    }

    const nextStep = () => {
        setState({ ...state, waitForRes: true, })
        // axios.post('/api/newEmployee', { data: data.plan }).then((response) => {
        //     setVisible({ ...visible, waitForRes: false, })
        // }, (err) => {
        //     console.log(err)
        // })
        history.push('/costs-dashboard')
    }

    return (

        <div className="root">
            <Grid container spacing={3} style={{ width: "70%" }}>
                <Grid item xs={12} sm={4}>
                    <div style={{ maxHeight: '450px', minHeight: '450px', overflowY: 'scroll', overflowX: 'hidden' }}>
                        {isRenderList()}
                    </div>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <div style={{ maxHeight: '450px', minHeight: '450px', overflowY: 'scroll', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isRenderTable()}
                    </div>
                    <br />
                    <Button variant="contained" className={classes.button} onClick={handleNewForm}>
                        Dodaj
                    </Button>
                </Grid>
                <Grid item xs={12} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <div >
                        Użytkownicy: {data.employees.length}<br />
                        <Button variant="contained" className={classes.button} onClick={nextStep}>
                            Dalej
                            </Button>
                    </div>
                </Grid>
            </Grid>
        </div>

    );
})