import React, { useState } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DatabaseTable from '../../components/DatabaseTable/index'
import './index.scss'
import {DashboardWindowContextConsumer} from '../../components/provider/dashboard/CreateDashboardContext'


export default function DatabaseDashboard() {
    // const classes = useStyles();

    return (
        <DashboardWindowContextConsumer>
        {
            ({ data, handleRemoveBase, clickOnMap, plan }) => (
                <React.Fragment>
                    <DatabaseTable data={data} handleRemoveBase={handleRemoveBase} clickOnMap={clickOnMap} plan={plan} />
                </React.Fragment>
            )
        }
    </DashboardWindowContextConsumer>
    );
}