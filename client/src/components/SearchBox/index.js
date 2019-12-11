import React, { Component } from 'react';
import Geocode from "react-geocode";
import Map from './Map';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
import Sidebar from './Sidebar';
import './index.scss'
import actions from '../../reducers/companies/duck/actions';

const googleMapsApiKey = "AIzaSyDgO5BkgVU-0CXP104-6qKWUEPTT4emUZM";

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenSidebar: {
                openLeft: true,
                openRight: true,
            },
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
            isVisible: false

        }
    }

    // componentDidCatch(err){

    // }

    componentDidMount() {
        console.log(this.props)
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

    _handleSearchRequest = (dataForRequest) => {
        const { selectedPlaces } = this.state

        // typeOfSearch
        const data = {
            ...dataForRequest,
            points: selectedPlaces
        }
        // console.log(data)
        this.props.getSearchedCriteria(data)

        this.setState({
            ...this.state,
            isVisible: true
        })

        // console.log(this.props)

        const dane = {
            "points": [
                {
                    "lat": 50.038012,
                    "lng": 20.031036
                },
                {
                    "lat": 52.237094,
                    "lng": 18.252975
                }
            ],
            "numberOfPallets": 30,
            "typeOfPallet": "EUR-3",
            "height": 2,
            "typeOfSearch": "Palette",
            "weight": 2
        }

        console.log(dane, data)

        // this.props.selectCompany(data)
        axios.post('http://localhost:5000/api/distance', data).then((response) => {
            console.log(response)
            this.setState({
                ...this.state,
                resultSearchedData: response.data.companies || [],
            })
            this.props.getAllCompanies(response.data.companies || [])

        }, (err) => {
            console.log("Axios error: " + err)
        })
        // this.props.history.push('/mail')

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
                fullscreenControl={false}
                streetViewControl={false}
                disableDefaultUI={true}
                loadingElement={loadingElement || <div style={{ height: `100%` }} />}
                containerElement={containerElement || <div style={{ height: "100vh" }} />}
                mapElement={mapElement || <div style={{ height: `100%` }} />}
                defaultCenter={defaultCenter || { lat: 50.049683, lng: 19.944544 }}
                defaultZoom={defaultZoom || 11}
                defaultStreetView={false}
                defaultOptions={{ mapTypeControl: false }}

            />
        )
    }

    render() {
        const { selectedPlaces, isOpenSidebar, criteriaToSearch, resultSearchedData, isVisible } = this.state;
        return (
            <div className="search">
                <Sidebar
                    handleOpenSidebar={this._handleOpenSidebar}
                    isOpenSidebar={isOpenSidebar}
                    nameOfSidebar="openLeft"
                    selectedPoints={selectedPlaces}
                    criteriaToSearch={criteriaToSearch}
                    handleSearchRequest={this._handleSearchRequest}
                    resultSearchedData={resultSearchedData}
                    isVisible={isVisible} />
                {this._renderMap()}
                <Sidebar
                    handleOpenSidebar={this._handleOpenSidebar}
                    isOpenSidebar={isOpenSidebar}
                    nameOfSidebar="openRight"
                    criteriaToSearch={criteriaToSearch}
                    resultSearchedData={resultSearchedData}
                    isVisible={isVisible} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { chosenCompany, allFetchedCompanies, searchedCriterial } = state.companies
    return ({
        searchedCriterial,
        chosenCompany,
        allFetchedCompanies,
    })
}

const mapDispatchToProps = dispatch => ({
    getSearchedCriteria: criteria => dispatch(actions.addCriteria(criteria)),
    selectCompany: company => dispatch(actions.add(company)),
    getAllCompanies: company => dispatch(actions.addAll(company))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBox));