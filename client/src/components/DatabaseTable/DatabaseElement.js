import React, { useState } from 'react';
import { Button, CssBaseline, FormControlLabel, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#ff9900',
    }

}));

const NewCostPlan = ({ data, id, handleRemoveOrder }) => {
    const classes = useStyles();
    console.log(data)
    return (
        <Grid container spacing={12}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <p>Tytuł {data.title} </p>
                    <p>Adres {data.address} </p>
                    <p>Ulica {data.streetName} </p>
                    <p>Kraj {data.country} </p>
                    <Button variant="contained" className
                        ={classes.button} onClick={() => handleRemoveOrder(id)}>
                        Usuń
                    </Button>
                </Paper>
            </Grid>

        </Grid>

    );
}
export default NewCostPlan