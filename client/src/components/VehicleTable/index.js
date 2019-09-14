import React, { useState } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TableBase from './baseTable';
import { frequencies, currencies, currName } from '../../utils/dataOfDashboard';
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

export default function VehicleTable({ data, }) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        name: 'Pojazd 1',
        valueOfVehicle: "250000",
        petrol: "ON",
        combustion: 22,
        capacity: 8000,
        amortization: 15,
        lenght: 12,
        width: 12,
        height: 12,
        emptyVehicle: 10,
    })

    const [state, setState] = React.useState({
        data: [],
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const handleAddOrder = () => {
        let data = state.data;
        data.push({ name: values.name, currency: values.currency, valuePrice: values.valuePrice, frequency: values.frequency })
        setState({ data })
        console.log(state)

    }

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
            return <h5>Nie wybrałeś żadnej bazy firmy</h5>
        } else {
            return (
                data.bases.map((item, key) => (
                    <TableBase data={item} key={key} id={key} length={data.bases.length} />
                ))
            )
        }
    }

    const isRenderTable = () => {

    }

    return (

        <div className="root">
            <Grid container spacing={3} style={{ width: "70%" }}>
                <Grid item xs={12} sm={4}>
                    {isRenderList()}
                </Grid>
                <Grid item xs={12} sm={8}>
                    {}
                    <Button variant="contained" className={classes.button} onClick={handleAddOrder}>
                        Dodaj
                    </Button>
                </Grid>
            </Grid>
        </div>

    );
}