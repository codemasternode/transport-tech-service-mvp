import actions from './actions';
import axios from 'axios';

const useFetch = async (action, sendData, callback) => {
    axios.post(`http://localhost:5000/api/queries/getQuery`, { action, sendData })
        .then(res => {
            return callback(res.data)
        })
}

const fetchCustomerData = () => async dispatch => {
    await useFetch("DROP_CUSTOMER_BASE", "", dbs => {
        dispatch(actions.addAllDbs(dbs))
    });
}

const dropCustomerBase = () => async dispatch => {
    await useFetch("DROP_CUSTOMER_BASE", "", dbs => {
        dispatch(actions.addAllDbs(dbs))
    });
}
