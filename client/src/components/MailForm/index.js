import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
// import styled from 'styled-components';

// const StyledGrid = styled.Grid`
//     display: flex;
//     justyfy-content: center;
//     flex-direction: column;
//     align-items: center;
// `


const MailForm = (props) => {
    const [state, setState] = React.useState({

    })

    useEffect(() => {
        // console.log(props)
    }, [])

    const { chosenCompany } = useSelector(state => state.companies)

    console.log(chosenCompany)

    const _handleInputChange = e => {
        //handle input value

    }

    const _renderHeaderOfMailer = () => {
        return (
            <React.Fragment>
                <Link to="/search" >Powrót do wyszukiwania</Link>
                <Grid container={true}>
                    <Grid item xs={4}>
                        {/* <img src="./" /> */}
                    </Grid>
                    <Grid item xs={8}>
                        <h2>Firma Transportowa X</h2>
                        <h4>Dane firmy</h4>
                        <p>Nip: XXX-xxx-xxx</p>
                        <p>VAT: TAK/NIE</p>
                        <p>Siedziba firmy</p>
                        <p>Telefon</p>
                        <p>{chosenCompany.typeOfSearch}</p>
                    </Grid>
                </Grid>

            </React.Fragment>
        )
    }

    const _renderOrderDetails = () => {
        return (
            <React.Fragment>
                <p>Transport z:</p>
                <p>Transport do:</p>
                <h5>Cena: 1293 PLN</h5>
                <h5>Szczegóły:</h5>
                <Grid container={true}>
                    <Grid item xs={4}>
                        {/* <img src="./" /> */}
                    </Grid>
                    <Grid item xs={8}>
                        <h2>Firma Transportowa X</h2>
                        <h4>Dane firmy</h4>
                        <p>Nip: XXX-xxx-xxx</p>
                        <p>VAT: TAK/NIE</p>
                        <p>Siedziba firmy</p>
                        <p>Telefon</p>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }


    const _renderFormComponent = () => {
        return _renderHeaderOfMailer()
    }

    return _renderFormComponent()
}

export default MailForm;