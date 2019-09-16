import React, { useState } from 'react';
import CostsTable from '../../components/CostsTable';
import { DashboardWindowContextConsumer } from '../../components/provider/dashboard/CreateDashboardContext'

export default function CostsDashboard() {
    return (
        <DashboardWindowContextConsumer>
            {
                ({ data, handleAdding, handleRemoving }) => (
                    <React.Fragment>
                        <CostsTable data={data} handleAddOrder={handleAdding} handleRemoving={handleRemoving}/>
                    </React.Fragment>
                )
            }
        </DashboardWindowContextConsumer>
    );
}