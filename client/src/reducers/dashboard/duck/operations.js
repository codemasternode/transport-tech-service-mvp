import actions from './actions';
import axios from 'axios';

const useFetch = async (type, action, sendData, callback) => {
    // axios.post(`http://localhost:5000/api/company-dashboard/${action}`, { action, sendData })
    //     .then(res => {
    //         return callback(res.data)
    // })
    axios({
        method: type,
        url: `http://localhost:5000/api/company-dashboard/${action}`,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        data: sendData
    }).then(res => {
        return callback(res)
    })
}


const fetchCustomerData = () => async dispatch => {
    await useFetch("get", "get-company", "", res => {
        // console.log(data)
        dispatch(actions.fetchCustomerData(res.data))
    });
}

const createNewBase = (data) => async dispatch => {
    await useFetch("post", "create-company-base", data, res => {
        fetchCustomerData()
    })
}

const createNewVehicle = () => async dispatch => {
    // await useFetch("post")
}

const dropCustomerBase = name => async dispatch => {
    await useFetch("post", "delete-company-base", { name }, dbs => {
        dispatch(actions.addAllDbs(dbs))
    });
}

export { fetchCustomerData, createNewBase, dropCustomerBase }