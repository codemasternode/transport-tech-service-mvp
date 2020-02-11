import { combineReducers } from 'redux';
import companiesReducer from './reducers/companies/duck'
import dashboardReducer from './reducers/dashboard/duck'

const rootReducer = combineReducers({
    companies: companiesReducer,
    dashboard: dashboardReducer
})

export default rootReducer