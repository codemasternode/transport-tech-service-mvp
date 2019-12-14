import React, { useState, useEffect } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Grid, TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import Geocode from "react-geocode";
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import "moment/locale/pl";

moment.locale("pl");
Geocode.setApiKey("AIzaSyDgO5BkgVU-0CXP104-6qKWUEPTT4emUZM");
Geocode.enableDebug();
const Container = styled.div`
    // width: 100%;
    display: flex;
    justyfy-content: center;
    flex-direction: column;
    align-items: center;
`

const StyledItem = styled.div`
    // width: 100%;
    display: flex;
    justyfy-content: center;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
`;

const StylexText = styled.p`
    margin: .5em;
    width: 100%;
    text-align: left;
`

const StyledImg = styled.img`
    width: 50%;
    height: auto;
`


const MailForm = (props) => {
    const [state, setState] = useState({
        companyData: true,
        userData: {
            name: "",
            surname: "",
            email: "",
            taxNumber: "",
            additionalNotes: "",
            companyName: "",
            companyNIP: "",
        },
        from: "",
        toDest: ""
    })
    const [selectedDate, handleDateChange] = useState(new Date());
    const { chosenCompany } = useSelector(state => state.companies)
    const { searchedCriterial } = useSelector(state => state.companies)
    const { searchedCriterialDimensions } = useSelector(state => state.companies)

    useEffect(() => {
        // if (chosenCompany === {} || searchedCriterial === {}) {
        console.log(chosenCompany)
        // props.history.push('/search')
        // }
        // console.log(props)
        if (Object.entries(searchedCriterial).length === 0 && searchedCriterial.constructor === Object) {
            _getAddress()
        }
    }, [])





    console.log(chosenCompany)

    const _handleInputChange = e => {
        //handle input value
        const { value, name } = e.target;
        const { userData } = state;
        userData[name] = value;
        setState({
            ...state,
            userData
        })

    }

    const _handleCheckbox = e => {
        setState({
            ...state,
            companyData: e.target.checked
        })
    }

    const _handleSendEmail = () => {
        const { userData } = state;
        const data = {
            ...userData,
            ...searchedCriterial,
            startTime: selectedDate,

        }

        axios.post('http://localhost:5000/api/contact/contact-to-company', data).then((response) => {
            console.log(response)

        }, (err) => {
            console.log("Axios error: " + err)
        })
    }

    const _viewModel = {
        getNameFromLatLng: (selectedPoint, callback) => {
            console.log(selectedPoint)
            const { lat, lng } = selectedPoint;
            Geocode.fromLatLng(lat, lng).then(
                response => {
                    console.log(response)
                    let addressFull = response.results[0].formatted_address;
                    console.log(addressFull)
                    callback(addressFull)
                },
                error => {
                    console.error(error);
                }
            );
            // console.log(res)
            // return res;
        }
    }

    const _renderHeaderOfMailer = () => {
        const { nameOfCompany } = chosenCompany;
        return (
            <React.Fragment>
                <Link to="/search">Powrót do wyszukiwania</Link>
                <Grid container>
                    <Grid item xs={5}>
                        <StyledImg src="http://d2ckak7af1omc2.cloudfront.net/company_logos/logo1.png" alt="company" />
                    </Grid>
                    <Grid item xs={7}>
                        <h2>Firma Transportowa: {nameOfCompany}</h2>
                        <h4>Dane firmy</h4>
                        <StylexText>Nip: XXX-xxx-xxx</StylexText>
                        <StylexText>VAT: TAK/NIE</StylexText>
                        <StylexText>Siedziba firmy</StylexText>
                        <StylexText>Telefon</StylexText>
                    </Grid>
                </Grid>
            </React.Fragment>


        )
    }

    const _getAddress = () => {
        const { points } = searchedCriterial;
        _viewModel.getNameFromLatLng(points[0], (val) => {
            console.log(val)

            // setState({ ...state, from: val })
        })
        _viewModel.getNameFromLatLng(points[1], (val) => {
            console.log(val)
            // setState({ ...state, toDest: val })
        })
    }

    const _renderOrderDetails = () => {
        const { weight, height } = searchedCriterial;
        const { vehicles } = chosenCompany;
        const { from, toDest } = state;

        let totalCost = 0;
        console.log(from, toDest)
        for (let vehicle of vehicles) {
            console.log(vehicle)
            totalCost += vehicle.fullCost
        }
        console.log(totalCost)
        return (
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12} style={{ width: '100%' }}>
                    {/* <StylexText >Transport z: {from}</StylexText>
                    <StylexText>Transport do: {toDest}</StylexText> */}
                    <h5>Cena: {totalCost.toFixed(2)} PLN</h5>
                    <h5>Szczegóły</h5>
                </Grid>
                <Grid item xs={12} style={{ width: '100%' }}>
                    <Grid container justify="flex-start">
                        <Grid item xs={12}>
                            {_renderSearchCriteria()}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <StylexText>Wysokość: {height} (m)</StylexText>
                                </Grid>
                                <Grid item xs={6}>
                                    <StylexText>Waga: {weight} (t)</StylexText>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    const _renderSearchCriteria = () => {
        const { typeOfSearch } = searchedCriterial;
        if (typeOfSearch === "Palette") {
            const { numberOfPallets, typeOfPallet } = searchedCriterial
            return (
                <Grid container>
                    <Grid item xs={6}>
                        <StylexText>Liczba palet: {numberOfPallets}</StylexText>
                    </Grid>
                    <Grid item xs={6}>
                        <StylexText>Rodzaj palety: {typeOfPallet}</StylexText>
                    </Grid>
                </Grid>
            )
        } else {
            const { length, width } = searchedCriterialDimensions
            return (
                <Grid container>
                    <Grid item xs={6}>
                        <StylexText>Długość: {length} (m)</StylexText>
                    </Grid>
                    <Grid item xs={6}>
                        <StylexText>Szerokość: {width} (m)</StylexText>
                    </Grid>
                </Grid>
            )
        }

    }

    const _renderFormContent = () => {
        const { companyData, userData: { name,
            surname,
            email,
            taxNumber,
            additionalNotes } } = state;
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        id="name"
                        name="name"
                        label="Imie"
                        fullWidth
                        autoComplete="name"
                        value={name}
                        onChange={e => _handleInputChange(e)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" id="surname" name="surname" label="Nazwisko" fullWidth value={surname} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        type="email"
                        id="email"
                        name="email"
                        label="Email"
                        fullWidth
                        autoComplete="email"
                        value={email}
                        onChange={e => _handleInputChange(e)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        id="taxNumber"
                        name="taxNumber"
                        label="Numer telefonu"
                        fullWidth
                        autoComplete="taxNumber"
                        value={taxNumber}
                        onChange={e => _handleInputChange(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale='pl'>
                        <KeyboardDatePicker
                            clearable
                            value={selectedDate}
                            placeholder="10/10/2019"
                            onChange={date => handleDateChange(date)}
                            minDate={new Date()}
                            format="MM/dd/yyyy"
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Dodatkowe informacje (opcjonalnie)"
                        multiline
                        fullWidth
                        rows="4"
                        // defaultValue="Opis..."
                        margin="normal"
                        variant="outlined"
                        value={additionalNotes}
                        onChange={e => _handleInputChange(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox onChange={e => _handleCheckbox(e)} color="primary" name="companyData" checked={companyData} value={true} />}
                        label="Dane firmy"
                    />
                </Grid>
                {/* <Grid item xs={12}> */}
                {_returnCompanyData()}
                {/* </Grid> */}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={_handleSendEmail}>Wyślij</Button>
                </Grid>
            </Grid>
        )
    }

    const _returnCompanyData = () => {
        const { companyData, userData: {
            companyName,
            companyNIP } } = state;
        return (
            <React.Fragment>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        disabled={!companyData}
                        id="companyName"
                        name="companyName"
                        label="Nazwa firmy"
                        placeholder="Nazwa firmy"
                        fullWidth
                        autoComplete="companyName"
                        value={companyName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" disabled={!companyData} id="nip" name="nip" placeholder="Numer identyfikacji podatkowej" label="NIP" fullWidth value={companyNIP} />
                </Grid>
            </React.Fragment>
        )
    }


    const _renderFormComponent = () => {
        return (
            <Container>
                <Container style={{ width: '60%' }}>
                    {_renderHeaderOfMailer()}
                    {_renderOrderDetails()}
                    {_renderFormContent()}
                </Container>
            </Container>
        )
    }

    return (Object.entries(chosenCompany).length === 0 && chosenCompany.constructor === Object || Object.entries(searchedCriterial).length === 0 && searchedCriterial.constructor === Object) ? <Redirect to="/search" /> : _renderFormComponent()
}

export default withRouter(MailForm);