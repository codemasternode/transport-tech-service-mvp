import React from 'react';
import { Button, TextField, FormHelperText, Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { Formik } from 'formik'
import { Link } from 'react-router-dom'
import { useStyles } from '../../utils/styles'

const RegisterForm = ({ registerValues, sendRequest, validateEmail }) => {
    const classes = useStyles();

    const _init = () => {
        return (
            <Formik
                initialValues={{ ...registerValues }}
                onSubmit={(values) => {
                    console.log(values)
                    sendRequest("submit", values)
                }}
                validate={(values) => {
                    let errors = {}
                    if (!values.name) {
                        errors.name = 'To pole jest wymagane'
                    }
                    else if (values.name.length < 3) {
                        errors.name = 'Minimum 3 znaki'
                    }

                    if (!values.surname) {
                        errors.surname = 'To pole jest wymagane'
                    }
                    else if (values.surname.length < 3) {
                        errors.surname = 'Minimum 3 znaki'
                    }

                    if (!values.email) {
                        errors.email = "Email jest wymagany"
                        // } else if (!validateEmail(values.email)) {
                        //     errors.email = "Podany email jest nie poprawny"
                    }

                    if (!values.nameOfCompany) {
                        errors.nameOfCompany = "To pole jest wymagane"
                    }

                    if (!values.phone) {
                        errors.phone = "To pole jest wymagane"
                    }

                    if (!values.place) {
                        errors.place = "To pole jest wymagane"
                    }

                    if (!values.taxNumber) {
                        errors.taxNumber = "To pole jest wymagane";
                    } else if (values.taxNumber.length < 6) {
                        errors.taxNumber = 'Minimum 6 znaki'
                    }

                    if (!values.password) {
                        errors.password = 'To pole jest wymagane'
                    } else if (values.password.length < 6) {
                        errors.password = 'Minimum 6 znaki'
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
                                        onBlur={handleBlur}
                                        error={errors.nameOfCompany && touched.nameOfCompany ? true : false}
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
                                        onBlur={handleBlur}
                                        error={errors.phone && touched.phone ? true : false}
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
                                        type="text"
                                        name="taxNumber"
                                        // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
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
                                        onBlur={handleBlur}
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
                                        onBlur={handleBlur}
                                        error={errors.password && touched.password ? true : false}
                                        value={values.password}
                                        autoComplete="current-password"
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors.password && touched.password ? errors.password : null}</FormHelperText>
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
                                        onBlur={handleBlur}
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
                                    // onClick={()=> sendRequest("submit")}
                                    className={classes.submit}
                                >
                                    Zarejestruj się
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
        )
    }

    return _init();

}


export default RegisterForm;