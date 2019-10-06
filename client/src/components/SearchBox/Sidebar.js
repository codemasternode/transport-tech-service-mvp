import React from 'react';
import { Button, TextField, FormControlLabel, FormHelperText, Checkbox, Grid, Container, Paper, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import labelsOfSearchInputs from '../../constants/dataOfTransports'
import typesOfSearch from '../../constants/dataOfTransports'
import Geocode from "react-geocode";
import PropTypes from 'prop-types';

Geocode.setApiKey("AIzaSyCbxWM2sqqiQoxXyR1maA_9dzro72-vKOw");
Geocode.enableDebug();

const theme = createMuiTheme({
    overrides: {
        // Name of the component ⚛️
        MuiOutlinedInput: {
            // The default props to change
            // padding: '12px 10px', // No more ripple, on the whole application 💣!
            input: {
                padding: '12px 10px',
            }
        },
    },
});


const Sidebar = ({ handleOpenSidebar, isOpenSidebar, nameOfSidebar, selectedPoints }) => {
    const _validNameOfSidebar = nameOfSidebar === "openLeft" ? true : false;
    const _correctClassNameOfSidebar = _validNameOfSidebar ? "sidebar sidebar__left" : "sidebar sidebar__right";
    const _correctClassNameOfClickSidebar = _validNameOfSidebar ? "sidebar__left__click" : "sidebar__right__click";
    const _styleOfSidebar = _validNameOfSidebar ? (isOpenSidebar[nameOfSidebar] ? { left: 0 } : { left: "-18%" }) : isOpenSidebar[nameOfSidebar] ? { right: 0 } : { right: "-15%" }

    const _renderInputs = () => {
        // if (nameOfSidebar === "openLeft") {
        return (
            labelsOfSearchInputs.map((item, key) => (
                <div key={key} className="text__field__form">
                    <label className="text__field__label">{item.label}</label>
                    <input type="text" className="text__field__input" />
                </div>
            ))
        )
        // }
    }

    const _renderSelectOfTypes = () => {
        return (
            labelsOfSearchInputs.map((item, key) => (
                <div key={key} className="text__field__form">
                    <label className="text__field__label">{item.label}</label>
                    <input type="text" className="text__field__input" />
                </div>
            ))
        )
    }

    const _viewModel = {
        getNameFromLatLng: selectedPoint => {
            console.log(selectedPoint)
            const lat = selectedPoint.latitude;
            const lng = selectedPoint.longitude;
            Geocode.fromLatLng(lat, lng).then(
                response => {
                    console.log(response)
                    const addressFull = response.results[0].formatted_address;
                    // let address = addressFull.split(",")[1]
                    // let streetName = addressFull.split(",")[0]
                    // let country = addressFull.split(",")[2]
                    console.log(addressFull)
                    return addressFull

                },
                error => {
                    console.error(error);
                }
            );
        }
    }

    // const geocodeAddress = (address, callback) => {
    //     const geocoder = new google.maps.Geocoder();
    //     geocoder.geocode({
    //         address,
    //     }, function (results, status) {
    //         if (status === 'OK') {
    //             callback({
    //                 lat: results[0].geometry.location.lat(),
    //                 lng: results[0].geometry.location.lng(),
    //             });
    //         } else {
    //             alert('Cannot find address');
    //         }
    //     });
    // }

    const _renderSelectedPoints = () => {
        // return (
        //     selectedPoints.map((point, index) => {
        //         // console.log(_viewModel.getNameFromLatLng(point))
        //         let name = await _viewModel.getNameFromLatLng(point)
        //         console.log(name)
        //         // Geocode.fromLatLng(point.latitude, point.longitude).then(
        //         //     response => {
        //         //         const addressFull = response.results[0].formatted_address;
        //         //         return addressFull
        //         //     },
        //         //     error => {
        //         //         console.error(error);
        //         //     }
        //         // );
        //         return (
        //             <li key={index}>{name}</li>
        //         )
        //     })
        // )

        // const geoResponse = getGeoCode(req.body.address, errors, res);

        // geoResponse.then((result) => {

        //     console.log(result)
        // }).catch((err) => {
        //     console.log(err);
        // })
        // geocodeAddress(place, onGeocodeComplete);
    }

    const _renderSearchContent = () => {
        return (
            <Grid container={true} direction="column" alignItems="center">
                <Grid item xs={12} style={{ width: '100%' }}>
                    <div style={{ width: '100%', backgroundColor: '#cccccc', textAlign: 'center', height: '50px', margin: 'auto' }}>
                        <h4>Kryteria</h4>
                    </div>
                </Grid>
                {_renderInputs()}
                <Grid item xs={12} style={{ width: '100%' }}>
                    <div style={{ width: '100%', backgroundColor: '#cccccc', textAlign: 'center', height: '50px', margin: 'auto' }}>
                        <h4>Punkty</h4>
                    </div>
                    <ul>
                        {_renderSelectedPoints()}
                    </ul>
                </Grid>
            </Grid>

        )
    }

    const _renderResultContent = () => {

    }

    const _isRenderSidebar = () => {
        if (_validNameOfSidebar) {
            return (
                <div className="sidebar__left__requirements">
                    <ThemeProvider theme={theme}>
                        {/* <Grid container={true} direction="column" alignItems="center">
                            <Grid item xs={12} style={{ width: '100%' }}>
                                <div style={{ width: '100%', backgroundColor: '#cccccc', textAlign: 'center', height: '50px', margin: 'auto' }}>
                                    <h4>Kryteria</h4>
                                </div>
                            </Grid>
                            {_renderInputs()}
                        </Grid> */}
                        {_renderSearchContent()}
                    </ThemeProvider>
                </div>
            )
        } else {
            return (
                <div>
                    {_renderResultContent()}
                </div>
            )
        }
    }

    return (
        <div className={_correctClassNameOfSidebar} style={_styleOfSidebar}>
            <span className={_correctClassNameOfClickSidebar} onClick={() => { handleOpenSidebar(nameOfSidebar) }}></span>
            {_isRenderSidebar()}
        </div>
    )
}

export default Sidebar;

Sidebar.defaultProps = {
    isOpenSidebar: {
        openLeft: true,
        openRight: true,
    },
    selectedPoints: [],
};


Sidebar.propTypes = {
    isOpenSidebar: PropTypes.object,
    nameOfSidebar: PropTypes.string,
    selectedPoints: PropTypes.array
}