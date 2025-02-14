import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const UpdateButton = styled(Link)`
  background-color: #3498db;
  color: #fff;
  text-decoration: none;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #7a0606, #b10909);
  color: white;
  padding: 10px;
  width: 100%;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c0392b;
  }
`;

const Employee = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const m_id = localStorage.getItem("id");
        localStorage.setItem("id", m_id);
        const response = await axios.get(
          `http://localhost:3000/auth/getemployees/${m_id}`
        );
        setEmployees(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:3000/auth/delete_employee/${id}`);
        const updatedEmployees = employees.filter(
          (employee) => employee.id !== id
        );
        setEmployees(updatedEmployees);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
          <Sidebar />
        <div className="col p-0 m-0">
        <WelcomeMessage>Manage Employees</WelcomeMessage>
          <div className="px-5 mt-3">
            <div className="d-flex justify-content-center">
            </div>
            <Link to="/dashboard/add_employee" className="btn btn-success">
              Add Employee
            </Link>
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Salary</th>
                  <th>Address</th>
                  <th>Job ID</th>
                  <th>Depertment ID</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.salary}</td>
                    <td>{employee.address}</td>
                    <td>{employee.job_id}</td>
                    <td>{employee.department_id}</td>
                    <td>
                      <UpdateButton
                        to={`/dashboard/update_employee/${employee.id}`}
                      >
                        Update
                      </UpdateButton>
                      <DeleteButton onClick={() => handleDelete(employee.id)}>
                        Delete
                      </DeleteButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Outlet />
        </div>
      </div>
    </div>

  );
};

export default Employee;
