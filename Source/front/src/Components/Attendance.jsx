import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Select from "react-select";
import styled, { keyframes }  from "styled-components";

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
  background-color: #4CAF50; /* Green */
  color: white;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const DeclineButton = styled.button`
  margin: 5px;
  background-color: #f44336; /* Red */
  color: white;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const ViewAllButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #520000; 
  color: white; 
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: ${fadeIn} 2s ease-out;

  &:hover {
    background-color: #400000; /* Change this to your preferred color */
  }
`;

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const navigate = useNavigate();
  const id = localStorage.getItem('id');
  localStorage.setItem("id", id);
  
  useEffect(() => {
    axios.get(`http://localhost:3000/auth/getAttendance/${id}`)
      .then(res => {
        setAttendance(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleViewAll = () => {
    navigate("/dashboard/attendance/viewall");
  };

  const handleAction = (attendanceId,date,action) => {
    axios.post(`http://localhost:3000/auth/updateAttendance/${attendanceId}`, { date, action })
      .then(res => {
        console.log(res.data);
        axios.get(`http://localhost:3000/auth/getAttendance/${id}`)
          .then(res => {
            setAttendance(res.data);
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
            <WelcomeMessage>Employees Attendance</WelcomeMessage>
            <ViewAllButton onClick={handleViewAll}>View All Attendance</ViewAllButton>
          </div>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>In Time</Th>
                <Th>Date</Th>
                <Th>Attendance Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(record => (
                <tr key={record.id}>
                  <Td>{record.id}</Td>
                  <Td>{record.name}</Td>
                  <Td>{record.in_time}</Td>
                  <Td>{record.date}</Td>
                  <Td>{record.status}</Td>
                  <Td>
                    <AcceptButton onClick={() => handleAction(record.id, record.date, 'P')}>Accept</AcceptButton>
                    <DeclineButton onClick={() => handleAction(record.id, record.date, 'A')}>Decline</DeclineButton>
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

export default Attendance;
