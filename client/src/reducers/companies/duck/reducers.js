import types from './types';
import produce from 'immer'

const INITIAL_STATE = {
    chosenCompany: {}
}

const companiesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.ADD_COMPANY:
            console.log(action.item)
            return {
                chosenCompany: action.item
            }
        default:
            return state;
    }
}

export default companiesReducer;