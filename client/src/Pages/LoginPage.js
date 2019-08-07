import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import ReactPhoneInput from 'react-phone-input-mui';
import useForm from '../components/Forms/Register/registerForm';

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
        height: '100vh',
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
    // '.Mui-error'
}));

export default function SignIn() {
    const classes = useStyles();
    const [updateValue, submitHandler, errors, val] = useForm({});
    console.log(val)

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
                                    {errors && errors.map(err => err.email ? <FormHelperText error={errors.length !== 0 ? true : false}>{err.email}</FormHelperText> : null)}
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
                                        autoComplete="current-password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                            <Grid className={classes.submit_label}><Button
                                type="submit"
                                disabled={errors ? true : false}
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Wyślij
          </Button></Grid>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        Already have an account? Sign in
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