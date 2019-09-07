import React, { useState } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CostsTable from '../../components/CostsTable';


// const useStyles = makeStyles(theme => ({
//     '@global': {
//         body: {
//             backgroundColor: theme.palette.common.white,
//         },
//     },
//     root: {
//         flexGrow: 1,
//         height: '100vh',
//         background: 'linear-gradient(top, #f2f2f2 70%, #232f3e 30%)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     tts_logo: {
//         maxWidth: '10%',
//         height: 'auto',
//     },

// }));

export default function CostsDashboard() {
    return (
        <CostsTable />
    );
}