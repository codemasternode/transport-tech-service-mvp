import React from 'react';
import EmployeeTable from '../../components/EmployeeTable/index';
import { DashboardWindowContextConsumer } from '../../components/provider/dashboard/CreateDashboardContext'

export default function EmployeeDashboard() {
    return (
        <DashboardWindowContextConsumer>
            {
                ({ data, handleAdding, handleRemoving }) => (
                    <React.Fragment>
                        <EmployeeTable data={data} handleAddEmployees={handleAdding} handleRemoving={handleRemoving} />
                    </React.Fragment>
                )
            }
        </DashboardWindowContextConsumer>
    );
}