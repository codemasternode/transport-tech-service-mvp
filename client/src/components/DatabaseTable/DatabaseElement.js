import React from 'react';
import { Button, CardActions, Typography, Card, CardContent, TextField, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    button: {
        color: '#ff9900',
    },
    viewCard: {
        margin: 6,
    }
}));

const DatabaseElement = ({ data, id, handleRemoveOrder, length }) => {
    const classes = useStyles();
    return (
        <Card className={classes.viewCard}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {id + 1}/{length}
                </Typography>
                <Typography variant="h5" component="h3">
                    {data.title}
                </Typography>
                <br />
                <Input data={data} />
            </CardContent>
            <CardActions>
                <Button size="small" className={classes.button} onClick={() => handleRemoveOrder(id)}>Usuń</Button>
            </CardActions>
        </Card>

    );
}
export default DatabaseElement

const Input = ({ data }) => {
    return (
        <form noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        autoComplete="name"
                        name="name"
                        variant="outlined"
                        required
                        fullWidth
                        id="name"
                        label="Nazwa"
                        
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="street"
                        label="Ulica"
                        name="street"
                        autoComplete="street"
                        value={data.streetName}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="postCode"
                        label="Kod pocztowy"
                        autoComplete="postCode"
                        value={data.address}

                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="country"
                        label="Kraj"
                        id="country"
                        value={data.country}

                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="city"
                        label="Miasto"
                        autoComplete="city"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Typography color="textSecondary">
                        Tytuł: <strong>{data.title}</strong><br />
                        Adres: <strong>{data.address}</strong><br />
                        Ulica: <strong>{data.streetName}</strong> <br />
                        Kraj: <strong>{data.country}</strong> <br />
                    </Typography>
                </Grid>
            </Grid>
        </form>
    )
}