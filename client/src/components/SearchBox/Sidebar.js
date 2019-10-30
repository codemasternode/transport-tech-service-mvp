import React from 'react';
import { Button, TextField, FormControlLabel, FormHelperText, Checkbox, Grid, Container, Paper, FormLabel, MenuItem, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import labelsOfSearchInputs from '../../constants/dataOfTransports'
import typesOfSearch from '../../constants/typesOfSearch'
import Geocode from "react-geocode";
import axios from "axios";
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
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
axios.defaults.withCredentials = true

const Sidebar = ({ handleOpenSidebar, isOpenSidebar, nameOfSidebar, handleSearchRequest, resultSearchedData, isVisible }) => {
    const _validNameOfSidebar = nameOfSidebar === "openLeft" ? true : false;
    const _correctClassNameOfSidebar = _validNameOfSidebar ? "sidebar sidebar__left" : "sidebar sidebar__right";
    const _correctClassNameOfClickSidebar = _validNameOfSidebar ? "sidebar__left__click" : "sidebar__right__click";
    const _styleOfSidebar = _validNameOfSidebar ? (isOpenSidebar[nameOfSidebar] ? { left: 0 } : { left: "-18%" }) : isOpenSidebar[nameOfSidebar] ? { right: 0 } : { right: "-15%" }
    const [state, setState] = React.useState({
        criteria: {
            length: 2,
            width: 2,
            height: 2,
            capacity: 12,
            type: "Firanka",
            waitingTime: 12,
            volume: 32980,
        },
        distanceToDrive: 600,
        points: [
            {
                "lat": 50.014703,
                "lng": 19.880671
            },
            {
                "lat": 54.030763,
                "lng": 20.111284
            }
        ],
        operation: "single",
    })


    const _renderInputs = () => {
        //render inputs of criteria
        return (
            labelsOfSearchInputs.map((item, key) => (
                <div key={key} className="text__field__form">
                    <label className="text__field__label">{item.label}</label>
                    <input type="text" className="text__field__input" />
                </div>
            ))
        )
    }

    const _renderSelectOfTypes = () => {
        // render select of types
        return (
            <TextField
                id="standard-select-currency"
                select
                label="Waluta"
                value={state.criteria.type}
                // onChange={handleChange('currency')}
                SelectProps={{
                    MenuProps: {
                        // className: classes.menu,
                    },
                }}
                helperText="Wybierz walutę płatności"
                margin="normal"
                variant="outlined"
            >
                {typesOfSearch.map((option, key) => {
                    return (
                        <MenuItem value={option} key={key}>
                            {option}
                        </MenuItem>
                    )
                })}
            </TextField>
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

    }

    const styleOfSearchBlock = {
        width: '100%', backgroundColor: '#cccccc', textAlign: 'center', height: '50px', margin: 'auto'
    }

    const _renderSearchContent = () => {
        return (
            <Grid container={true} direction="column" alignItems="center">
                <Grid item xs={12} style={{ width: '100%' }}>
                    <div style={styleOfSearchBlock}>
                        <h4>Kryteria</h4>
                    </div>
                </Grid>
                {_renderInputs()}
                {_renderSelectOfTypes()}
                <Button onClick={() => {
                    handleSearchRequest()
                }}>Szukaj</Button>
                <Grid item xs={12} style={{ width: '100%' }}>
                    <div style={styleOfSearchBlock}>
                        <h4>Punkty</h4>
                    </div>
                    {/* <ul>
                        {_renderSelectedPoints()}
                    </ul> */}
                </Grid>
            </Grid>

        )
    }

    const styleOfRow = {
        margin: 5,
        // pargin: 1
    }

    const _rowRenderer = ({
        key,         // Unique key within array of rows
        index,       // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible,   // This row is visible within the List (eg it is not an overscanned row)
        style        // Style object to be applied to row (to position it)
    }) => {
        return (
            <div
                key={key}
                style={{ ...style }}
            >
                <h4 style={styleOfRow}>{resultSearchedData[index].company.nameOfCompany}</h4>
                <p style={styleOfRow}>{resultSearchedData[index].company.email}</p>
                <p style={styleOfRow}>{resultSearchedData[index].fullCost}</p>
            </div>
        )
    }


    const _renderResultContent = () => {
        // const {isVisible} = state;
        if (isVisible) {
            if (resultSearchedData.length === 0) {
                return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress />
                    </div>
                )
            } else {
                // console.log("GIT")
                return (
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={resultSearchedData.length}
                                rowHeight={100}
                                rowRenderer={_rowRenderer}
                            />
                        )}
                    </AutoSizer>
                )
            }
        } else {
            return null
        }

    }

    const _isRenderSidebar = () => {
        if (_validNameOfSidebar) {
            return (
                <div className="sidebar__left__requirements">
                    <ThemeProvider theme={theme}>
                        {_renderSearchContent()}
                    </ThemeProvider>
                </div>
            )
        } else {
            return (
                <React.Fragment>
                    {_renderResultContent()}
                </React.Fragment>
            )
        }
    }

    return (
        <div className={_correctClassNameOfSidebar} style={_styleOfSidebar}>
            <span className={_correctClassNameOfClickSidebar} onClick={() => {
                handleOpenSidebar(nameOfSidebar)

            }}></span>
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