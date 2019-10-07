import React from "react";
import { Button, CardActionArea, CardHeader, CardMedia, Card, CardContent, Grid, Typography, Container, Paper, MenuItem, CardActions, FormHelperText, FormControl, Select, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircle, RemoveCircleSharp } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    button: {
        backgroundColor: '#ff9900',
    },
    card: {
        margin: theme.spacing(2)
    },
    viewCard: {
        margin: 10
    }

}));

function TableBase({ allData, data, id, length, handleAddVehicle }) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        checkValue: false,
    })
    return (
        <Card className={classes.viewCard} onClick={(e) => handleAddVehicle(e, data.title, id)} style={allData.activeBase === id ? { backgroundColor: 'rgba(179,0,255,.6)' } : null}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {id + 1}/{length}
                </Typography>
                <Typography variant="p" component="h5">
                    {data.title}
                </Typography>
                <br />
                <Typography color="textSecondary">
                    Tytuł: <strong>{data.title}</strong><br />
                    Adres: <strong>{data.address}</strong><br />
                    Ulica: <strong>{data.streetName}</strong> <br />
                    Kraj: <strong>{data.country}</strong> <br />
                </Typography>
            </CardContent>
        </Card>
    );
}

export default TableBase;