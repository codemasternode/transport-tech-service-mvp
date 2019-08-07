import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import ReactPhoneInput from 'react-phone-input-mui';
import SignUp from './Pages/RegisterPage';
import SignIn from './Pages/LoginPage';

const themes = createMuiTheme({
  palette: {
    error: {
      main: '#ff9900',
    }
  },
  // overrides: {
  //   MuiOutlinedInput: { // Name of the component ⚛️ / style sheet
  //     text: { // Name of the rule
  //       color: 'yellow', // Some CSS
  //     },
  //   },
  // },
})

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  root: {
    flexGrow: 1,
    height: '100vh',
    background: 'linear-gradient(top, #f2f2f2 70%, #232f3e 30%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tts_logo: {
    maxWidth: '10%',
    height: 'auto',
  },
  container_form: {
    backgroundColor: '#ffffff',
    minHeight: '70%',
    minWidth: '30%',
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '90%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit_label: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#000000',
    width: "50%"
  },
  '.MuiFormLabel-root.Mui-error': {
    color: '#ff9900'
  },
  tts_input: {
    caretColor: theme.palette.error.main,
  },
  tts_labelField_d: {
    opacity: 0
  }
  // '.Mui-error'
}));

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <h1>ELLO</h1>} />
        <Route path="/signup/" component={SignUp} />
        <Route path="/login/" component={SignIn} />
      </Switch>
    </BrowserRouter>

  )
}