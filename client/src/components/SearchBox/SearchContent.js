import React, { useEffect } from 'react';
import { Button, Select, Grid, MenuItem } from '@material-ui/core';
import labelsOfSearchInputs from '../../constants/dataOfTransports'
import typesOfPallets from '../../constants/typesOfPallets'
import Geocode from "react-geocode";
import styled from 'styled-components'
import 'react-virtualized/styles.css'; // only needs to be imported once
import NumericInput from 'react-numeric-input';
import { useDispatch } from 'react-redux';
import actions from '../../reducers/companies/duck/actions';
import PropTypes from 'prop-types';

const StyledDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1em;
    box-sizing: border-box;
`;

const SearchBlock = styled.div`
    width: '100%';
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: auto;
    font-size: 1.3em;
`

const StyledList = styled.ul`
    list-style: none;
    width: 100%;
    padding:0;
    box-sizing: border-box;
`
const StyledItem = styled.li`
    width: 100%;
    box-sizing: border-box;
    padding: 0 1em;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const StyledDimensionsTitle = styled.h5`
    margin: 0;
    font-size: 1.2em;
`

const SearchContent = ({ handleSearchRequest, deviceWidth }) => {
    const [state, setState] = React.useState({
        criteria: {
            length: 2,
            width: 2,
            height: 2,
            weight: 1000,
        },
        selectedOperation: "Palette",
        selectedPallets: "EUR-EPAL",
        numberOfPallets: 1,
        totalWeightOfPallets: 1400,
        heightOfPallets: 0.144,
        selectToSearching: [
            { name: "Palette", label: "Palety" },
            { name: "Dimensions", label: "Wymiary" }
        ],



    })
    const dispatch = useDispatch();
    const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
    // handle change of select value

    useEffect(() => {
        if (deviceWidth <= 678) {
            _handleSendData()
        }
    }, [state])


    const _handleChangeSelectValue = (e, type) => {
        let { selectedOperation, selectedPallets } = state;
        const { value } = e.target;
        if (type === "selectedOperation") {
            selectedOperation = value;
        } else {
            selectedPallets = value
        }

        setState({
            ...state,
            selectedOperation,
            selectedPallets,
        })
        // _handleSendData()
    }

    const _handleChangeDimensionsOfPallets = e => {
        const { value, name } = e.target;
        setState({
            ...state,
            [name]: (value)
        })
    }

    const _handleChangeDimensions = e => {
        const { value, name } = e.target;
        const { criteria } = state;
        criteria[name] = value
        setState({
            ...state,
            criteria
        })
    }

    const _handleSendData = () => {
        const { selectedOperation, selectedPallets, numberOfPallets, totalWeightOfPallets, heightOfPallets, criteria } = state;
        let dataForRequest = {}
        if (selectedOperation === "Palette") {
            dataForRequest = {
                numberOfPallets: parseInt(numberOfPallets),
                weight: parseFloat(totalWeightOfPallets / 1000),
                height: _validNumber(heightOfPallets),
                typeOfSearch: selectedOperation,
                typeOfPallet: selectedPallets
            }

        } else {
            let { length, weight, height, width } = criteria;
            length = _validNumber(length)
            weight = _validNumber(weight)
            height = _validNumber(height)
            width = _validNumber(width)
            dataForRequest["length"] = parseFloat(length)
            dataForRequest["height"] = parseFloat(height)
            dataForRequest["width"] = parseFloat(width)
            dataForRequest["volume"] = parseFloat(length * height * width)
            dataForRequest["weight"] = parseFloat(weight / 1000)
            dataForRequest["typeOfSearch"] = selectedOperation
            dispatch(actions.addDimCriteria(dataForRequest))
        }
        // if (deviceWidth > 678) {
        //     handleSearchRequest(dataForRequest)
        // }
        dispatch(actions.addRequestData(dataForRequest))
    }

    /// render select to choose option of searching

    const _renderSelectOfTypesSearching = () => {
        // typesOfPallets
        const { selectToSearching, selectedOperation } = state;
        return (
            <StyledDiv>
                <h4 style={{ fontSize: '1.1em' }}>Wybierz sposób szukania:</h4>
                <Select
                    id="selectedOperation"
                    value={selectedOperation}
                    onChange={e => _handleChangeSelectValue(e, "selectedOperation")}
                >
                    {selectToSearching.map((option, key) => {
                        return (
                            <MenuItem value={option.name} key={key}>
                                {option.label}
                            </MenuItem>
                        )
                    })}
                </Select>
            </StyledDiv>
        )
    }


    const _renderSearchForms = () => {
        // choice of render two forms
        const { selectedOperation } = state;
        switch (selectedOperation) {
            case "Palette":
                return _renderPalletSelect();
            case "Dimensions":
                return _renderInputs();
            default:
                return _renderPalletSelect();
        }
    }

    const _renderInputs = () => {
        //render inputs of criteria
        const { criteria: { length,
            width,
            height,
            weight } } = state;

        return (
            // labelsOfSearchInputs.map((item, key) => (
            <React.Fragment>
                <div className="text__field__form">
                    <label className="text__field__label">Waga (kg)</label>
                    <input type="text" className="text__field__input" name="weight" value={weight} onChange={e => _handleChangeDimensions(e)} />
                </div>
                <div className="text__field__form">
                    <label className="text__field__label">Długość (m)</label>
                    <input type="text" className="text__field__input" name="length" value={length} onChange={e => _handleChangeDimensions(e)} />
                </div>
                <div className="text__field__form">
                    <label className="text__field__label">Szerokość (m)</label>
                    <input type="text" className="text__field__input" name="width" value={width} onChange={e => _handleChangeDimensions(e)} />
                </div>
                <div className="text__field__form">
                    <label className="text__field__label">Wysokość (m)</label>
                    <input type="text" className="text__field__input" name="height" value={height} onChange={e => _handleChangeDimensions(e)} />
                </div>
            </React.Fragment>
            // ))
        )
    }

    const _renderPalletSelect = () => {
        // typesOfPallets
        const { selectedPallets, numberOfPallets, totalWeightOfPallets, heightOfPallets } = state;
        return (
            <React.Fragment>
                <StyledDiv>
                    <h4 style={{ fontSize: '1.1em' }}>Wybrano paletę typu:</h4>
                    <Select
                        id="selectedPallets"
                        value={selectedPallets}
                        onChange={e => _handleChangeSelectValue(e)}
                    >
                        {typesOfPallets.map((option, key) => {
                            const { name } = option
                            return (
                                <MenuItem value={name} key={key}>
                                    {name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </StyledDiv>
                <StyledDiv>
                    <div className="text__field__form" style={{ padding: 0 }}>
                        <label className="text__field__label"><StyledDimensionsTitle>Ilość palet:</StyledDimensionsTitle> </label>
                        <input value={numberOfPallets} name="numberOfPallets" type="text" className="text__field__input" onChange={e => _handleChangeDimensionsOfPallets(e)} />
                    </div>
                </StyledDiv>
                <StyledDiv>
                    <div className="text__field__form" style={{ padding: 0 }}>
                        <label className="text__field__label"><StyledDimensionsTitle>Całkowita waga (kg):</StyledDimensionsTitle> </label>
                        <input value={totalWeightOfPallets} name="totalWeightOfPallets" type="text" step="0.1" className="text__field__input" onChange={e => _handleChangeDimensionsOfPallets(e)} />
                    </div>
                </StyledDiv>
                <StyledDiv>
                    <div className="text__field__form" style={{ padding: 0 }}>
                        <label className="text__field__label"><StyledDimensionsTitle>Wysokość ładunku (m):</StyledDimensionsTitle> </label>
                        <input value={heightOfPallets} name="heightOfPallets" type="text" className="text__field__input" onChange={e => _handleChangeDimensionsOfPallets(e)} />
                    </div>
                </StyledDiv>
            </React.Fragment>
        )
    }

    const _renderlistOfPalletsDimensions = () => {
        let { selectedOperation, selectedPallets } = state;

        const listOfDimensions = typesOfPallets.map((option, key) => {
            const { name,
                length,
                width,
                height,
                totalWeight
            } = option
            if (name === selectedPallets && selectedOperation === "Palette") {
                return (
                    <React.Fragment key={key}>
                        <StyledItem key={0}>Długość palety: <StyledDimensionsTitle>{length} (m)</StyledDimensionsTitle></StyledItem>
                        <StyledItem key={1}>Szerokość palety: <StyledDimensionsTitle>{width} (m)</StyledDimensionsTitle></StyledItem>
                        <StyledItem key={2}>Wysokość palety: <StyledDimensionsTitle>{height} (m)</StyledDimensionsTitle></StyledItem>
                        <StyledItem key={3}>Całkowita waga palety: <StyledDimensionsTitle>{totalWeight} (kg)</StyledDimensionsTitle></StyledItem>
                    </React.Fragment>
                )
            }
        })
        return listOfDimensions;
    }

    const _validNumber = value => {
        let str = value.toString();
        console.log(value)
        if (str.includes(",")) {
            str = str.replace(",", ".")
            return parseFloat(str)
        } else {
            return parseFloat(value);
        }
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

    const _renderSearchContent = () => {

        // search content of left sidebar
        return (
            <Grid container={true} direction="column" alignItems="center">
                <Grid item xs={12} style={{ width: '100%' }}>
                    <SearchBlock>
                        <h4>Kryteria</h4>
                    </SearchBlock>
                </Grid>
                {_renderSelectOfTypesSearching()}
                {_renderSearchForms()}
                <StyledList>
                    {_renderlistOfPalletsDimensions()}
                </StyledList>
                {/* <Button onClick={() => {
                    _handleSendData()
                }}>{deviceWidth > 678 ? "Szukaj" : "Gotowe"}</Button> */}
                {deviceWidth <= 678 ? "" : <Button onClick={() => {
                    let { selectedOperation, selectedPallets, numberOfPallets, totalWeightOfPallets, heightOfPallets, criteria } = state;
                    let dataForRequest = {}
                    if (selectedOperation === "Palette") {
                        dataForRequest = {
                            numberOfPallets: parseInt(numberOfPallets),
                            weight: parseFloat(totalWeightOfPallets / 1000),
                            height: _validNumber(heightOfPallets),
                            typeOfSearch: selectedOperation,
                            typeOfPallet: selectedPallets
                        }

                    } else {
                        let { length, weight, height, width } = criteria;
                        length = _validNumber(length)
                        weight = _validNumber(weight)
                        height = _validNumber(height)
                        width = _validNumber(width)
                        dataForRequest["length"] = parseFloat(length)
                        dataForRequest["height"] = parseFloat(height)
                        dataForRequest["width"] = parseFloat(width)
                        dataForRequest["volume"] = parseFloat(length * height * width)
                        dataForRequest["weight"] = parseFloat(weight / 1000)
                        dataForRequest["typeOfSearch"] = selectedOperation
                        dispatch(actions.addDimCriteria(dataForRequest))
                    }
                    handleSearchRequest(dataForRequest)
                }}>Szukaj</Button>}
            </Grid>

        )
    }

    return _renderSearchContent();
}

export default SearchContent;

SearchContent.defaultProps = {
    handleSearchRequest: () => {
        console.warn("Props handleSearchRequest doesn't work")
    }
};

SearchContent.propTypes = {
    handleSearchRequest: PropTypes.func
}