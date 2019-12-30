/* global google */
import React, { useEffect } from "react";
import {
    withGoogleMap,
    GoogleMap,
    withScriptjs,
    Marker,
    DirectionsRenderer
} from "react-google-maps";

const MapDirectionsRenderer = (props) => {
    const [state, setState] = React.useState({
        directions: null,
        error: null
    })

    useEffect(() => {
        const { places, travelMode } = props;
        if (places.length > 1) {
            const waypoints = places.map(p => ({
                location: { lat: p.lat, lng: p.lng },
                stopover: true
            }))

            const origin = waypoints[0].location;
            const destination = waypoints[waypoints.length - 1].location;
            const directionsService = new google.maps.DirectionsService();
            // const directionsDisplay = new google.maps.DirectionsRenderer();

            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: travelMode,
                    waypoints: waypoints
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        // console.log(directionsDisplay.setDirections(response))
                        setState({
                            directions: result
                        });
                    } else {
                        setState({ error: result });
                    }
                }
            );
            //////
            var origin1 = new google.maps.LatLng(55.930385, -3.118425);
            var origin2 = 'Greenwich, England';
            var destinationA = 'Stockholm, Sweden';
            var destinationB = new google.maps.LatLng(50.087692, 14.421150);

            // var service = new google.maps.DistanceMatrixService();
            // service.getDistanceMatrix(
            //     {
            //         origins: [waypoints[0].location, waypoints[1].location],
            //         destinations: [waypoints[1].location, waypoints[2].location],
            //         travelMode: 'DRIVING',
            //     }, (res, status) => {
            //         console.log(res)

            //     });

        }

    }, [props])

    if (state.error) {
        return <h1>{state.error}</h1>;
    }
    return (state.directions && <DirectionsRenderer directions={state.directions} />)
}

const Map = withScriptjs(
    withGoogleMap(React.memo((props) => (
        <GoogleMap
            defaultCenter={props.defaultCenter}
            defaultZoom={props.defaultZoom}
            onClick={(e) => props.onMapClick(e)}
            options={{ streetViewControl: false, fullscreenControl: false, disableDefaultUI: true }}

        >
            {props.markers.map((marker, index) => {
                const position = { lat: marker.lat, lng: marker.lng };
                return <Marker key={index} position={position} />;
            })}
            <MapDirectionsRenderer
                places={props.markers}
                travelMode={google.maps.TravelMode.DRIVING}
            />
        </GoogleMap>
    ))
    )
);

export default Map;
