import React from 'react';
import VehicleTable from '../../components/VehicleTable/index';
import { DashboardWindowContextConsumer } from '../../components/provider/dashboard/CreateDashboardContext'

export default function VehicleDashboard() {
    return (
        <DashboardWindowContextConsumer>
            {
                ({ data, handleChangeBase, handleAddVehicle, handleNewForm, handleAdding }) => (
                    <React.Fragment>
                        <VehicleTable data={data} handleChangeBase={handleChangeBase} handleAddVehicle={handleAddVehicle} handleNewForm={handleNewForm} handleAdding={handleAdding} />
                    </React.Fragment>
                )
            }
        </DashboardWindowContextConsumer>
    );
}