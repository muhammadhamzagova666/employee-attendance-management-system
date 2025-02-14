import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmpSidebar from "./EmpSidebar";
import styled, { keyframes } from "styled-components";

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #0c4d00, #188f01);
  color: white;
  padding: 10px;
  width: 100%;
`;

const AttendanceTable = styled.table`
  width: 50%;
  border-collapse: collapse;
  margin: 70px auto;
  border: 1px solid black;

  th, td {
    border: 1px solid black;
    padding: 10px;
  }

  th {
    background-color: #017900;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const AttendanceBarContainer = styled.div`
  width: 50%;
  height: 20px;
  border: 1px solid black;
  margin: 20px auto;
  position: relative;
`;

const fill = keyframes`
  0% { width: 0; }
  200% { width: 100%; }
`;

const AttendanceBar = styled.div`
  height: 110%;
  background-color: #017900;
  width: ${props => props.percentage}%;
  animation: ${fill} 2s ease-out;
`;

const PercentageLabel = styled.div`
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  text-align: center; 
  line-height: 20px; 
  color: black;
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const MarkAttendanceButton = styled.button`
  position: absolute;
  top: 100px;
  right: 10px;
  background-color: #017900; /* Change this to your preferred color */
  color: white; /* Change this to your preferred color */
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: ${fadeIn} 2s ease-out;

  &:hover {
    background-color: #014d00; /* Change this to your preferred color */
  }
`;

const ViewAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem('id');
    axios.get(`http://localhost:3000/auth/getattendancewrtemployee/${id}`)
      .then(response => {
        setAttendance(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    axios.get(`http://localhost:3000/auth/getattendancepercentagewrtemployee/${id}`)
      .then(response => {
        setPercentage(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleMarkAttendance = () => {
    const id = localStorage.getItem('id');
    axios.get(`http://localhost:3000/auth/requestattendance/${id}`)
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <EmpSidebar />
        <div className="col p-0 m-0">
          <div className="d-flex align-items-center justify-content-center ">
            <WelcomeMessage>View Attendance</WelcomeMessage>
            <MarkAttendanceButton onClick={handleMarkAttendance}>Mark Attendance</MarkAttendanceButton>
          </div>
          <AttendanceBarContainer>
            <AttendanceBar percentage={percentage} />
            <PercentageLabel>Percentage = {percentage}%</PercentageLabel> 
          </AttendanceBarContainer>
          <AttendanceTable>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </AttendanceTable>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;