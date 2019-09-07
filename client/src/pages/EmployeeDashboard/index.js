import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EmployeeTable from '../../components/EmployeeTable/index';


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

export default function EmployeeDashboard() {
    return (
        <EmployeeTable />
    );
}