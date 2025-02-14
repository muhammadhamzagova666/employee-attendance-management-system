import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Outlet, useNavigate } from "react-router-dom";
import EmpSidebar from "./EmpSidebar";
import styled, { keyframes } from "styled-components";

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #0c4d00, #188f01);
  color: white;
  padding: 10px;
  width: 100%;
`;

const InfoContainer = styled.div`
  display: flex;
`;

const Box = styled.div`
  width: 40%;
  height: 50%;  
  margin: 20px;
  padding: 20px;
  border: 2px solid #017900;
  border-radius: 10px;
  background-color: #f2f2f2;
`;

const ProfileBox = styled.div`
  width: 50%;
  margin: 20px;
  padding: 20px;
  border: 2px solid #017900;
  border-radius: 10px;
  background-color: #f2f2f2;
`;

const AttendanceBarContainer = styled.div`
  width: 100%;
  height: 25px;
  border: 1px solid black;
  position: relative;
`;

const fill = keyframes`
  0% { width: 0; }
  300% { width: 100%; }
`;

const AttendanceBar = styled.div`
  height: 100%;
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

const EmployeeDashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [Job, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const id = localStorage.getItem('id');

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));

    axios.get(`http://localhost:3000/auth/getattendancepercentagewrtemployee/${id}`)
      .then(response => {
        setPercentage(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    axios.get(`http://localhost:3000/auth/getemployeeinfo/${id}`)
      .then(response => {
        setSalary(response.data.salary);
        setAddress(response.data.address);
        setJobTitle(response.data.jobtitle);
        setDepartment(response.data.departmentname)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    axios.get(`http://localhost:3000/auth/getattendancewrtemployee/${id}`)
      .then(response => {
        const attendanceRecords = response.data;
        const totalDaysPresent = attendanceRecords.filter(record => record.status === 'P').length;
        const totalDaysAbsent = attendanceRecords.filter(record => record.status === 'A').length;
        const totalDaysOnLeave = attendanceRecords.filter(record => record.status === 'L').length;
        setAttendance({ present: totalDaysPresent, absent: totalDaysAbsent, leave: totalDaysOnLeave });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

  }, []);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <EmpSidebar />
        <div className="col p-0 m-0">
          <div className="d-flex align-items-center justify-content-center ">
            <WelcomeMessage>Welcome, {name} </WelcomeMessage>
          </div>
          <InfoContainer>
            <ProfileBox>
              <h2>Profile Overview</h2>
              <p>ID: {id}</p>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>Salary: {salary}</p>
              <p>Address: {address}</p>
              <p>Position: {Job}</p>
              <p>Department: {department}</p>
            </ProfileBox>
            <Box>
              <h2>Attendance Summary</h2>
              <p>Total Days Present: {attendance.present}</p>
              <p>Total Days Absent: {attendance.absent}</p>
              <p>Total Days on Leave: {attendance.leave}</p>
              <AttendanceBarContainer>
                <AttendanceBar percentage={percentage} />
                <PercentageLabel>Percentage = {percentage}%</PercentageLabel>
              </AttendanceBarContainer>
            </Box>
          </InfoContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
