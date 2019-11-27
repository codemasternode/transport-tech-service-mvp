import React from 'react';
import { Button, TextField, Select, FormControlLabel, FormHelperText, Checkbox, Grid, Container, Paper, FormLabel, MenuItem, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import labelsOfSearchInputs from '../../constants/dataOfTransports'
import typesOfSearch from '../../constants/typesOfSearch'
import typesOfPallets from '../../constants/typesOfPallets'
import Geocode from "react-geocode";
import axios from "axios";
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import PropTypes from 'prop-types';
import SearchContent from './SearchContent';

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
        points: [
            {
                "lat": 50.014703,
                "lng": 19.880671
            },
            {
                "lat": 54.030763,
                "lng": 20.111284
            }
        ]
    })

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
        const { vehicles } = resultSearchedData[index]
        let summary = 0;
        const totalCost = vehicles.reduce((sum, curr) => {
            console.log(sum, curr)
            return summary += curr.sumCostPerMonth;
        })

        return (
            <div
                key={key}
                style={{ ...style }}
            >
                <h4 style={styleOfRow}>{resultSearchedData[index].nameOfCompany}</h4>
                <p style={styleOfRow}>Ilość pojazdów: {resultSearchedData[index].vehicles.length}</p>
                <p style={styleOfRow}>Całkowita kwota: {totalCost}</p>
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
                        {/* {_renderSearchContent()} */}
                        <SearchContent handleSearchRequest={handleSearchRequest} />
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