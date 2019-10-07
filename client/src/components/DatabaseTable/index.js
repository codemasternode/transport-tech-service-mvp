import React from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, CircularProgress, FormHelperText, Checkbox, Link, Grid, Typography, Container, Paper } from '@material-ui/core';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import DatabaseElement from './DatabaseElement'
import './index.scss'
import { withRouter } from "react-router-dom";
import axios from 'axios';

Geocode.setApiKey("AIzaSyCbxWM2sqqiQoxXyR1maA_9dzro72-vKOw");
Geocode.enableDebug();


export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            waitForRes: false
        };
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        console.log(this.props)
    }

    onClick(t, map, coord) {
        console.log(coord)
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        Geocode.fromLatLng(lat, lng).then(
            response => {
                const addressFull = response.results[0].formatted_address;
                let address = addressFull.split(",")[1]
                let streetName = addressFull.split(",")[0]
                let country = addressFull.split(",")[2]
                this.setState(previousState => {
                    console.log(previousState)
                    return {
                        ...this.state,
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
        this.setState({ ...this.state, markers })
    }

    isRenderList() {
        // const [markers] = this.state
        if (this.props.data.bases.length === 0) {
            return <h5>Nie wybrałeś żadnej bazy firmy</h5>
        } else {
            return (
                this.props.data.bases.map((item, key) => (
                    <DatabaseElement data={item} key={key} id={key} handleRemoveOrder={this.props.handleRemoveBase} length={this.props.data.bases.length} />
                ))
            )
        }
    }

    nextStep = () => {
        this.setState({ ...this.state, waitForRes: true, })
        // axios.post('/api/newEmployee', { data: this.state.data }).then((response) => {
        //     this.setState({ ...this.state, waitForRes: false, })
        // }, (err) => {
        //     console.log(err)
        // })

        this.props.history.push('/vehicle-dashboard')

    }

    render() {

        return (
            <div className="root" >
                <div className="overlay" style={this.state.waitForRes ? { display: 'block' } : { display: 'none' }}>
                    <div className="overlay__inner">
                        <div className="overlay__inner__progress">
                            <CircularProgress className="overlay__inner__progress" />
                        </div>
                    </div>
                </div>
                <Grid container justify="center"
                    direction="column"
                    alignItems="center">
                    <Grid item xs={12} style={{ width: 'inherit', display: 'flex', justifyContent: 'center' }}>
                        <Grid xs={11} container={true} className="container">
                            <Grid item xs={12} sm={5} className="container__database">
                                <div className="container__database__list">
                                    {this.isRenderList()}
                                    {/* <Autocomplete
                                style={{ width: '90%' }}
                                onPlaceSelected={(place) => {
                                    console.log(place.geometry);
                                }}
                                types={['(regions)']}
                                componentRestrictions={{ country: "pl" }}
                            /> */}
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={7} className="container__map">

                                <Map className="container__map__inner" style={{ maxHeight: '500px' }} google={this.props.google} zoom={14} initialCenter={{
                                    lat: 50.049683,
                                    lng: 19.944544
                                }}
                                    onClick={this.props.clickOnMap}>

                                    {this.props.data.bases.map((marker, index) => (
                                        <Marker
                                            key={index}
                                            title={marker.title}
                                            name={marker.name}
                                            position={marker.position}

                                        />

                                    ))}
                                    {/* <InfoWindow
                                position={{
                                    lat: 50.049683,
                                    lng: 19.944544
                                }}>
                                <div>
                                    <h1>XD</h1>
                                </div>
                            </InfoWindow> */}
                                    {/* </div>  */}
                                </Map>
                            </Grid>
                        </Grid>

                    </Grid>

                    <Grid item xs={12} style={{ width: '91.99%', height: 'auto' }}>
                        <div style={{ margin: '10px 0', width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flexDirection: "column" }}>
                            Bazy: {this.props.data.bases.length}
                            <Button style={{ backgroundColor: '#ff9900', width: '50px' }} variant="contained" onClick={this.nextStep}>
                                Dalej
                            </Button>
                            <p style={{ height: '16px' }}>{this.props.data.mapError}</p>
                        </div>
                    </Grid>
                </Grid>

            </div >

        );
    }
}
//AIzaSyBZssu9GKb1kEysTsAEJs2zX9L6wlhf88c
export default withRouter(GoogleApiWrapper({
    apiKey: ("AIzaSyDwQl8QdFAuyJF3KGe1wcju_Ozl1_lVDuY")
})(MapContainer))