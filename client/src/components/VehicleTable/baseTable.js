import React from "react";
import { Button, CardActionArea, CardHeader, CardMedia, Card, CardContent, Grid, Typography, Container, Paper, MenuItem, CardActions } from '@material-ui/core';
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
        margin: '10px 0'
    }

}));

function TableBase({ data, id, length }) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        checkValue: false,
    })
    return (
        <Card className={classes.viewCard}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {id + 1}/{length}
                </Typography>
                <Typography variant="h5" component="h5">
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