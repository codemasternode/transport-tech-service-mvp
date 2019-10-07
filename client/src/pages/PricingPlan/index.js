import React from "react";
import "./index.scss";
import PricingElement from '../../components/PricingElement'
import { DashboardWindowContextConsumer } from '../../components/provider/dashboard/CreateDashboardContext'

function PricingPlan() {
    return (
        <DashboardWindowContextConsumer>
            {
                ({ data, handleChoosePlan }) => (
                    <React.Fragment>
                        <PricingElement data={data} handleChoosePlan={handleChoosePlan} />
                    </React.Fragment>
                )
            }
        </DashboardWindowContextConsumer>
    );
}

export default PricingPlan;


