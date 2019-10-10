import React, { Component } from 'react';
import Geocode from "react-geocode";
import Map from './Map';
import { withRouter } from "react-router-dom";
import axios from "axios";
import Sidebar from './Sidebar';
import './index.scss'

const googleMapsApiKey = "AIzaSyDwQl8QdFAuyJF3KGe1wcju_Ozl1_lVDuY";

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenSidebar: {
                openLeft: true,
                openRight: true,
            },
            selectedPlaces: [
                { latitude: 50.049683, longitude: 19.944544 },
                // { latitude: 50.049683, longitude: 19 },
                // { latitude: 50.049683, longitude: 19.222233 }
            ],
            criteriaToSearch: {
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
            },
            resultSearchedData: [],
            isVisible: false

        }
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
                    { latitude: lat, longitude: lng }
                ]
            };
        });
    }

    _handleSearchRequest = () => {
        const { criteria, isDimensionsRequired, distanceToDrive, points, operation } = this.state.criteriaToSearch
        const data = {
            criteria,
            isDimensionsRequired,
            distanceToDrive,
            points,
            operation
        }
        this.setState({
            ...this.state,
            isVisible: true
        })
        axios.post('http://localhost:5000/api/distance', { ...data }).then((response) => {
            console.log(response.data.offers)
            this.setState({
                ...this.state,
                resultSearchedData: response.data.offers,
            })

        }, (err) => {
            console.log("Axios error: " + err)
        })

        // this.setState({
        //     ...this.state,
        //     resultSearchedData: [{ company: "ELO" }]
        // })
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



export default SearchBox;