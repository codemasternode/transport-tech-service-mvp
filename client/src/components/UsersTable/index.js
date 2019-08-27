import React from "react";
import "./index.scss";
import TableElement from './TableElement'

function Table(props) {
    return (
        <React.Fragment>
            <table>
                {props.users.map((value, index) => (
                    <TableElement value={value} />
                ))}
            </table>
        </React.Fragment>
    );
}

export default Table;