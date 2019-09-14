import React from "react";
import { Button, CardActionArea, CardHeader, CardMedia, Card, CardContent, Grid, Typography, Container, Paper, TextField} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircle, RemoveCircleSharp } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    button: {
        backgroundColor: '#ff9900',
    },
    card: {
        margin: theme.spacing(2)
    }

}));

function NewTable({ data, id, length }) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        checkValue: false,
    })
    return (
        <Paper className={classes.paper}>
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
                                <Grid item xs={4}>
                                    <Grid container={true} >
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
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>

    );
}

export default NewTable;







