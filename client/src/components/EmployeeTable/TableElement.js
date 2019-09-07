import React from 'react';
import { Button, CardActionArea, CardHeader, CardMedia, Card, CardContent, Grid, Typography, Container, Paper, MenuItem } from '@material-ui/core';
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
    },
    card: {
        margin: theme.spacing(2)
    }

}));

const TableElement = ({ data, id, handleRemoveEmployee }) => {
    const classes = useStyles();
    console.log(data)
    return (
        <Grid container spacing={12}>
            <Grid item xs={12}>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="p" component="p">
                                <strong>Nazwa:</strong> {data.firstName} <br />
                                <strong>Nazwisko:</strong> {data.lastName} <br />
                                <strong>Pensja:</strong> {data.sallary}<br />
                                <strong>Waluta:</strong> {data.currency}<br />
                                <strong>Stanowisko:</strong> {data.position}<br />
                            </Typography>
                            <Button variant="contained" className={classes.button} onClick={() => handleRemoveEmployee(id)}>
                                USUŃ
                        </Button>
                        </CardContent>

                    </CardActionArea>

                </Card>
            </Grid>

        </Grid>

    );
}
export default TableElement