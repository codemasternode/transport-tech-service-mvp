import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, TextField, FormHelperText, Grid, Typography, Container, FormControlLabel, Checkbox, MenuItem } from '@material-ui/core';
import Select from 'react-select';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Formik } from 'formik'
import { countries } from '../../utils/countries'
import { API_URL } from '../../utils/urls'
import { Link, useParams } from 'react-router-dom'
// import 'react-select/dist/react-select.css';

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
        margin: '20px 0',
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

export default function Register(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        registerValues: {
            logo: "",
            name: "",
            surname: "",
            nameOfCompany: "",
            phone: "",
            taxNumber: "",
            place: "",
            isVat: false,
            email: "",
            country: "Poland",
            countries: "Poland",
            password: "",
            confirmPassword: ""
        },
        inviteCode: ""
    })
    // const { id } = useParams();
    useEffect(() => {
        _sendRequest("onload", {})
        _validParams()
    }, [])

    const _sendRequest = (type, data) => {
        if (type === "onload") {
            const date = new Date().toISOString()
            console.log(API_URL)
            axios.post(`${API_URL}/api/distance`, { name: "register", date }).then((response) => {
                // 
            }, (err) => {
                console.log("Axios error: " + err)
            })
        } else if (type === "submit") {
            const { name,
                surname,
                nameOfCompany,
                phone,
                taxNumber,
                place,
                isVat,
                email,
                country,
                countries,
                password,
                file } = data

            // axios.post(`${API_URL}/api/company/confirm`, { name,
            //     surname,
            //     nameOfCompany,
            //     phone,
            //     taxNumber,
            //     place,
            //     isVat,
            //     email,
            //     country,
            //     countries,
            //     password,logo: file }).then((response) => {
            //     console(response)
            // }, (err) => {
            //     console.log("Axios error: " + err)
            // })
            const bodyFormData = new FormData();
            bodyFormData.set('name', name);
            bodyFormData.set('surname', surname);
            bodyFormData.set('nameOfCompany', nameOfCompany);

            axios({
                method: 'post',
                url: `${API_URL}/api/company/create-company`,
                data: bodyFormData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });
        }
    }

    const _validParams = () => {
        const { id } = props.match.params
        console.log(id)
        setState({
            ...state,
            inviteCode: id
        })
    }

    const _handleChange = e => {
        const { name, value } = e.target;
        const { registerValues } = state

        registerValues[name] = value

        setState({
            registerValues
        })
    }

    return (
        <ThemeProvider theme={themes}>
            <div className={classes.root}>
                <Container component="main" maxWidth="xs" className={classes.container_form}>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <img src="1.png" alt="logo" className={classes.tts_logo} />
                        <Typography component="h1" variant="h5">
                            LogiCalc
                        </Typography>

                        <Formik
                            initialValues={{ ...state.registerValues }}
                            onSubmit={async (values) => {

                                console.log(values, state.inviteCode)
                                _sendRequest("submit", values)
                            }}
                            validate={(values) => {
                                console.log(state.registerValues)
                                let errors = {}
                                console.log(values)
                                // switch()
                                if (!values.name) {
                                    errors.name = 'To pole jest wymagane'
                                }
                                else if (values.name.length < 3) {
                                    errors.name = 'Minimum 2 znaki'
                                }

                                if (!values.surname) {
                                    errors.surname = 'To pole jest wymagane'
                                }
                                else if (values.surname.length < 3) {
                                    errors.surname = 'Minimum 2 znaki'
                                }

                                if (values.confirmPassword !== values.password) {
                                    errors.confirmPassword = "Hasła nie są identyczne"
                                }

                                if (values.confirmPassword !== values.password) {
                                    errors.confirmPassword = "Hasła nie są identyczne"
                                }

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
                                            <Grid item xs={12} sm={6} className={classes.flexGrid}>
                                                <TextField
                                                    autoComplete="name"
                                                    name="name"
                                                    variant="outlined"
                                                    fullWidth
                                                    id="name"
                                                    label="Imie"
                                                    autoFocus
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    error={errors.name && touched.name ? true : false}
                                                    value={values.name}
                                                    className={classes.tts_input}
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.name && touched.name ? errors.name : null}</FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    variant="outlined"
                                                    name="surname"
                                                    autoComplete="surname"
                                                    fullWidth
                                                    id="surname"
                                                    label="Nazwisko"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    error={errors.surname && touched.surname ? true : false}
                                                    value={values.surname}
                                                    className={classes.tts_input}
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.surname && touched.surname ? errors.surname : null}</FormHelperText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label="Email"
                                                    name="email"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    error={errors.email && touched.email ? true : false}
                                                    value={values.email}
                                                    autoComplete="email"
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.email && touched.email ? errors.email : null}</FormHelperText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="nameOfCompany"
                                                    label="Nazwa firmy"
                                                    name="nameOfCompany"
                                                    onChange={handleChange}
                                                    error={errors.email && touched.email ? true : false}
                                                    value={values.nameOfCompany}
                                                    autoComplete="nameOfCompany"
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.nameOfCompany && touched.nameOfCompany ? errors.nameOfCompany : null}</FormHelperText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="phone"
                                                    label="Numer telefonu"
                                                    name="phone"
                                                    onChange={handleChange}
                                                    error={errors.email && touched.email ? true : false}
                                                    value={values.phone}
                                                    autoComplete="phone"
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.phone && touched.phone ? errors.phone : null}</FormHelperText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="taxNumber"
                                                    label="NIP"
                                                    type="tel"
                                                    name="taxNumber"
                                                    // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                                    onChange={handleChange}
                                                    error={errors.taxNumber && touched.taxNumber ? true : false}
                                                    value={values.taxNumber}
                                                    autoComplete="taxNumber"
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.taxNumber && touched.taxNumber ? errors.taxNumber : null}</FormHelperText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="place"
                                                    label="Pełen adres firmy"
                                                    name="place"
                                                    onChange={handleChange}
                                                    error={errors.place && touched.place ? true : false}
                                                    value={values.place}
                                                    autoComplete="place"
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.place && touched.place ? errors.place : null}</FormHelperText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    name="password"
                                                    label="Hasło"
                                                    type="password"
                                                    id="password"
                                                    onChange={handleChange}
                                                    error={errors.password}
                                                    value={values.password}
                                                    autoComplete="current-password"
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.password}</FormHelperText>
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
                                                    onChange={handleChange}
                                                    error={errors.confirmPassword}
                                                    value={values.confirmPassword}
                                                    autoComplete="current-password"
                                                />
                                                <FormHelperText className={'tts-labelField'} error={true}>{errors.confirmPassword}</FormHelperText>
                                            </Grid>

                                            <Grid item xs={12}>
                                                {/* <label>
                                                    <h6>Kraj działalności (główny)</h6>
                                                    <Select
                                                        // labelId="Kraj działalności (główny)"
                                                        id="country"
                                                        name="country"
                                                        defaultValue={countries[0]}
                                                        isDisabled={false}
                                                        isLoading={false}
                                                        isClearable={true}
                                                        isRtl={false}
                                                        isSearchable={false}
                                                        options={countries}
                                                        // value={values.country}
                                                        onChange={handleChange}
                                                    />
                                                </label>
                                                <label>
                                                    <h6>Kraje działalności</h6>
                                                    <Select
                                                        labelId="Kraje działalności"
                                                        id="countries"
                                                        name="countries"
                                                        value={values.countries}
                                                        onChange={handleChange}
                                                        options={countries}
                                                    />
                                                </label> */}

                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={<Checkbox onChange={handleChange} color="primary" name="isVat" checked={values.isVat} value={values.isVat} />}
                                                    label="Podatnik VAT"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <input id="logo" name="logo" type="file" onChange={(event) => {
                                                    setFieldValue("file", event.currentTarget.files[0]);
                                                }} className="form-control" />
                                                {values.logo}
                                            </Grid>
                                        </Grid>
                                        <Grid className={classes.submit_label}>
                                            <Button
                                                type="submit"
                                                disabled={Object.entries(errors).length === 0 && errors.constructor === Object ? false : true}
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
                                )}
                        />
                    </div>
                </Container>
            </div>
        </ThemeProvider>
    );
}