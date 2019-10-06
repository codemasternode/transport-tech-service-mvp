import React, { Component } from 'react';
import Geocode from "react-geocode";
import Map from './Map';
import { withRouter } from "react-router-dom";
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
            ]
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

    render() {
        const {
            loadingElement,
            containerElement,
            mapElement,
            defaultCenter,
            defaultZoom
        } = this.props;

        const { selectedPlaces, isOpenSidebar } = this.state;
        return (
            <div className="search">
                <Sidebar handleOpenSidebar={this._handleOpenSidebar} isOpenSidebar={isOpenSidebar} nameOfSidebar="openLeft" selectedPoints={selectedPlaces} />
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
                <Sidebar handleOpenSidebar={this._handleOpenSidebar} isOpenSidebar={isOpenSidebar} nameOfSidebar="openRight" />
            </div>
        );
    }
}



export default SearchBox;