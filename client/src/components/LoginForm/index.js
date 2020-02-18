import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, TextField, FormHelperText, Grid, Typography, Container, Snackbar } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
// import MuiAlert from '@material-ui/lab/Alert';
import { useStyles } from '../../utils/styles'
import axios from "axios";
import { Formik } from 'formik'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles';
import { API_URL } from '../../utils/urls'
import Logo from './1.png'

const themes = createMuiTheme({
    palette: {
        error: {
            main: '#ff9900',
        }
    },
})

const LoginForm = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const history = useHistory();

    useEffect(() => {
        _sendRequest("onload", "")
    }, [])

    const handleClick = val => {
        setOpen(val);
    };

    const _sendRequest = (type, data) => {
        if (type === "onload") {
            const date = new Date().toISOString()
            // console.log(API_URL)
            axios.post(`${API_URL}/api/web-stats`, { name: "login", date }).then((response) => {
                // 
            }, (err) => {
                console.log("Axios error: " + err)
            })
        } else if (type === "submit") {
            const { email, password } = data;
            console.log(API_URL)
            axios({
                method: "POST",
                url: `${API_URL}/api/auth/login`,
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
                data: {
                    email,
                    password
                }
            }).then(res => {
                console.log(res.status)
                if (res.status === 401) {
                    setOpen(true);
                } else if (res.status === 200) {
                    console.log(res.data);
                    const { expireAt } = res.data;
                    localStorage.setItem("token_expire", expireAt);
                    history.push('/dashboard')
                }

                // axios({
                //     method: "POST",
                //     url: `${API_URL}/api/auth/test`,
                //     headers: { 'Content-Type': 'application/json' },
                //     withCredentials: true,
                //     data: {}
                // }).then(res => {
                //     console.log(res.status)
                // })
            }).catch(err => {
                console.log(err)
            })
        }

    }

    const _renderAlert = () => {
        if (open) {
            return (
                // <Snackbar open={open} autoHideDuration={6000} onClose={() => handleClick(false)}>
                <h3> Error message!</h3>

            )
        }
    }

    const _init = () => {
        return (
            <ThemeProvider theme={themes}>
                <div className={classes.root}>
                    {_renderAlert()}
                    <Container component="main" maxWidth="xs" className={classes.container_form}>
                        <CssBaseline />
                        <div className={classes.paper}>
                            <img src={Logo} alt="logo" className={classes.tts_logo} />
                            <Formik
                                initialValues={{ email: "", password: "" }}
                                onSubmit={async (values) => {
                                    _sendRequest("submit", values)
                                }}
                                validate={(values) => {
                                    let errors = {}

                                    return errors
                                }}
                                render={({
                                    values,
                                    errors,
                                    touched,
                                    handleBlur,
                                    handleChange,
                                    handleSubmit,
                                    setFieldValue,
                                    isSubmitting
                                }) => (
                                        <form onSubmit={handleSubmit}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} className={classes.flexGrid}>
                                                    <TextField
                                                        autoComplete="email"
                                                        name="email"
                                                        variant="outlined"
                                                        fullWidth
                                                        id="email"
                                                        label="Email"
                                                        autoFocus
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        error={errors.email && touched.email ? true : false}
                                                        value={values.email}
                                                        className={classes.tts_input}
                                                    />
                                                    <FormHelperText className={'tts-labelField'} error={true}>{errors.email && touched.email ? errors.email : null}</FormHelperText>
                                                </Grid>
                                                <Grid item xs={12} className={classes.flexGrid}>
                                                    <TextField
                                                        autoComplete="password"
                                                        name="password"
                                                        variant="outlined"
                                                        type="password"
                                                        fullWidth
                                                        id="password"
                                                        label="Hasło"
                                                        autoFocus
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        error={errors.password && touched.password ? true : false}
                                                        value={values.password}
                                                        className={classes.tts_input}
                                                    />
                                                    <FormHelperText className={'tts-labelField'} error={true}>{errors.password && touched.password ? errors.password : null}</FormHelperText>
                                                </Grid>
                                                <Grid item xs={12} className={classes.flexGrid}>
                                                    <Button
                                                        type="submit"
                                                        disabled={(Object.entries(errors).length === 0 && errors.constructor === Object) && values.email !== "" && values.password !== "" ? false : true}
                                                        variant="contained"
                                                        color="primary"
                                                        className={classes.submit}
                                                    >
                                                        Zaloguj
                                                </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    )}
                            />
                        </div>
                    </Container>
                </div>
            </ThemeProvider>
        )
    }

    return _init()
}

export default LoginForm;