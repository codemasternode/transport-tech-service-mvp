import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { BrowserRouter, Switch, Route } from 'react-router-dom';
=======
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
<<<<<<< HEAD
=======
import Link from '@material-ui/core/Link';
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import ReactPhoneInput from 'react-phone-input-mui';
<<<<<<< HEAD
import SignUp from './Pages/RegisterPage';
import SignIn from './Pages/LoginPage';
=======
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17

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

<<<<<<< HEAD
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
=======


const validateEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
var errfn, errln = false

const validate = values => {

  const errors = [];
  // if (!values.firstName) {
  //   errors.push({ firstName: "Imie nie może być puste" })
  // }
  if (values.firstName && values.firstName.length < 3) {
    errors.push({ firstName: "First name too short" });
    errfn = true
  } else {
    errfn = false
  }

  // if (!values.lastName) {
  //   errors.push({ lastName: "Nazwisko nie może być puste" })
  // }

  if (values.lastName && values.lastName.length < 3) {
    errors.push({ lastName: "Last name too short" });
    errln = true
  } else {
    errln = false
  }

  if (values.email && !(validateEmail(values.email))) {
    errors.push({ email: "Podany email jest nie poprawny" })
  }

  return errors;
}

const useForm = initial => {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState([]);
  const isFirstRun = useRef(true);

  useEffect(() => {

    if (isFirstRun.current) {
      isFirstRun.current = false;
      console.log("FIRST")
      return;
    } else {
      console.log(values)
      setErrors(validate(values))
    }

  }, [values]);

  const updateValue = e => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const submitHandler = e => {
    e.preventDefault();

    if (errors.length === 0) {
      console.log("SEND FRAJERA")
    }
  }
  console.log(errors)
  return [updateValue, submitHandler, errors];
}

export default function SignUp() {
  const classes = useStyles();
  const [updateValue, submitHandler, errors] = useForm({});
  return (
    <ThemeProvider theme={themes}>
      <div className={classes.root}>
        <Container component="main" maxWidth="xs" className={classes.container_form}>
          <CssBaseline />
          <div className={classes.paper}>
            <img src="./logo.png" alt="logo" className={classes.tts_logo} />
            <Typography component="h1" variant="h5">
              Transport Tech Service
        </Typography>
            <form className={classes.form} noValidate onSubmit={submitHandler}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="Imie"
                    autoFocus
                    onChange={updateValue}
                    error={errfn}
                    className={classes.tts_input}
                  />
                  {errors.length !== 0 && errors.map(err => err.firstName ? <FormHelperText className={errfn ? 'tts-labelField' : 'tts_labelField_d'} error={errors.length !== 0 ? true : false}>{err.firstName}</FormHelperText> : "")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Nazwisko"
                    name="lastName"
                    autoComplete="lname"
                    onChange={updateValue}
                    error={errln}
                    className={classes.tts_input}
                  />
                  {errors && errors.map(err => err.lastName ? <FormHelperText error={errors.length !== 0 ? true : false}>{err.lastName}</FormHelperText> : "")}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    error={errors.length !== 0 && errors.email ? true : false}
                    onChange={updateValue}
                    autoComplete="email"
                  />
                  {errors && errors.map(err => err.email ? <FormHelperText error={errors.length !== 0 ? true : false}>{err.email}</FormHelperText> : null)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="krs"
                    variant="outlined"
                    fullWidth
                    id="krs"
                    label="KRS"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="nip"
                    label="NIP"
                    name="nip"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    hintText="Phone"
                    floatingLabelText="Phone"
                    name="phone"

                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Grid className={classes.submit_label}><Button
                type="submit"
                disabled={errors ? true : false}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Wyślij
          </Button></Grid>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
              </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>

      </div>
    </ThemeProvider>
  );
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
}