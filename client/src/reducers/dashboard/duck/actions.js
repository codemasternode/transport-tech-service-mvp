import types from './types';

const fetchCustomerData = item => ({
    type: types.FETCH_CUSTOMER_DATA, item
})

const dropCustomerBase = item => ({
    type: types.DROP_CUSTOMER_BASE, item
})

const dropCustomerVehicle = item => ({
    type: types.DROP_CUSTOMER_VEHICLE, item
})

const editCustomerBase = item => ({
    type: types.EDIT_CUSTOMER_BASE, item
})

const editCustomerVehicle = item => ({
    type: types.EDIT_CUSTOMER_VEHICLE, item
})

const infoCustomerBase = item => ({
    type: types.INFO_CUSTOMER_BASE, item
})

const infoCustomerVehicle = item => ({
    type: types.INFO_CUSTOMER_VEHICLE, item
})



export default {
    fetchCustomerData,
    dropCustomerBase,
    dropCustomerVehicle,
    editCustomerBase,
    editCustomerVehicle,
    infoCustomerBase,
    infoCustomerVehicle
}