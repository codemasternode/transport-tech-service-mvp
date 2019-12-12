import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import "moment/locale/pl";

moment.locale("pl");

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
        }
    })
    const [selectedDate, handleDateChange] = useState(new Date());
    // useEffect(() => {
    //     // console.log(props)
    // }, [])

    const { chosenCompany } = useSelector(state => state.companies)
    const { searchedCriterial } = useSelector(state => state.companies)

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

    const _renderHeaderOfMailer = () => {
        return (
            <React.Fragment>
                <Link to="/search">Powrót do wyszukiwania</Link>
                <Grid container>
                    <Grid item xs={5}>
                        <StyledImg src="http://d2ckak7af1omc2.cloudfront.net/company_logos/logo1.png" alt="company" />
                    </Grid>
                    <Grid item xs={7}>
                        <h2>Firma Transportowa X</h2>
                        <h4>Dane firmy</h4>
                        <StylexText>Nip: XXX-xxx-xxx</StylexText>
                        <StylexText>VAT: TAK/NIE</StylexText>
                        <StylexText>Siedziba firmy</StylexText>
                        <StylexText>Telefon</StylexText>
                        <StylexText>{chosenCompany.typeOfSearch}</StylexText>
                    </Grid>
                </Grid>
            </React.Fragment>


        )
    }

    const _renderOrderDetails = () => {
        return (
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12} style={{ width: '100%' }}>
                    <StylexText >Transport z:</StylexText>
                    <StylexText>Transport do:</StylexText>
                    <h5>Cena: 2334 PLN</h5>
                    <h5>Szczegóły</h5>
                </Grid>
                <Grid item xs={12} style={{ width: '100%' }}>
                    <Grid container justify="flex-start">
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <StylexText>Liczba palet 1:</StylexText>
                                </Grid>
                                <Grid item xs={6}>
                                    <StylexText>Liczba palet 2:</StylexText>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <StylexText>Liczba palet 3:</StylexText>
                                </Grid>
                                <Grid item xs={6}>
                                    <StylexText>Liczba palet 4:</StylexText>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
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
                        defaultValue="Opis..."
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

    return _renderFormComponent()
}

export default MailForm;