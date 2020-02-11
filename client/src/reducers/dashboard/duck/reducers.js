import types from './types';
import produce from 'immer'

const INITIAL_STATE = {
    customerData: []
}

const dashboardReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.FETCH_CUSTOMER_DATA:
            // console.log(action.item)
            return produce(state, draftState => {
                draftState.customerData = action.item
            })
        // case types.DROP_CUSTOMER_BASE:
        //     console.log(action.item)
        //     return produce(state, draftState => {
        //         draftState.customerData = action.item
        //     })
        default:
            return state;
    }
}

export default dashboardReducer;