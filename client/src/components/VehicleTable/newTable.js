import React, { useEffect } from "react";
import { Button, CardActionArea, CardHeader, CardMedia, Card, CardContent, Grid, Typography, Container, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CheckCircle } from '@material-ui/icons';


const useStyles = makeStyles(theme => ({
    outter: {
        width: '95%',
        margin: '10px 0',
        padding: 10
    },
    button: {
        backgroundColor: '#ff9900',
    },
    card: {
        margin: theme.spacing(2)
    },
    textField: {
        // padding: '12px 10px'
    }

}));

const theme = createMuiTheme({
    overrides: {
        // Name of the component ⚛️
        MuiOutlinedInput: {
            // The default props to change
            // padding: '12px 10px', // No more ripple, on the whole application 💣!
            input: {
                padding: '12px 10px',
            }
        },
    },
});

function NewTable({ allData, handleChangeBase, id, handleAdding }) {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        name: 'Pojazd 1',
        valueOfVehicle: "250000",
        petrol: "ON",
        combustion: 22,
        capacity: 8000,
        amortization: 15,
        lenght: 12,
        width: 12,
        height: 12,
        emptyVehicle: 10,
    })


    const [state, setState] = React.useState({
        checkValue: false,
        active: false
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };
    useEffect(() => {
        console.log(allData)
        var active = false
        if (allData.basesAndVehicles.length > 0) {
            console.log("WWWW")
            allData.basesAndVehicles.map((item, key) => {
                if (item.id === allData.activeBase) {
                    console.log(item)
                    item.vehicles.map((i, k) => {
                        if (i === id) {
                            active = true
                        } else {
                            // active = false
                        }
                    })
                }
            })


        }
        console.log(active)
        console.log("YEAAA")
        setState({ ...state, active })
    }, [allData.basesAndVehicles, id, allData.activeBase, allData])
    return (
        <ThemeProvider theme={theme}>
            <Paper className={classes.outter} onClick={(e) => {
                handleChangeBase(e, values, id)
                setState({
                    ...state,
                    checkValue: true
                })
            }} style={state.active ? { backgroundColor: 'rgba(179,0,255,.6)' } : null}>
                <form className={classes.container} noValidate autoComplete="off">
                    <Grid container spacing={3} direction="row">
                        <Grid item xs={4}>
                            <Grid container={true} >
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-name"
                                        label="Nazwa"
                                        className={classes.textField}
                                        value={values.name}
                                        onChange={handleChange('name')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-combustion"
                                        label="Spalanie"
                                        className={classes.textField}
                                        value={values.combustion}
                                        onChange={handleChange('combustion')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-capacity"
                                        label="Pojemność"
                                        className={classes.textField}
                                        value={values.capacity}
                                        onChange={handleChange('capacity')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <Grid container={true} >
                                <h4>Wymiary ładowni: </h4>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-lenght"
                                        label="Długość (m)"
                                        className={classes.textField}
                                        value={values.lenght}
                                        onChange={handleChange('lenght')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-width"
                                        label="Szerokość (m)"
                                        className={classes.textField}
                                        value={values.width}
                                        onChange={handleChange('width')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-height"
                                        label="Wysokość"
                                        className={classes.textField}
                                        value={values.height}
                                        onChange={handleChange('height')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Grid container={true}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-amortization"
                                        label="Amortyzacja"
                                        className={classes.textField}
                                        value={values.amortization}
                                        onChange={handleChange('amortization')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-petrol"
                                        label="Paliwo"
                                        className={classes.textField}
                                        value={values.petrol}
                                        onChange={handleChange('petrol')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-valueOfVehicle"
                                        label="Wartość pojazdu (zł)"
                                        className={classes.textField}
                                        value={values.valueOfVehicle}
                                        onChange={handleChange('valueOfVehicle')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard-emptyVehicle"
                                        label="Puste przejazdy (%)"
                                        className={classes.textField}
                                        value={values.emptyVehicle}
                                        onChange={handleChange('emptyVehicle')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                            <CheckCircle onClick={() => { handleAdding("vehicle", values, id) }} color={state.checkValue ? "secondary" : "primary"}></CheckCircle>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </ThemeProvider>
    );
}

export default NewTable;







