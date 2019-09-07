import React from "react";
import "./index.scss";
import { makeStyles } from '@material-ui/core/styles';
import { Button, CssBaseline, TextField, CircularProgress, FormControlLabel, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper, MenuItem } from '@material-ui/core';
import TableElement from './TableElement'

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    root: {
        flexGrow: 1,
        minHeight: '100vh',
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
        width: '80%',
    },
    tts_logo: {
        maxWidth: '10%',
        height: 'auto',
    },
    button: {
        backgroundColor: '#ff9900',
        maxWidth: '50%'
    },
    numberOfEmployee: {
        position: 'absolute',
        bottom: 0,
    }

}));

const inputData = [
    { name: "name", label: "Imię", value: "name" },
    { name: "surname", label: "Nazwisko", value: "surname" },
    { name: "password", label: "Hasło", value: "password" },
    { name: "confirmPassword", label: "Powtórz hasło", value: "confirmPassword" },
    { name: "email", label: "Email", value: "email" },
]


function Table(props) {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [state, setState] = React.useState({
        data: [],
        workers: props.users
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };


    const handleAddUser = (id) => {
        console.log(state.workers)
        let propData = state.workers.filter((item, key) => {
            console.log(id, key)
            if (id !== key) { return item }
        })

        console.log(propData)
        let data = state.data;
        data.push(state.workers[id])
        setState({
            ...state,
            data,
            workers: propData
        })
    }

    const handleRemoveUser = (id) => {
        console.log(state.data)
        var dataProp
        let data = state.data.filter((item, key) => {
            console.log(id, key)
            if (id !== key) {
                return item
            } else {
                dataProp = item
            }
        })
        let workers = state.workers;
        workers.push(dataProp)
        setState({ ...state, data, workers})
        console.log(state.data)

    }

    const handleAddNewUser = () => {
        let data = state.data;
        data.push({ name: values.name, surname: values.surname, email: values.email, password: values.password, confirmPassword: values.confirmPassword })
        setState({ ...state, data })
        setValues({
            name: '',
            surname: '',
            email: '',
            password: '',
            confirmPassword: ''
        })
    }

    return (
        <div className={classes.root}>
            <Container maxWidth="lg" >
                <Grid container justify="center"
                    direction="column"
                    alignItems="center">
                    <Grid item xs={12} style={{ width: '100%' }}>
                        <Grid container justify="center"
                            direction="row"
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={3} className={classes.grid_item} >
                                <div className={classes.paperNewOrder}>
                                    Lista pracowników
                                    <div>
                                        {
                                            state.workers.length > 0 ? state.workers.map((item, key) => (
                                                <TableElement type={true} data={item} id={key} handleRemoveUser={handleRemoveUser} handleAddUser={handleAddUser} />
                                            )) : null
                                        }
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.grid_item} >
                                <div className={classes.paperNewOrder}>
                                    Lista użytkowników
                                    <div>
                                        {
                                            state.data.length > 0 ? state.data.map((item, key) => (
                                                <TableElement type={false} data={item} id={key} handleRemoveUser={handleRemoveUser} handleAddUser={handleAddUser} />
                                            )) : null
                                        }
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} spacing={2}>
                                <Paper className={classes.paper}>
                                    <form className={classes.container} noValidate autoComplete="off">
                                        <Grid container spacing={3} direction="column" alignItems="center">
                                            {inputData.map((input, key) => {
                                                var type
                                                if (input.value === "email") {
                                                    type = "email"
                                                } else if (input.value === "password" || input.value === "confirmPassword") {
                                                    type = "password"
                                                } else {
                                                    type = "text"
                                                }
                                                console.log(type)
                                                return (
                                                    <Grid item xs={12} className="grid__labelContent">
                                                        <label>{input.label}</label>
                                                        <TextField
                                                            id={input.name}
                                                            label={input.label}
                                                            className={classes.textField}
                                                            value={values[input.value]}
                                                            type={type}
                                                            onChange={handleChange(input.value)}
                                                            margin="normal"
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                )
                                            })}

                                            <Button variant="contained" disabled={values.password === "" ? true : false} className={classes.button} onClick={handleAddNewUser}>
                                                Dodaj
                                            </Button>
                                        </Grid>
                                    </form>
                                </Paper>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ width: '100%' }}>
                        <div >
                            {/* Użytkownicy: {state.data.length} */}
                            <Button variant="contained" className={classes.button} >
                                Dalej
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div >
    );
}

export default Table;