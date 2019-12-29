import React, { useEffect } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { withRouter } from "react-router-dom";
import Geocode from "react-geocode";
import axios from "axios";
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../reducers/companies/duck/actions';
import PropTypes from 'prop-types';
import SearchContent from './SearchContent';

Geocode.setApiKey("AIzaSyDgO5BkgVU-0CXP104-6qKWUEPTT4emUZM");
Geocode.enableDebug();

axios.defaults.withCredentials = true

const Sidebar = ({ handleOpenSidebar, isOpenSidebar, nameOfSidebar, handleSearchRequest, resultSearchedData, isVisible, isLoading, ...props }) => {
    const _validNameOfSidebar = nameOfSidebar === "openLeft" ? true : false;
    const _correctClassNameOfSidebar = _validNameOfSidebar ? "sidebar sidebar__left" : "sidebar sidebar__right";
    const _correctClassNameOfClickSidebar = _validNameOfSidebar ? "sidebar__left__click" : "sidebar__right__click";

    const [state, setState] = React.useState({
        width: 0,
        height: 0,
        styleOfSidebar: {},
        isOpen: isOpenSidebar,
        classNamesOfSidebar: ""
    })

    const lastProps = React.useRef({
        isOpenSidebar
    });
    // console.log(lastProps.current.isOpenSidebar)
    // console.log(state.isOpen)
    useEffect(() => {
        _updateWindowDimensions()
    })

    const styleOfRow = {
        margin: 5,
    }

    // get all companies from redux
    const { allFetchedCompanies } = useSelector(state => state.companies)
    const dispatch = useDispatch();

    const _handleSelectCompany = key => {
        const selectedCompany = allFetchedCompanies[key]
        dispatch(actions.add(selectedCompany))
        props.history.push('/mail')
    }

    const _updateWindowDimensions = () => {
        let { styleOfSidebar } = state;
        // console.log(isOpenSidebar)

        if (window.innerWidth > 768) {
            styleOfSidebar = _validNameOfSidebar ? (isOpenSidebar[nameOfSidebar] ? { left: 0 } : { left: "-300px" }) : isOpenSidebar[nameOfSidebar] ? { right: 0 } : { right: "-300px" }
        } else {
            styleOfSidebar = _validNameOfSidebar ? (isOpenSidebar[nameOfSidebar] ? { display: "flex" } : { display: "none" }) : isOpenSidebar[nameOfSidebar] ? { display: "flex" } : { display: "none" }
        }
        // if( window.innerWidth <= 768 && isOpen){

        // }

        setState({ ...state, width: window.innerWidth, height: window.innerHeight, styleOfSidebar });

        // console.log(window.innerWidth)
    }

    const _rowRenderer = ({
        key,         // Unique key within array of rows
        index,       // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible,   // This row is visible within the List (eg it is not an overscanned row)
        style        // Style object to be applied to row (to position it)
    }) => {

        const { vehicles, logo } = allFetchedCompanies[index]
        let totalCost = 0;
        console.log(vehicles)
        for (const vehicle of vehicles) {
            const { fullCost } = vehicle || 0
            totalCost += fullCost
        }

        console.log(allFetchedCompanies, 91)
        // console.log(totalCost)
        return (
            <div
                key={key}
                style={{ ...style }}
            >
                <h4 style={styleOfRow}>{allFetchedCompanies[index].nameOfCompany}</h4>
                <img src={`http://dq1dsixf6z9ds.cloudfront.net/company_logos/${logo}`} alt="company" width="150" height="auto" />
                <p style={styleOfRow}>Ilość pojazdów: {vehicles.length}</p>
                <p style={styleOfRow}>Całkowita kwota: {totalCost.toFixed(3)}</p>
                <Button onClick={() => _handleSelectCompany(index)}>Skontaktuj się</Button>
            </div>
        )
    }


    const _renderResultContent = () => {
        if (isLoading) {
            return (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </div>
            )
        } else {
            if (allFetchedCompanies.length > 0) {
                console.log(allFetchedCompanies)
                return (
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={allFetchedCompanies.length}
                                rowHeight={350}
                                rowRenderer={_rowRenderer}
                            />
                        )}
                    </AutoSizer>
                )
            } else {
                return null
            }
        }
    }

    const _isRenderSidebar = () => {
        if (_validNameOfSidebar) {
            return (
                <div className="sidebar__left__requirements">
                    <SearchContent handleSearchRequest={handleSearchRequest} />
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

    const { styleOfSidebar } = state;

    return (
        <div className={_correctClassNameOfSidebar} style={styleOfSidebar} >
            <span className={_correctClassNameOfClickSidebar} onClick={() => {
                handleOpenSidebar(nameOfSidebar)
            }}></span>
            {_isRenderSidebar()}
        </div>
    )
}

export default withRouter(Sidebar);

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