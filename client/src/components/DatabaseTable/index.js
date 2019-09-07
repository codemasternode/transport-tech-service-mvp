import React from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper } from '@material-ui/core';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import Geocode from "react-geocode";
import DatabaseElement from './DatabaseElement'
import './index.scss'

Geocode.setApiKey("AIzaSyCbxWM2sqqiQoxXyR1maA_9dzro72-vKOw");
Geocode.enableDebug();


export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: []
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(t, map, coord) {
        console.log(coord)
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        var title = "";
        Geocode.fromLatLng(lat, lng).then(
            response => {
                const addressFull = response.results[0].formatted_address;
                console.log(addressFull.split(","));
                let address = addressFull.split(",")[1]
                let streetName = addressFull.split(",")[0]
                let country = addressFull.split(",")[2]
                this.setState(previousState => {
                    console.log(previousState)
                    return {
                        markers: [
                            ...previousState.markers,
                            {
                                title: addressFull,
                                streetName: streetName,
                                country: country,
                                address: address,
                                position: { lat, lng }
                            }
                        ]
                    };
                });

            },
            error => {
                console.error(error);
            }
        );
        console.log(this.state)
    }

    handleRemoveOrder = (id) => {
        let markers = this.state.markers.filter((item, key) => {
            console.log(id, key)
            if (id !== key) { return item }
        })
        this.setState({ markers })
    }

    _isNull() {
        if (this.state.markers.length === 0) {
            return <h5>Nie wybrałeś żadnej bazy firmy</h5>
        } else {
            return null
        }
    }

    render() {

        return (
            <div className="root">
                <Grid container spacing={3} className="container">
                    <Grid item xs={12} sm={5} className="container__database">
                        <Paper >
                            {this._isNull()}
                            {
                                this.state.markers.map((item, key) => (
                                    <DatabaseElement data={item} id={key} handleRemoveOrder={this.handleRemoveOrder} />
                                ))
                            }
                        </Paper>


                    </Grid>
                    <Grid item xs={12} sm={7} className="container__map">
                        <Map google={this.props.google} zoom={14} initialCenter={{
                            lat: 50.049683,
                            lng: 19.944544
                        }}
                            onClick={this.onClick}>

                            {this.state.markers.map((marker, index) => (
                                <Marker
                                    key={index}
                                    title={marker.title}
                                    name={marker.name}
                                    position={marker.position}
                                />
                            ))}

                        </Map>
                    </Grid>
                </Grid>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyBZssu9GKb1kEysTsAEJs2zX9L6wlhf88c")
})(MapContainer)