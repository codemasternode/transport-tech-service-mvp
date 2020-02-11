import React from 'react';
import { useStyles } from '../../utils/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Button, CssBaseline, Container } from '@material-ui/core';
import axios from 'axios';
import { API_URL } from '../../utils/urls'
import Logo from '../../images/1.png';

const themes = createMuiTheme({
    palette: {
        error: {
            main: '#ff9900',
        }
    },
})

const ConfirmPage = props => {
    const classes = useStyles();

    const _activeAccount = () => {
        const { id } = props.match.params
        if (id !== "" && id !== undefined) {
            axios.post(`${API_URL}/api/confirm`, { code: id }).then(res => {
                console.log(res)
            }, (err) => {
                console.log("Axios error: " + err)
            })
        }
    }

    const _init = () => {
        return (
            <ThemeProvider theme={themes}>
                <div className={classes.root}>
                    <Container component="main" maxWidth="xs" className={classes.container_form}>
                        <CssBaseline />
                        <div className={classes.paper}>
                            <img src={Logo} alt="logo" className={classes.tts_logo} />
                            <Button onClick={_activeAccount}>
                                Aktywuj swoje konto
                            </Button>
                        </div>
                    </Container>
                </div>
            </ThemeProvider>
        )
    }

    return _init()
}

export default ConfirmPage;