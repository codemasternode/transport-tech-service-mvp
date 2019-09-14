import React from 'react';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyCbxWM2sqqiQoxXyR1maA_9dzro72-vKOw");
Geocode.enableDebug();


const DashboardWindowContext = React.createContext()
const DashboardWindowContextConsumer = DashboardWindowContext.Consumer;

function DashboardWindowProvider(props) {
    const [state, setState] = React.useState({
        plan: "",
        bases: [],
        maxBases: 2,
        vehicle: [],
        mapError: ""
    })




    const clickOnMap = (t, map, coord) => {


        console.log(coord)
        if (state.bases.length < state.maxBases) {
            const { latLng } = coord;
            const lat = latLng.lat();
            const lng = latLng.lng();
            Geocode.fromLatLng(lat, lng).then(
                response => {
                    const addressFull = response.results[0].formatted_address;
                    let address = addressFull.split(",")[1]
                    let streetName = addressFull.split(",")[0]
                    let country = addressFull.split(",")[2]
                    setState(previousState => {
                        console.log(previousState)
                        return {
                            ...state,
                            bases: [
                                ...previousState.bases,
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
        } else {
            setState({
                ...state,
                mapError: "Wykorzystałeś limit dostępnych baz w Twoim pakiecie, w celu edycji powiększ swój pakiet lub usuń poprzednie."
            })
        }

    }

    const handleRemoveBase = (id) => {
        let bases = state.bases.filter((item, key) => {
            if (id !== key) { return item }
        })
        setState({ ...state, bases })
    }

    const handleChoosePlan = key => {
        let plan = ""
        let maxBases = 0;
        switch (key) {
            case 0:
                plan = "Basic"
                maxBases = 2
                break;
            case 1:
                plan = "Pro"
                maxBases = 5
                break;
            case 2:
                plan = "Enterprise"
                maxBases = 100
                break;
            default:
                plan = "Basic"
                maxBases = 2

        }

        setState({
            ...state,
            plan,
            maxBases
        })
    }

    return (
        <DashboardWindowContext.Provider value={{ data: state, clickOnMap, handleRemoveBase, handleChoosePlan }} >
            {
                props.children
            }
        </DashboardWindowContext.Provider>
    );
}

export default DashboardWindowProvider
export { DashboardWindowContextConsumer }