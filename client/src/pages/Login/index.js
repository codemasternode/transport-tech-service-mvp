import React, { useState } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, FormHelperText, Checkbox, Grid, Typography, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import useForm from '../../components/Forms/registerForm';

const themes = createMuiTheme({
    palette: {
        error: {
            main: '#ff9900',
        }
    },
})

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
    tts_logo: {
        maxWidth: '10%',
        height: 'auto',
    },
    container_form: {
        backgroundColor: '#ffffff',
        minHeight: '70%',
        minWidth: '30%',
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)'
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '90%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit_label: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: '#000000',
        width: "50%"
    },
    '.MuiFormLabel-root.Mui-error': {
        color: '#ff9900'
    },
    tts_input: {
        caretColor: theme.palette.error.main,
    },
    tts_labelField_d: {
        opacity: 0
    }
}));

export default function Login() {
    const classes = useStyles();
    const [updateValue, submitHandler, errors, val, handleCheckbox, state] = useForm({});
    console.log(errors)
    return (
        <ThemeProvider theme={themes}>
            <div className={classes.root}>
                <Container component="main" maxWidth="xs" className={classes.container_form}>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <img src="./logo.png" alt="logo" className={classes.tts_logo} />
                        <Typography component="h1" variant="h5">
                            Transport Tech Service
                        </Typography>
                        <form className={classes.form} noValidate onSubmit={submitHandler}>
                            <Grid container spacing={2}>

                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        error={errors.length !== 0 && val.errem}
                                        onChange={updateValue}
                                        autoComplete="email"
                                    />
                                    <FormHelperText error={errors.length !== 0 ? true : false}>{errors && errors.map(err => err.email ? err.email : null)}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        error={errors.length !== 0 && val.errp}
                                        onChange={updateValue}
                                        autoComplete="current-password"
                                    />
                                    <FormHelperText error={errors.length !== 0 ? true : false}>{errors && errors.map(err => err.password ? err.password : null)}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="isCheck" color="primary" name="isCheck" onChange={handleCheckbox('isCheck')} checked={state.isCheck} />}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                            <Grid className={classes.submit_label}><Button
                                type="submit"
                                disabled={(state.isCheck && errors.length === 0) ? false : true}
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Wyślij
                            </Button></Grid>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link to="/register" variant="body2">
                                        Nie masz konta? Dołącz do nas!
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </div>
        </ThemeProvider>
    );
}