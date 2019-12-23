import types from './types';

const add = item => ({
    type: types.ADD_COMPANY, item
})

const addCriteria = item => ({
    type: types.ADD_CRITERIA, item
})

const addDimCriteria = item => ({
    type: types.ADD_CRITERIA_DIMENSIONS, item
})

const addAll = item => ({
    type: types.ADD_ALL_COMPANIES, item
})

export default {
    add,
    addCriteria,
    addDimCriteria,
    addAll
}