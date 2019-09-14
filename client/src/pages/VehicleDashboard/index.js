import React from 'react';
import VehicleTable from '../../components/VehicleTable/index';
import { DashboardWindowContextConsumer } from '../../components/provider/dashboard/CreateDashboardContext'

export default function VehicleDashboard() {
    return (
        <DashboardWindowContextConsumer>
            {
                ({ data }) => (
                    <React.Fragment>
                        <VehicleTable data={data} />
                    </React.Fragment>
                )
            }
        </DashboardWindowContextConsumer>
    );
}