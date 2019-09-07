import React from "react";
import "./index.scss";
import UsersTable from "../../components/UsersTable";

const users = [
  {
    name: "Marcin",
    surname: "Warzybok",
    email: "mw@gmail.com",
    password: "qwer123"
  },
  {
    name: "Artur",
    surname: "Garlacz",
    email: "mw@gmail.com",
    password: "qwer123"

  },
  {
    name: "Marcin",
    surname: "Warzybok",
    email: "mw@gmail.com",
    password: "qwer123"

  },
  {
    name: "Marcin",
    surname: "Warzybok",
    email: "mw@gmail.com",
    password: "qwer123"

  }
]

function AdminDashboard() {
  return (
    <React.Fragment>
      <UsersTable users={users} />
    </React.Fragment>
  );
}

export default AdminDashboard;