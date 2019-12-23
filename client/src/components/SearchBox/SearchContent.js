import React from 'react';
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
    background-color: #cccccc;
    text-align: center;
    height: 50px;
    margin: auto;
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
`

const SearchContent = ({ handleSearchRequest }) => {
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
            // totalWeightOfPallets,
            // heightOfPallets
        })
    }

    const _handelChangeDimensionsOfPallets = e => {
        const { value, name } = e.target;

        setState({
            ...state,
            [name]: (value)
        })
    }

    const _handelChangeDimensions = e => {
        const { value, name } = e.target;
        const { criteria } = state;
        criteria[name] = value
        console.log(value)
        setState({
            ...state,
            criteria
        })


    }

    /// render select to choose option of searching

    const _renderSelectOfTypesSearching = () => {
        // typesOfPallets
        const { selectToSearching, selectedOperation } = state;
        return (
            <StyledDiv>
                <h4>Wybierz sposób szukania:</h4>
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
                    <input type="text" className="text__field__input" name="weight" value={weight} onChange={e => _handelChangeDimensions(e)} />
                </div>
                <div className="text__field__form">
                    <label className="text__field__label">Długość (m)</label>
                    <input type="text" className="text__field__input" name="length" value={length} onChange={e => _handelChangeDimensions(e)} />
                </div>
                <div className="text__field__form">
                    <label className="text__field__label">Szerokość (m)</label>
                    <input type="text" className="text__field__input" name="width" value={width} onChange={e => _handelChangeDimensions(e)} />
                </div>
                <div className="text__field__form">
                    <label className="text__field__label">Wysokość (m)</label>
                    <input type="text" className="text__field__input" name="height" value={height} onChange={e => _handelChangeDimensions(e)} />
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
                    <h4>Wybrano paletę typu:</h4>
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
                        <input value={numberOfPallets} name="numberOfPallets" type="text" className="text__field__input" onChange={e => _handelChangeDimensionsOfPallets(e)} />
                    </div>
                </StyledDiv>
                <StyledDiv>
                    <div className="text__field__form" style={{ padding: 0 }}>
                        <label className="text__field__label"><StyledDimensionsTitle>Całkowita waga:</StyledDimensionsTitle> </label>
                        <input value={totalWeightOfPallets} name="totalWeightOfPallets" type="text" step="0.1" className="text__field__input" onChange={e => _handelChangeDimensionsOfPallets(e)} />
                    </div>
                </StyledDiv>
                <StyledDiv>
                    <div className="text__field__form" style={{ padding: 0 }}>
                        <label className="text__field__label"><StyledDimensionsTitle>Wysokość:</StyledDimensionsTitle> </label>
                        <input value={heightOfPallets} name="heightOfPallets" type="text" className="text__field__input" onChange={e => _handelChangeDimensionsOfPallets(e)} />
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
        const { selectedOperation, selectedPallets, numberOfPallets, totalWeightOfPallets, heightOfPallets, criteria } = state;
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
                <Button onClick={() => {
                    let dataForRequest = {}
                    if (selectedOperation === "Palette") {
                        dataForRequest = {
                            numberOfPallets: parseInt(numberOfPallets),
                            weight: parseFloat(totalWeightOfPallets / 1000),
                            height: parseFloat(heightOfPallets),
                            typeOfSearch: selectedOperation,
                            typeOfPallet: selectedPallets
                        }

                    } else {
                        const { length, weight, height, width } = criteria;
                        dataForRequest["length"] = parseFloat(length)
                        dataForRequest["height"] = parseFloat(height)
                        dataForRequest["width"] = parseFloat(width)
                        dataForRequest["volume"] = parseFloat(length * height * width)
                        dataForRequest["weight"] = parseFloat(weight / 1000)
                        dataForRequest["typeOfSearch"] = selectedOperation
                        dispatch(actions.addDimCriteria(dataForRequest))
                    }
                    handleSearchRequest(dataForRequest)
                }}>Szukaj</Button>

                <Grid item xs={12} style={{ width: '100%' }}>
                    
                    {/* <ul>
                        {_renderSelectedPoints()}
                    </ul> */}
                </Grid>
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