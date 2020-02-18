import React, { useState } from 'react';
import { Grid, TextField, FormHelperText, FormControlLabel, Button } from '@material-ui/core'
import { useStyles } from '../../utils/styles'
import DashboardMap from './DashboardMap.jsx'
import { Formik } from 'formik'

const NewVehicleContent = (props) => {
    const [place, setPlace] = useState({})
    const classes = useStyles();
    const {
        loadingElement,
        containerElement,
        mapElement,
        defaultCenter,
        defaultZoom
    } = props;

    const requiredData = {
        name: "",
        combustion: "",
        capacity: "",
        length: "",
        width: "",
        height: "",
        deprecationPerYear: "",
        valueOfTruck: "",
        averageDistancePerMonth: "",
        maxRange: "",
        minRange: "",
        operationPange: "",
        margin: "",
        fuel: "",
        monthCosts: "",
        salary: "",
        monthOfAxles: "",
        emissionLevel: "",
        permissibleGrossWeight: ""
    }

    const numericFields = [
        { label: "Spalanie", name: "combustion" },
        { label: "Ładowność (tony)", name: "capacity" }
    ]

    const _renderNumericInputs = (values, handleChange) => {
        return (numericFields.map((field, key) => {
            console.log(values, values[field.name])
            return (
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        name="street"
                        autoComplete="street"
                        fullWidth
                        label={field.label}
                        // onBlur={handleBlur}
                        onChange={handleChange}
                        // error={errors.street && touched.street ? true : false}
                        value={values[field.name]}
                    // className={classes.tts_input}
                    />
                    {/* <FormHelperText className={'tts-labelField'} error={true}>{errors.street && touched.street ? errors.street : null}</FormHelperText> */}
                </Grid>
            )
        }))
    }

    const _init = () => {
        return (
            <Formik
                initialValues={{ ...requiredData }}
                onSubmit={(values) => {
                    console.log(values)

                }}
                validate={(values) => {
                    let errors = {}

                    if (!values.name) {
                        errors.name = "To pole nie może być puste"
                    }

                    if (!values.street) {
                        errors.street = "To pole nie może być puste"
                    }

                    if (!values.postalCode) {
                        errors.postalCode = "To pole nie może być puste"
                    }

                    if (!values.city) {
                        errors.city = "To pole nie może być puste"
                    }

                    if (!values.country) {
                        errors.country = "To pole nie może być puste"
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
                                        label="Nazwa bazy (unikatowa)"
                                        autoFocus
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.name && touched.name ? true : false}
                                        value={values.name}
                                        className={classes.tts_input}
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors.name && touched.name ? errors.name : null}</FormHelperText>
                                </Grid>
                                {_renderNumericInputs(values, handleChange)}
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
                                    Utwórz
                            </Button>
                            </Grid>
                        </form>
                    )}
            />
        )
    }

    return _init();
}

export default NewVehicleContent;