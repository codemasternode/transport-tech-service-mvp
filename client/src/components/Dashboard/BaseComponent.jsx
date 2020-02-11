import React, { Fragment } from 'react';
import { ItemDiv, Button } from '../../utils/theme'


const BaseComponent = ({ vehicles }) => {

    const _renderVehicles = () => {
        return (vehicles.map((item, key) => {
            const { name } = item
            return (
                <ItemDiv key={key}>
                    <div className="accordion__title">
                        <h4 style={{ margin: 0 }}>{key + 1} {name}</h4>
                        <div>
                            <Button onClick={e => {
                                e.preventDefault();
                                e.stopPropagation()
                            }}>
                                Szczegóły
                            </Button>
                            <Button onClick={e => {
                                e.preventDefault();
                                e.stopPropagation()
                            }}>
                                Edytuj
                            </Button>
                            <Button onClick={e => {
                                e.preventDefault();
                                e.stopPropagation()
                            }}>
                                Usuń
                            </Button>
                        </div>
                    </div>
                </ItemDiv>
            )
        }))
    }

    const _init = () => {
        return (
            <Fragment>
                {_renderVehicles()}
            </Fragment>
        )
    }

    return _init();
}

export default BaseComponent;