import React, { useEffect } from "react";
import {
    withGoogleMap,
    GoogleMap,
    withScriptjs,
    Marker
} from "react-google-maps";

const DashboardMap = withScriptjs(
    withGoogleMap(React.memo((props) => (
        // console.log(props)
        <GoogleMap
            defaultCenter={props.defaultCenter}
            defaultZoom={props.defaultZoom}
            onClick={(e) => props.onMapClick(e)}
            options={{ streetViewControl: false, fullscreenControl: false, disableDefaultUI: true }}

        >
            <Marker position={props.markers} />;
        </GoogleMap>
    ))
    )
);

export default DashboardMap;
