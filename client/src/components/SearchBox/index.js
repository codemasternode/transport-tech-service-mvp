import React, { Component } from 'react';
import Geocode from "react-geocode";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Map from './Map';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
import Sidebar from './Sidebar';
import './index.scss'
import actions from '../../reducers/companies/duck/actions';
import { API_URL } from '../../utils/urls'

const googleMapsApiKey = "AIzaSyDgO5BkgVU-0CXP104-6qKWUEPTT4emUZM";

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenSidebar: {
                openLeft: window.screen.width > 678 ? true : false,
                openRight: window.screen.width > 678 ? true : false,
            },
            openDialog: false,
            selectedPlaces: [
                // { lat: 50.049683, lng: 19.944544 },
                // { lat: 50.049683, lng: 19 },
                // { lat: 50.049683, lng: 19.222233 }
            ],
            criteriaToSearch: {
                criteria: {
                    weight: 2000,
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
            },
            resultSearchedData: [],
            isVisible: false,
            isLoading: false,
        }
    }

    // componentDidCatch(err){

    // }

    componentDidMount() {
        // console.log(this.props)
    }

    _handleOpenSidebar = name => {
        const { isOpenSidebar } = this.state;
        isOpenSidebar[name] = !isOpenSidebar[name]
        this.setState({
            isOpenSidebar
        })
    }

    _handleOnMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        this.setState(previousState => {
            return {
                ...this.state,
                selectedPlaces: [
                    ...previousState.selectedPlaces,
                    { lat, lng }
                ]
            };
        });
    }

    _handleClickOnDialog = (value) => {
        this.setState({
            ...this.state,
            openDialog: value
        })
    }

    _handleSearchRequest = (dataForRequest) => {
        const { selectedPlaces } = this.state

        // typeOfSearch
        const data = {
            ...dataForRequest,
            points: selectedPlaces
        }
        this.props.getSearchedCriteria(data)

        if (selectedPlaces.length > 1) {
            this.setState({
                ...this.state,
                isVisible: true,
                isLoading: true,
            })
            axios.post(`${API_URL}/api/distance`, data).then((response) => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    resultSearchedData: response.data.companies || [],
                })
                this.props.getAllCompanies(response.data.companies)
            }, (err) => {
                console.log("Axios error: " + err)
            })
        } else {
            this._handleClickOnDialog(true)
        }
    }

    _sendData = () => {
        const { selectedPlaces } = this.state

        const { dataForRequest } = this.props
        // console.log(this.props)
        console.log(dataForRequest)
        const data = {
            ...dataForRequest,
            points: selectedPlaces
        }
        console.log(data)
        this.props.getSearchedCriteria(data)
        if (selectedPlaces.length <= 1 || Object.entries(dataForRequest).length === 0 && dataForRequest.constructor === Object) {
            this._handleClickOnDialog(true)
        } else {
            this.setState({
                ...this.state,
                isVisible: true,
                isLoading: true,
            })
            axios.post(`${API_URL}/api/distance`, data).then((response) => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    isOpenSidebar: {
                        ...this.state.isOpenSidebar,
                        openRight: true
                    },
                    resultSearchedData: response.data.companies || [],
                })
                this.props.getAllCompanies(response.data.companies)

            }, (err) => {
                console.log("Axios error: " + err)
            })
        }
    }

    _renderMap = () => {
        const {
            loadingElement,
            containerElement,
            mapElement,
            defaultCenter,
            defaultZoom
        } = this.props;
        const { selectedPlaces } = this.state;

        return (
            <Map
                googleMapURL={
                    'https://maps.googleapis.com/maps/api/js?key=' +
                    googleMapsApiKey +
                    '&libraries=geometry,drawing,places'
                }
                onMapClick={this._handleOnMapClick}
                markers={selectedPlaces}
                loadingElement={loadingElement || <div style={{ height: `100%` }} />}
                containerElement={containerElement || <div style={{ height: "100vh" }} />}
                mapElement={mapElement || <div style={{ height: `100%` }} />}
                defaultCenter={defaultCenter || { lat: 50.049683, lng: 19.944544 }}
                defaultZoom={defaultZoom || 11}
            />
        )
    }

    _renderAlertModal = () => {
        const { openDialog } = this.state;

        return (
            <div>
                <Dialog
                    open={openDialog}
                    onClose={() => this._handleClickOnDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Proszę podać punkty"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            W celu wyszukania firmy, proszę wyznaczyć punkty na mapie oraz uzupełnić wszystkie pola w formularzu.
          </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this._handleClickOnDialog(false)} color="primary">
                            Anuluj
                        </Button>
                        <Button onClick={() => this._handleClickOnDialog(false)} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    _renderCustomButton = () => {
        const { isOpenSidebar } = this.state;
        if (isOpenSidebar["openRight"]) {
            return (
                <button className="search__btn_move" onClick={() => this._handleOpenSidebar("openRight")}>
                    <h2 className="search__btn_title">Ukryj wyniki</h2>
                </button>
            )
        }
        return (
            <button className="search__btn_move" onClick={() => this._handleOpenSidebar("openLeft")}>
                <h2 className="search__btn_title">{isOpenSidebar["openLeft"] ? "Ukryj formularz" : "Wysuń formularz"}</h2>
            </button>
        )
    }

    render() {
        const { selectedPlaces, isOpenSidebar, criteriaToSearch, resultSearchedData, isVisible, isLoading } = this.state;
        return (
            <div className="search">
                {this._renderAlertModal()}
                {this._renderCustomButton()}
                <Sidebar
                    handleOpenSidebar={this._handleOpenSidebar}
                    isOpenSidebar={isOpenSidebar}
                    nameOfSidebar="openLeft"
                    selectedPoints={selectedPlaces}
                    criteriaToSearch={criteriaToSearch}
                    handleSearchRequest={this._handleSearchRequest}
                    resultSearchedData={resultSearchedData}
                    isVisible={isVisible}
                    isLoading={isLoading} />
                {this._renderMap()}
                <Sidebar
                    handleOpenSidebar={this._handleOpenSidebar}
                    isOpenSidebar={isOpenSidebar}
                    nameOfSidebar="openRight"
                    criteriaToSearch={criteriaToSearch}
                    resultSearchedData={resultSearchedData}
                    isVisible={isVisible}
                    isLoading={isLoading} />
                <button className="search__btn_search">
                    <h2 onClick={this._sendData}>Szukaj</h2>
                </button>
                <button className="search__btn_results" onClick={() => this._handleOpenSidebar("openRight")}>
                    <h2 className="search__btn_title">Pokaż wyniki</h2>
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { chosenCompany, allFetchedCompanies, searchedCriterial, dataForRequest } = state.companies
    return ({
        searchedCriterial,
        chosenCompany,
        allFetchedCompanies,
        dataForRequest
    })
}

const mapDispatchToProps = dispatch => ({
    getSearchedCriteria: criteria => dispatch(actions.addCriteria(criteria)),
    selectCompany: company => dispatch(actions.add(company)),
    getAllCompanies: company => dispatch(actions.addAll(company)),
    getRequestData: data => dispatch(actions.addRequestData(data))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBox));
