import types from './types';

const add = item => ({
    type: types.ADD_COMPANY, item
})

const addAll = item => ({
    type: types.ADD_ALL_COMPANIES, item
})

export default {
    add,
    addAll
}