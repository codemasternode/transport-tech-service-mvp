import React from 'react';
import { Button, CssBaseline, TextField, FormHelperText, Grid, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import useForm from '../../components/Forms/registerForm';
import { Link, Redirect } from 'react-router-dom'

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
    },
    spacingElement: {
        height: '20px',
        width: '100%'
    },
    flexGrid: {

    }

}));

export default function Register() {
    const classes = useStyles();
    const [updateValue, submitHandler, errors, val] = useForm({});
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
                                <Grid item xs={12} sm={6} className={classes.flexGrid}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="Imie"
                                        autoFocus
                                        onChange={updateValue}
                                        error={errors.length !== 0 && val.errfn}
                                        className={classes.tts_input}
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors && errors.length > 0 ? errors.map((i, k) => {
                                        if (i.firstName) { return i.firstName; }
                                        return "";
                                    }) : ""}</FormHelperText>

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Nazwisko"
                                        name="lastName"
                                        autoComplete="lname"
                                        onChange={updateValue}
                                        error={errors.length !== 0 && val.errln}
                                        className={classes.tts_input}
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors && errors.length > 0 ? errors.map((i, k) => {
                                        if (i.lastName) { return i.lastName; }
                                        return "";
                                    }) : ""}</FormHelperText>
                                </Grid>
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
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors && errors.length > 0 ? errors.map((i, k) => {
                                        if (i.email) { return i.email; }
                                        return "";
                                    }) : ""}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="nip"
                                        label="NIP"
                                        name="nip"
                                    />
                                    <br /><br />
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
                                        onChange={updateValue}
                                        error={val.errp}
                                        autoComplete="current-password"
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors && errors.length > 0 ? errors.map((i, k) => {
                                        if (i.password) { return i.password; }
                                        return "";
                                    }) : ""}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Potwierdź hasło"
                                        type="password"
                                        id="confirmPassword"
                                        onChange={updateValue}
                                        error={val.errcp}
                                        autoComplete="current-password"
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors && errors.length > 0 ? errors.map((i, k) => {
                                        if (i.confirmPassword) { return i.confirmPassword; }
                                        return "";
                                    }) : ""}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        hintText="Phone"
                                        floatingLabelText="Phone"
                                        name="phone"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid className={classes.submit_label}>
                                <Button
                                    type="submit"
                                    disabled={val.errfn && val.errln && val.errem ? true : false}
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Wyślij
                                </Button>
                            </Grid>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link to="/login" variant="body2">
                                        Masz już konto? Zaloguj się
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