import React from "react";
import { Button, CardActionArea, CardHeader, CardMedia, Card, CardContent, Grid, Typography, Container, Paper, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircle, RemoveCircleSharp } from '@material-ui/icons';



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

function TableElement({ type, data, id, handleRemoveUser, handleAddUser }) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        checkValue: false,
    })
    return (
        <Grid container spacing={12}>
            <Grid item xs={12}>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent className="grid__contentCard">
                            <Typography gutterBottom variant="p" component="p">
                                <strong>{data.name} {data.surname}</strong><br />
                                <strong>Email: </strong>{data.email}<br />
                                <strong>Password: </strong>{data.password}<br />
                            </Typography>
                            {
                                type ? <AddCircle className={classes.icon} onClick={() => handleAddUser(id)} color={state.checkValue ? "secondary" : "primary"} >add_circle</AddCircle> :
                                    <RemoveCircleSharp onClick={() => handleRemoveUser(id)}>w</RemoveCircleSharp>
                            }

                        </CardContent>
                    </CardActionArea>

                </Card>
            </Grid>

        </Grid>

    );
}

export default TableElement;