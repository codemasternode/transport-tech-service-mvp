import React, { useState } from 'react';
import { Grid, TextField, FormHelperText, FormControlLabel, Button, FormControl, MenuItem, InputLabel, Select } from '@material-ui/core'
import { useStyles } from '../../utils/styles'
import { useDispatch } from 'react-redux'
import { fuelTypes, emissionLevelData } from '../../utils/dataOfDashboard'
import { createNewVehicle } from '../../reducers/dashboard/duck/operations';
import { Formik } from 'formik'

const NewVehicleContent = (props) => {
    // const [state, setState] = useState({})
    const classes = useStyles();
    const dispatch = useDispatch();
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
        fuel: "Benzyna Pb98",
        monthCosts: "",
        salary: "",
        monthOfAxles: "",
        emissionLevel: "EURO",
        permissibleGrossWeight: ""
    }

    const numericFields = [
        { label: "Spalanie", name: "combustion" },
        { label: "Ładowność (tony)", name: "capacity" },
        { label: "Długość ładowni", name: "length" },
        { label: "Szerokość ładowni", name: "width" },
        { label: "Wysokość ładowni", name: "height" },
        { label: "Amortyzacja roczna(%)", name: "deprecationPerYear" },
        { label: "Wartość pojazdu", name: "valueOfTruck" },
        { label: "Średni dystans na miesiąc", name: "averageDistancePerMonth" },
        { label: "Maksymalny zasięg pojazdu", name: "maxRange" },
        { label: "Minimalny zasięg pojazdu", name: "minRange" },
        { label: "Zasięg operacyjny ", name: "operationRange" }, ///(zasięg do którego dojazd i powrót razem wzięte nie wlicza się do ceny transportu w kilometrach)
        { label: "Marża (%)", name: "margin" },
        { label: "Średnie miesięczne koszty ", name: "monthCosts" }, //(Średnie miesięczne koszty utrzymania pojazdu [zł])
        { label: "Miesięczna pensja kierowcy ", name: "salary" }, //(Miesięczna pensja kierowcy bez diet w złotówkach)
        { label: "Liczba osi kołowych pojazdu ", name: "numberOfAxles" }, //(Liczba osi kół w pojeździe, potrzebne przy obliczeniu przejazdu przez autostradę)
        { label: "Dopuszczalna masa całkowita ", name: "permissibleGrossWeight" }, //(DMC pojazdu potrzebne do obliczenia przejazdu przez autostradę)
    ]

    const _renderNumericInputs = (values, errors, touched, handleChange, handleBlur) => {
        return (numericFields.map((field, key) => {
            // console.log(values, values[field.name])
            return (
                <Grid item xs={12} sm={6} key={key}>
                    <TextField
                        variant="outlined"
                        name={field.name}
                        autoComplete={field.name}
                        fullWidth
                        label={field.label}
                        type="number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={errors[field.name] && touched[field.name] ? true : false}
                        value={values[field.name]}
                        className={classes.tts_input}
                    />
                    <FormHelperText className={'tts-labelField'} error={true}>{errors[field.name] && touched[field.name] ? errors[field.name] : null}</FormHelperText>
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
                    dispatch(createNewVehicle(values))
                    props.switchAlert(false)
                }}
                validate={(values) => {
                    let errors = {}

                    if (!values.name) {
                        errors.name = "To pole nie może być puste"
                    }

                    numericFields.forEach((item, key) => {
                        if (!values[item.name]) {
                            errors[item.name] = "To pole nie może być puste"
                        }
                    })


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
                                {_renderNumericInputs(values, errors, touched, handleChange, handleBlur)}
                                <Grid item xs={12} sm={6} className={classes.flexGrid}>
                                    <FormControl variant="outlined" style={{ width: '100%' }} className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-filled-label">Paliwo</InputLabel>
                                        <Select
                                            variant="outlined"
                                            id="fuel"
                                            name="fuel"
                                            value={values.fuel}
                                            onChange={handleChange}
                                        >
                                            {
                                                fuelTypes.map((item, key) => {
                                                    return <MenuItem key={key} value={item}>{item}</MenuItem>
                                                })

                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.flexGrid}>
                                    <FormControl variant="outlined" style={{ width: '100%' }} className={classes.formControl}>
                                        <InputLabel >Emisja spalin</InputLabel>
                                        <Select
                                            variant="outlined"
                                            id="emissionLevel"
                                            name="emissionLevel"
                                            value={values.emissionLevel}
                                            onChange={handleChange}
                                        >
                                            {
                                                emissionLevelData.map((item, key) => {
                                                    return <MenuItem key={key} value={item}>{item}</MenuItem>
                                                })

                                            }
                                        </Select>
                                    </FormControl>
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
                                    Dodaj pojazd
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