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
        costs: [],
        employees: [],
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

    const handleAdding = (name, values) => {
        console.log(name, values)
        if (name === "employee") {
            let employees = state.employees;
            employees.push({ firstName: values.firstName, lastName: values.lastName, currency: values.currency, sallary: values.sallary, position: values.position })
            setState({
                ...state,
                employees
            })
        } else if (name === "costs") {
            let costs = state.costs;
            costs.push({ name: values.name, currency: values.currency, valuePrice: values.valuePrice, frequency: values.frequency })
            setState({
                ...state,
                costs
            })
        }

    }


    const handleRemoving = (name, id) => {
        console.log(id)
        if (name === "employee") {
            let employees = state.employees.filter((item, key) => {
                console.log(id, key)
                if (id !== key) { return item }
            })
            setState({ ...state, employees })
        } else if (name === "costs") {
            let costs = state.costs.filter((item, key) => {
                console.log(id, key)
                if (id !== key) { return item }
            })
            setState({ ...state, costs })
        }


    }

    const handleRemoveCosts = () => {

    }

    const handleAddCosts = () => {

    }



    return (
        <DashboardWindowContext.Provider value={{ data: state, clickOnMap, handleRemoveBase, handleChoosePlan, handleAdding, handleRemoving }} >
            {
                props.children
            }
        </DashboardWindowContext.Provider>
    );
}

export default DashboardWindowProvider
export { DashboardWindowContextConsumer }