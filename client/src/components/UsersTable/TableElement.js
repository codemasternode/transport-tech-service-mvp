import React from "react";

function TableElement({ value: { name, surname } }) {
    return (
        <tr>
            <td>{name}</td>
            <td>{surname}</td>
        </tr>
    );
}

export default TableElement;