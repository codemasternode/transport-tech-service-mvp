import types from './types';

const add = item => ({
    type: types.ADD_COMPANY, item
})

export default {
    add,
}