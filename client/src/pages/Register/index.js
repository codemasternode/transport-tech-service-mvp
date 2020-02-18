import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, Container, MenuItem } from '@material-ui/core';
import Select from 'react-select';
import axios from "axios";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useStyles } from '../../utils/styles'
import Logo from './1.png'
import RegisterForm from '../../components/RegisterForm'
import { API_URL } from '../../utils/urls'

const themes = createMuiTheme({
    palette: {
        error: {
            main: '#ff9900',
        }
    },
})

const validateEmail = email => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email)
}

export default (props) => {
    const classes = useStyles();
    const [state, setState] = useState({
        registerValues: {
            logo: "",
            name: "",
            surname: "",
            nameOfCompany: "",
            phone: "",
            taxNumber: "",
            place: "",
            isVat: false,
            email: "",
            country: "Poland",
            countries: "Poland",
            password: "",
            confirmPassword: ""
        },
        inviteCode: ""
    })
    useEffect(() => {
        _sendRequest("onload", {})
        _validParams()
    }, [])

    const _sendRequest = (type, data) => {
        if (type === "onload") {
            const { id } = props.match.params
            const date = new Date().toISOString()
            console.log(API_URL)
            axios.post(`${API_URL}/api/web-stats`, { name: "register", date }).then((response) => {
                // 
            }, (err) => {
                console.log("Axios error: " + err)
            })
            console.log(id)
            if (id !== "" && id !== undefined) {
                axios.post(`${API_URL}/api/invites`, { code: id }).then((response) => {
                    // 
                }, (err) => {
                    console.log("Axios error: " + err)
                })
            }


        } else if (type === "submit") {
            const { name,
                surname,
                nameOfCompany,
                phone,
                taxNumber,
                place,
                isVat,
                email,
                country,
                countries,
                password,
                file } = data
            console.log("submit")
            const bodyFormData = new FormData();
            bodyFormData.set('name', name);
            bodyFormData.set('surname', surname);
            bodyFormData.set('email', email);
            bodyFormData.set('phone', phone);
            bodyFormData.set('taxNumber', taxNumber);
            bodyFormData.set('place', place);
            bodyFormData.set('isVat', isVat);
            bodyFormData.set('country', country);
            bodyFormData.set('countries', countries);
            bodyFormData.set('password', password);
            bodyFormData.set('nameOfCompany', nameOfCompany);
            bodyFormData.append('logo', file);
            axios({
                method: 'POST',
                url: `${API_URL}/api/company/create-company`,
                data: bodyFormData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });
        }
    }

    const _validParams = () => {
        const { id } = props.match.params
        console.log(id)
        setState({
            ...state,
            inviteCode: id
        })
    }
    return (
        <ThemeProvider theme={themes}>
            <div className={classes.root}>
                <Container component="main" maxWidth="xs" className={classes.container_form}>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <img src={Logo} alt="logo" className={classes.tts_logo} />
                        <RegisterForm sendRequest={_sendRequest} registerValues={state.registerValues} validateEmail={validateEmail} />
                    </div>
                </Container>
            </div>
        </ThemeProvider>
    );
}