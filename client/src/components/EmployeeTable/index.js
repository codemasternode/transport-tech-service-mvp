import React, { useState } from 'react';
import { Button, CssBaseline, TextField, CircularProgress, FormControlLabel, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TableElement from './TableElement';
import { frequencies, currencies } from '../../utils/dataOfDashboard';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import './index.scss'

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    root: {
        flexGrow: 1,
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    grid_item: {
        height: '100%'
    },
    paperNewOrder: {
        height: '500px',
        width: '100%',
        overflowY: 'scroll',
        position: 'relative',
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
    },
    numberOfEmployee: {
        position: 'absolute',
        bottom: 0,
    }

}));



export default withRouter(({ history, data, handleAddEmployees, handleRemoving }) => {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        firstName: '',
        lastName: '',
        sallary: 4500,
        currency: 'PLN',
        position: ''
    })

    const [state, setState] = React.useState({
        waitForRes: false,
        data: [],
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

        history.push('/admin-dashboard')

    }

    console.log(currencies)

    return (
        <div className={classes.root}>
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
                            <Grid item xs={12} sm={4} className={classes.grid_item} >
                                <div className={classes.paperNewOrder}>
                                    <div>
                                        {
                                            data.employees.length > 0 ? data.employees.map((item, key) => (
                                                <TableElement data={item} id={key} handleRemoving={handleRemoving} />
                                            )) : null
                                        }
                                    </div>
                                </div>

                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Paper className={classes.paper}>
                                    <form className={classes.container} noValidate autoComplete="off">
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="standard-name"
                                                    label="Imię"
                                                    className={classes.textField}
                                                    value={values.firstName}
                                                    onChange={handleChange('firstName')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="standard-value"
                                                    label="Nazwisko"
                                                    className={classes.textField}
                                                    value={values.lastName}
                                                    onChange={handleChange('lastName')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    id="standard-value"
                                                    label={`Pensja`}
                                                    className={classes.textField}
                                                    value={values.sallary}
                                                    onChange={handleChange('sallary')}
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
                                                    id="standard-position"
                                                    label="Stanowisko"
                                                    className={classes.textField}
                                                    value={values.position}
                                                    onChange={handleChange('position')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button variant="contained" className={classes.button} onClick={() => {
                                            handleAddEmployees("employee",values)
                                            setValues({
                                                firstName: '',
                                                lastName: '',
                                                sallary: 4500,
                                                currency: 'PLN',
                                                position: ''
                                            })
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
                            Użytkownicy: {data.employees.length}<br />
                            <Button variant="contained" className={classes.button} onClick={nextStep}>
                                Dalej
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
})