import React, { useState } from 'react';
import { Button, CssBaseline, TextField, CircularProgress, FormControlLabel, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NewCostPlan from './newCostPlan';
import { frequencies, currencies } from '../../utils/dataOfDashboard';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import './index.scss';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
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


const currName = { "USD": "$", "EUR": "€", "PLN": "zł" }

export default withRouter(({ history, data, handleAddOrder, handleRemoving }) => {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        name: 'Biuro rachunkowe',
        currency: "PLN",
        label: "zł",
        valuePrice: 500,
        frequency: 'miesięcznie'
    })

    const [state, setState] = React.useState({
        data: [],
        waitForRes: false,
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const nextStep = () => {
        setState({ ...state, waitForRes: true, })
        // axios.post('/api/newEmployee', { data: state.data }).then((response) => {
        //     setState({ ...state, waitForRes: false, })
        // }, (err) => {
        //     console.log(err)
        // })
        history.push('/employee-dashboard')

    }

    const isRenderList = () => {
        if (data.costs.length === 0) {
            return <h5 style={{ margin: '10px' }}>Nie wybrałeś żadnej bazy firmy</h5>
        } else {
            return (
                data.costs.map((item, key) => (
                    <NewCostPlan length={data.costs.length} data={item} id={key} handleRemoveOrder={handleRemoving} />
                ))
            )
        }
    }

    console.log(state)

    return (
        <div className="root">
            <div className="overlay" style={state.waitForRes ? { display: 'block' } : { display: 'none' }}>
                <div className="overlay__inner">
                    <div className="overlay__inner__progress">
                        <CircularProgress className="overlay__inner__progress" />
                    </div>
                </div>
            </div>
            <Container maxWidth="lg" >
                <Grid container justify="center"
                    direction="column"
                    alignItems="center">
                    <Grid item xs={12}>
                        <Grid container justify="center"
                            direction="row"
                            alignItems="center">
                            <Grid item xs={12} sm={4} className="container__database" >
                                <div className="container__database__list" style={{ minHeight: '450px' }}>
                                    {isRenderList()}
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Paper className={classes.paper} style={{ margin: '10px' }}>
                                    <form className={classes.container} noValidate autoComplete="off">
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="standard-name"
                                                    label="Nazwa"
                                                    className={classes.textField}
                                                    value={values.name}
                                                    onChange={handleChange('name')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    id="standard-value"
                                                    label={`Wartość ${currName[values.currency]}`}
                                                    className={classes.textField}
                                                    value={values.valuePrice}
                                                    onChange={handleChange('valuePrice')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    id="standard-select-currency"
                                                    select
                                                    label="Waluta"
                                                    className={classes.textField}
                                                    value={values.currency}
                                                    onChange={handleChange('currency')}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            className: classes.menu,
                                                        },
                                                    }}
                                                    helperText="Wybierz walutę płatności"
                                                    margin="normal"
                                                    variant="outlined"
                                                >
                                                    {currencies.map(option => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.value}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="standard-select-frequency"
                                                    select
                                                    label="Częstotliwość"
                                                    className={classes.textField}
                                                    value={values.frequency}
                                                    onChange={handleChange('frequency')}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            className: classes.menu,
                                                        },
                                                    }}
                                                    helperText="Wybierz okres płatności"
                                                    margin="normal"
                                                    variant="outlined"
                                                >
                                                    {frequencies.map(option => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.value}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                        <Button variant="contained" className={classes.button} onClick={() => {
                                            handleAddOrder("costs", values)
                                        }
                                        }>
                                            Dodaj
                                        </Button>
                                    </form>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div >
                            Ilość: {data.costs.length}
                            <Button variant="contained" className={classes.button} onClick={nextStep}>
                                Dalej
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div >
    );

})