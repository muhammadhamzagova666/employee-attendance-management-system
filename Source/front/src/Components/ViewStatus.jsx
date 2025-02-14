import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import EmpSidebar from "./EmpSidebar";
import styled from "styled-components";
import axios from 'axios';

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #0c4d00, #188f01);
  color: white;
  padding: 10px;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const ViewStatus = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('id'); 
    axios.get(`http://localhost:3000/auth/getleaves/${id}`)
      .then(res => {
        setLeaves(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <EmpSidebar />
        <div className="col p-0 m-0">
          <div className="d-flex align-items-center justify-content-center ">
            <WelcomeMessage>Request Leave</WelcomeMessage>
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Leave ID</Th>
                <Th>Employee ID</Th>
                <Th>Start Date</Th>
                <Th>End Date</Th>
                <Th>Reason</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave.id}>
                  <Td>{leave.id}</Td>
                  <Td>{leave.employee_id}</Td>
                  <Td>{leave.start_date}</Td>
                  <Td>{leave.end_date}</Td>
                  <Td>{leave.reason}</Td>
                  <Td>{leave.status}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ViewStatus;
