import React, { useState } from 'react';
import { Grid, TextField, FormHelperText, FormControlLabel, Button } from '@material-ui/core'
import { useStyles } from '../../utils/styles'
import DashboardMap from './DashboardMap.jsx'
import { Formik } from 'formik'

const googleMapsApiKey = "AIzaSyDgO5BkgVU-0CXP104-6qKWUEPTT4emUZM";


const NewBaseContent = (props) => {
    const [place, setPlace] = useState({})
    const classes = useStyles();
    const {
        loadingElement,
        containerElement,
        mapElement,
        defaultCenter,
        defaultZoom
    } = props;

    const _handleOnMapClick = e => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setPlace({ lat, lng })
    }

    const _init = () => {
        return (
            <Formik
                initialValues={{ name: "", street: "", postalCode: "", city: "", country: "", lat: "", lng: "" }}
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
                                <Grid item xs={12} className={classes.flexGrid}>
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
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        name="street"
                                        autoComplete="street"
                                        fullWidth
                                        id="street"
                                        label="Ulica"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.street && touched.street ? true : false}
                                        value={values.street}
                                        className={classes.tts_input}
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors.street && touched.street ? errors.street : null}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="postalCode"
                                        label="Kod pocztowy"
                                        name="postalCode"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.postalCode && touched.postalCode ? true : false}
                                        value={values.postalCode}
                                        autoComplete="postalCode"
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors.postalCode && touched.postalCode ? errors.postalCode : null}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="city"
                                        label="Miasto"
                                        name="city"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.city && touched.city ? true : false}
                                        value={values.city}
                                        autoComplete="city"
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors.city && touched.city ? errors.city : null}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="country"
                                        label="Kraj"
                                        name="country"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.country && touched.country ? true : false}
                                        value={values.country}
                                        autoComplete="country"
                                    />
                                    <FormHelperText className={'tts-labelField'} error={true}>{errors.country && touched.country ? errors.country : null}</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="lat"
                                        label="Szerokość geograficzna"
                                        type="text"

                                        // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                        value={place.lat || 50.049683}
                                        autoComplete="lat"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="lng"
                                        label="Długość geograficzna"
                                        name="lng"
                                        value={place.lng || 19.944544}
                                        autoComplete="lng"
                                    />
                                </Grid>
                            </Grid>
                            <DashboardMap
                                googleMapURL={
                                    'https://maps.googleapis.com/maps/api/js?key=' +
                                    googleMapsApiKey +
                                    '&libraries=geometry,drawing,places'
                                }
                                onMapClick={_handleOnMapClick}
                                markers={place}
                                loadingElement={loadingElement || <div style={{ height: `100%` }} />}
                                containerElement={containerElement || <div style={{ height: "100vh" }} />}
                                mapElement={mapElement || <div style={{ height: `100%` }} />}
                                defaultCenter={defaultCenter || { lat: 50.049683, lng: 19.944544 }}
                                defaultZoom={defaultZoom || 11}
                            />
                            <Grid className={classes.submit_label}>
                                <Button
                                    type="submit"
                                    disabled={Object.entries(errors).length === 0 && errors.constructor === Object ? false : true}
                                    variant="contained"
                                    color="primary"
                                    // onClick={()=> sendRequest("submit")}
                                    className={classes.submit}
                                >
                                    Dodaj bazę
                            </Button>
                            </Grid>
                        </form>
                    )}
            />
        )
    }

    return _init();
}

export default NewBaseContent;