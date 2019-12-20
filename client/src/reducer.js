import { combineReducers } from 'redux';
import companiesReducer from './reducers/companies/duck'
// import moviesReducer from './app/movies/duck';

const rootReducer = combineReducers({
    companies: companiesReducer
})

export default rootReducer