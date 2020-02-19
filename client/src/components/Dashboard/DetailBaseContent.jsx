import React, { useState, useEffect } from 'react';
import { Grid, TextField, FormHelperText, FormControlLabel, Button, FormControl, MenuItem, InputLabel, Select } from '@material-ui/core'
import { useStyles } from '../../utils/styles'
import { useSelector } from 'react-redux'
import { fuelTypes, emissionLevelData } from '../../utils/dataOfDashboard'

const DetailsBaseContent = ({ selectedBase }) => {
    const [info, setInfo] = useState({})
    const classes = useStyles();
    const detailsBases = useSelector(state => state.dashboard.customerData.company.companyBases);
    console.log(detailsBases)
    useEffect(() => {
        _chooseValidBase()
    }, [])

    const _chooseValidBase = () => {
        detailsBases.forEach((item, key) => {
            if (item.name === selectedBase) {
                setInfo(item)
            }
        })
    }

    const _init = () => {
        const { street, name, postalCode, city, country, location, vehicles } = info
        console.log(vehicles)
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.flexGrid}>
                    <h2>Nazwa firmy: {name}</h2>
                    <p><strong>Ulica: </strong>{street}</p>
                    <p><strong>Kod pocztowy:</strong> {postalCode}</p>
                    <p><strong>Miasto:</strong> {city}</p>
                    <p><strong>Państwo:</strong> {country}</p>
                    <p><strong>Ilość pojazdów:</strong> {vehicles !== undefined ? vehicles.length : 0}</p>
                    <p><strong>Serokość geograficzna:</strong> {location !== undefined ? location.lat : 0}</p>
                    <p><strong>Długość geograficzna:</strong> {location !== undefined ? location.lng : 0}</p>

                </Grid>
            </Grid>
        )
    }

    return _init();
}

export default DetailsBaseContent;