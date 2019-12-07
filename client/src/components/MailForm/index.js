import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Grid, TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

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
    const [state, setState] = React.useState({
        companyData: true,

    })

    useEffect(() => {
        // console.log(props)
    }, [])

    const { chosenCompany } = useSelector(state => state.companies)

    console.log(chosenCompany)

    const _handleInputChange = e => {
        //handle input value

    }

    const handleCheckbox = e => {
        setState({
            companyData: e.target.checked
        })
    }

    const _renderHeaderOfMailer = () => {
        return (

            <Grid container>
                <Grid item xs={5}>
                    <Link to="/search">Powrót do wyszukiwania</Link>
                    <StyledImg src="" alt="company" />
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
        const { companyData } = state;
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
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" id="surname" name="surname" label="Nazwisko" fullWidth />
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
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Numer telefonu"
                        fullWidth
                        autoComplete="phoneNumber"
                    />
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
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox onChange={e => handleCheckbox(e)} color="primary" name="companyData" checked={companyData} value={true} />}
                        label="Dane firmy"
                    />
                </Grid>
                {/* <Grid item xs={12}> */}
                {_returnCompanyData()}
                {/* </Grid> */}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary">Wyślij</Button>
                </Grid>
            </Grid>
        )
    }

    const _returnCompanyData = () => {
        const { companyData } = state;
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
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" disabled={!companyData} id="nip" name="nip" placeholder="Numer identyfikacji podatkowej" label="NIP" fullWidth />
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