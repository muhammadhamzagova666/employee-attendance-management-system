import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Select from "react-select";
import styled from "styled-components";

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #7a0606, #b10909);
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
  background-color: #4d0000;
  color: white;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const AcceptButton = styled.button`
  margin: 5px;
  background-color: #4CAF50; 
  color: white;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const DeclineButton = styled.button`
  margin: 5px;
  background-color: #f44336; 
  color: white;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const ViewLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('id');
    localStorage.setItem("id", id);
    axios.get(`http://localhost:3000/auth/getleaveswrtmanager/${id}`)
      .then(res => {
        setLeaves(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleAction = (leaveId, action) => {
    axios.post(`http://localhost:3000/auth/updateleave/${leaveId}`, { action })
      .then(res => {
        console.log(res.data);
        const id = localStorage.getItem('id');
        axios.get(`http://localhost:3000/auth/getleaveswrtmanager/${id}`)
          .then(res => {
            setLeaves(res.data);
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar />
        <div className="col p-0 m-0">
          <div className="d-flex align-items-center justify-content-center ">
            <WelcomeMessage>View Leaves</WelcomeMessage>
          </div>
          <Table>
            <thead>
              <tr>
                <Th style={{width: '5%'}}>Leave ID</Th>
                <Th style={{width: '5%'}}>Employee ID</Th>
                <Th style={{width: '15%'}}>Start Date</Th>
                <Th style={{width: '15%'}}>End Date</Th>
                <Th style={{width: '30%'}}>Reason</Th>
                <Th style={{width: '20%'}}>Status</Th>
                <Th style={{width: '10%'}}>Action</Th>
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
                  <Td>
                    <AcceptButton onClick={() => handleAction(leave.id, 'Accepted')}>Accept</AcceptButton>
                    <DeclineButton onClick={() => handleAction(leave.id, 'Declined')}>Decline</DeclineButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ViewLeaves;
