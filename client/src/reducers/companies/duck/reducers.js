import types from './types';
import produce from 'immer'

const INITIAL_STATE = {
    searchedCriterial: {},
    searchedCriterialDimensions: {},
    dataForRequest: {
        numberOfPallets: 1,
        weight: 2,
        height: 2,
        typeOfSearch: "Palette",
        typeOfPallet: "EUR-EPAL",
    },
    chosenCompany: {},
    allFetchedCompanies: []
}

const companiesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.ADD_COMPANY:
            console.log(action.item)
            return produce(state, draftState => {
                draftState.chosenCompany = action.item
            })
        case types.ADD_CRITERIA:
            return produce(state, draftState => {
                draftState.searchedCriterial = action.item
            })
        case types.ADD_DATA_REQUEST:
            return produce(state, draftState => {
                draftState.dataForRequest = action.item
            })
        case types.ADD_CRITERIA_DIMENSIONS:
            return produce(state, draftState => {
                draftState.searchedCriterialDimensions = action.item
            })
        case types.ADD_ALL_COMPANIES:
            return produce(state, draftState => {
                draftState.allFetchedCompanies = action.item
            })
        default:
            return state;
    }
}

export default companiesReducer;