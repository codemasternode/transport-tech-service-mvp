import React from 'react';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyCbxWM2sqqiQoxXyR1maA_9dzro72-vKOw");
Geocode.enableDebug();


const DashboardWindowContext = React.createContext()
const DashboardWindowContextConsumer = DashboardWindowContext.Consumer;

function DashboardWindowProvider(props) {
    const [state, setState] = React.useState({
        bases: [],
        vehicle: [],
        basesAndVehicles: [],
        costs: [],
        employees: [],
        activeBase: '',
        maxBases: 2,
        maxVehicles: 10,
        plan: "",
        useFull: ["1"],
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

    const handleChangeBase = (e, values, id) => {
        // console.log(id)
        // console.log(state.basesAndVehicles)
        // let data = state.basesAndVehicles;
        // if (data.length === 0) {
        //     console.log("Za pierwszyyym")

        //     let tab = []
        //     let tabVehicle = []
        //     tabVehicle.push(id)
        //     tab.push(state.activeBase, tabVehicle)
        //     data.push(tab)
        // } else {
        //     console.log(data)
        //     data.map((item, key) => {
        //         console.log(item[0] === state.activeBase, item[0], data)
        //         if (item[0] === state.activeBase) {
        //             console.log("Znaleziony!!!", state.activeBase, item)
        //             // console.log(item[0])
        //             item[1].push(id)
        //             return item
        //         } else {
        //             console.log("Nowy!!!")
        //             // let tab = []
        //             // let tabVehicle = []
        //             // tabVehicle.push(id)
        //             // tab.push(state.activeBase, tabVehicle)
        //             // data.push(tab)
        //         }
        //         // console.log(item[0] === state.activeBase)
        //     })
        // }
        let counter = 0;
        let data = state.basesAndVehicles;
        if (data.length === 0) {
            console.log("Za pierwszyyym")
            let json = {}
            let tab = []
            let tabVehicle = []
            tabVehicle.push(id)
            // json[state.activeBase] = tabVehicle

            // tab.push(state.activeBase, tabVehicle)
            data.push({ id: state.activeBase, vehicles: tabVehicle })
        } else {
            console.log(data)
            // data.map((item, key) => {
            //     console.log(item)
            //     if (item[state.activeBase]) {
            //         counter++;
            //         console.log("Znaleziony!!!", state.activeBase, item)
            //         if (!item[state.activeBase].includes(id)) {
            //             item[state.activeBase].push(id)
            //             return item
            //         }
            //         // console.log(item[0])
            //         return item

            //     } else {
            //         counter++;
            //         let json = {}
            //         let tab = []
            //         let tabVehicle = []
            //         tabVehicle.push(id)
            //         json[state.activeBase] = tabVehicle
            //         // tab.push(state.activeBase, tabVehicle)
            //         data.push(json)
            //     }
            //     console.log("Nowy!!!")
            //     // let tab = []
            //     // let tabVehicle = []
            //     // tabVehicle.push(id)
            //     // tab.push(state.activeBase, tabVehicle)
            //     // data.push(tab)

            //     // console.log(item[0] === state.activeBase)
            // })
            data.map((item, key) => {
                if (item.id === state.activeBase) {
                    console.log("Znaleziony!!!", state.activeBase, item)
                    if (!item.vehicles.includes(id)) {
                        item.vehicles.push(id)
                        return item
                    }
                    // console.log(item[0])
                    return item

                } else if (item.id !== state.activeBase && key === data.length - 1) {
                    console.log("/")
                    let tabVehicle = []
                    tabVehicle.push(id)
                    data.push({ id: state.activeBase, vehicles: tabVehicle })
                } else {
                    console.log("EHH")
                }
            })
        }
        console.log(data)
        setState({
            ...state,
            basesAndVehicles: data,
        })
    }

    const handleAddVehicle = (e, title, id) => {
        // console.log(e.target, title, id)
        state.bases.map((item, key) => {
            if (id === key) {
                setState({ ...state, activeBase: id })
            }
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
        } else if (name === "vehicle") {
            let vehicle = state.vehicle;
            vehicle.push({
                name: values.name,
                valueOfVehicle: values.valueOfVehicle,
                petrol: values.petrol,
                combustion: values.combustion,
                capacity: values.capacity,
                amortization: values.amortization,
                lenght: values.lenght,
                width: values.width,
                height: values.height,
                emptyVehicle: values.emptyVehicle,
            })
            setState({
                ...state,
                vehicle
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

    const handleNewForm = () => {
        let useFull = state.useFull
        useFull.push("2")
        console.log(useFull)
        setState({ ...state, useFull })
    }


    return (
        <DashboardWindowContext.Provider value={{ data: state, clickOnMap, handleRemoveBase, handleChoosePlan, handleAdding, handleRemoving, handleChangeBase, handleAddVehicle, handleNewForm }} >
            {
                props.children
            }
        </DashboardWindowContext.Provider>
    );
}

export default DashboardWindowProvider
export { DashboardWindowContextConsumer }