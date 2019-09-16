import React from 'react';
import { Button, CardContent, Card, CardActions, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    button: {
        backgroundColor: '#ff9900',
    },
    viewCard: {
        margin: '10px 0',
    }

}));

const NewCostPlan = ({ data, id, handleRemoveOrder, length }) => {
    const classes = useStyles();
    console.log(data)
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
                Nazwa {data.name} <br />
                Wartość {data.valuePrice} <br />
                Waluta {data.currency} <br />
                Częstotliwość {data.frequency}<br />
            </CardContent>
            <CardActions>
                <Button size="small" className={classes.button} onClick={() => handleRemoveOrder("costs",id)}>Usuń</Button>
            </CardActions>
        </Card>

    );
}
export default NewCostPlan