import React, { useState, useEffect } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Grid, TextField, FormControlLabel, Checkbox, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Geocode from "react-geocode";
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import "moment/locale/pl";
import { values } from 'regenerator-runtime';
import { API_URL } from '../../utils/urls'

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
            additionalNotes: "",
            companyName: "",
            companyNIP: "",
        },
        from: "",
        toDest: ""
    })
    const [selectedDate, handleDateChange] = useState(new Date());
    const [open, setOpen] = React.useState(false);
    const { chosenCompany } = useSelector(state => state.companies)
    const { searchedCriterial } = useSelector(state => state.companies)
    const { searchedCriterialDimensions } = useSelector(state => state.companies)

    useEffect(() => {
        if (Object.entries(searchedCriterial).length === 0 && searchedCriterial.constructor === Object) {
            _getAddress()
        }
    }, [])

    const _handleInputChange = e => {
        //handle value
        const { value, name } = e.target;
        const { userData } = state;
        userData[name] = value;
        console.log(value)
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
        const { name, surname, email, additionalNotes, companyName, companyNIP } = state.userData;
        const { vehicles } = chosenCompany;
        const { typeOfSearch } = searchedCriterial;
        let data;
        let fullCost = 0;
        for (let vehicle of vehicles) {
            console.log(vehicle)
            fullCost += vehicle.fullCost
        }
        console.log(fullCost)

        data = {
            name, surname, email,
            description: additionalNotes,
            companyEmail: chosenCompany["email"],
            taxNumber: chosenCompany["taxNumber"],
            companyName,
            companyNIP,
            phone: chosenCompany["phone"],
            vehicles,
            fullCost: fullCost,
            startTime: "30.11.2019 15:00",
        }

        if (typeOfSearch === "Pallete") {
            data["isDimensions"] = false;
            data = { ...data, ...searchedCriterial }
        } else {
            data["isDimensions"] = true;
            data = { ...data, ...searchedCriterial }
        }

        axios.post(`${API_URL}/api/contact/contact-to-company`, data).then((response) => {
            console.log(response)
            const { status } = response;
            if (status === 200) {
                setOpen(true)
            }
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
        }
    }

    const _renderHeaderOfMailer = () => {
        const { nameOfCompany, email, isVat, place, phone, taxNumber, logo } = chosenCompany;
        return (
            <React.Fragment>
                <Link to="/search">Powrót do wyszukiwania</Link>
                <Grid container>
                    <Grid item xs={5}>
                        <StyledImg src={`http://dq1dsixf6z9ds.cloudfront.net/company_logos/${logo}`} alt="company" />
                    </Grid>
                    <Grid item xs={7}>
                        <h2>Firma Transportowa: {nameOfCompany}</h2>
                        <h4>Dane firmy</h4>
                        <StylexText>Nip:{taxNumber || null}</StylexText>
                        <StylexText>VAT: {isVat ? "TAK" : "NIE"}</StylexText>
                        <StylexText>Siedziba firmy: {place || null}</StylexText>
                        <StylexText>Email: {email || null}</StylexText>
                        <StylexText>Telefon: {phone || null}</StylexText>
                    </Grid>
                </Grid>
            </React.Fragment>


        )
    }

    const _getAddress = () => {
        const { points } = searchedCriterial;
        if (points !== undefined) {
            _viewModel.getNameFromLatLng(points[0], (val) => {
                console.log(val)

                // setState({ ...state, from: val })
            })
            _viewModel.getNameFromLatLng(points[1], (val) => {
                console.log(val)
                // setState({ ...state, toDest: val })
            })
        }

    }

    const _renderAlertModal = () => {

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Wiadomość została wysłana"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Twoja wiadomość została wysłana, zostaniesz przeniesiony do strony wyszukiwania.
          </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpen(false)
                            props.history.push("/search")
                        }} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
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
        console.log(additionalNotes)
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
                    <TextField variant="outlined" id="surname" name="surname" label="Nazwisko" fullWidth value={surname} onChange={e => _handleInputChange(e)} />
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
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            autoOk
                            variant="inline"
                            inputVariant="outlined"
                            label="Data rozpoczęcia zlecenia"
                            format="MM/dd/yyyy"
                            value={selectedDate}
                            InputAdornmentProps={{ position: "start" }}
                            onChange={date => {
                                console.log(date);
                                handleDateChange(date)
                            }}
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
                        defaultValue="Opis..."
                        margin="normal"
                        variant="outlined"
                        name="additionalNotes"
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
                        onChange={e => _handleInputChange(e)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" disabled={!companyData} id="nip" name="companyNIP" placeholder="Numer identyfikacji podatkowej" label="NIP" fullWidth value={companyNIP} onChange={e => _handleInputChange(e)}
                    />
                </Grid>
            </React.Fragment>
        )
    }


    const _renderFormComponent = () => {
        return (
            <Container>
                <Container style={{ width: '60%' }}>
                    {_renderAlertModal()}
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