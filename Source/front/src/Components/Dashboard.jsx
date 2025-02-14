import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMoneyBillWave, faEnvelope, faUserTie } from '@fortawesome/free-solid-svg-icons'

const InfoBox = styled.div`
  margin: 30px;
  padding: 10px;
  border: 3px solid #9f0a0a;
  border-radius: 10px;
  background-color: #f8f9fa;
  max-width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const BoldText = styled.p`
  font-weight: bold;
  font-size: 20px;
  font-family: Arial, sans-serif;
  color: #2c3e50;
`;

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #7a0606, #b10909);
  color: white;
  padding: 10px;
  width: 100%; // Add this line
`;

const Tooltip = styled.div`
  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
`;

const Heading = styled.h5`
  margin-left: 30px;
  margin-top: 20px;
  justify-content: center;
`;

const Percentage = styled.span`
position: absolute;
right: -50px; // Adjust this value to position the percentage after the bar
top: 0;
`;

const fill = keyframes`
  0% { width: 0; }
  300% { width: 100%; }
`;

const AttendanceBar = styled.div.attrs(props => ({
  title: `${props.name}: ${props.percentage}%`,
}))`
  width: ${props => props.percentage}%;
  // Add this line
  background-color: #620808;
  height: 20px;
  margin-bottom: 10px;
  margin-left: 10px;
  animation: ${fill} 2s ease-out;
  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

const AttendanceBarContainer = styled.div`
  width: 80%;
  height: 25px;
  position: relative;
`;

const EmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 40px;
`;

const ID = styled.div`
  border-right: 1px solid black;
  padding-right: 10px;
`;
const IDHeading = styled.div`
  margin-left: 40px;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  color: #2c3e50; 
  font-weight: bold; 
`;

const Dashboard = () => {
  const [name, setName] = useState("");
  const [employeeCount, setEmployeeCount] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [LeaveReq, setLeaveReq] = useState(0);
  const [TotalManager, setTotalManager] = useState(0);
  const m_id = localStorage.getItem("id");
  const [attendanceData, setAttendanceData] = useState([]);
  localStorage.setItem("id", m_id);

  useEffect(() => {
    setName(localStorage.getItem("name"));
    axios
      .get(`http://localhost:3000/auth/getemployeescount/${m_id}`)
      .then((response) => {
        setEmployeeCount(response.data.count);
      })
      .catch((error) => console.error("Error fetching data:", error));

    axios
      .get(`http://localhost:3000/auth/getemployeessalary/${m_id}`)
      .then((response) => {
        setTotalSalary(response.data.count);
      })
      .catch((error) => console.error("Error fetching data:", error));

    axios
      .get(`http://localhost:3000/auth/getleavescount/${m_id}`)
      .then((response) => {
        setLeaveReq(response.data.count);
      })
      .catch((error) => console.error("Error fetching data:", error));

    axios
      .get(`http://localhost:3000/auth/getmanagercount`)
      .then((response) => {
        setTotalManager(response.data.count);
      })
      .catch((error) => console.error("Error fetching data:", error));

    axios
      .get(
        `http://localhost:3000/auth/getemployeesattendancepercentage/${m_id}`
      )
      .then((response) => {
        setAttendanceData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar />
        <div className="col p-0 m-0" style={{ backgroundColor: "#9F0A0A" }}>
          <div className="d-flex align-items-center justify-content-center ">
            <WelcomeMessage>Welcome, {name} </WelcomeMessage>
          </div>
          <InfoContainer>
            <InfoBox>
              <FontAwesomeIcon icon={faUser} />
              <BoldText>Employees = {employeeCount} </BoldText>
            </InfoBox>
            <InfoBox>
              <FontAwesomeIcon icon={faMoneyBillWave} />
              <BoldText>Total Salary = {totalSalary} </BoldText>
            </InfoBox>
            <InfoBox>
              <FontAwesomeIcon icon={faEnvelope} />
              <BoldText>Leave Req = {LeaveReq} </BoldText>
            </InfoBox>
            <InfoBox>
              <FontAwesomeIcon icon={faUserTie} />
              <BoldText>Total Managers = {TotalManager} </BoldText>
            </InfoBox>
          </InfoContainer>
          <div >
            <Heading style={{ marginLeft: '400px' }}>Employees Attendance</Heading>
            <IDHeading>ID</IDHeading>
            {attendanceData.map(employee => (
              <EmployeeInfo key={employee.id}>
                <ID><BoldText>{employee.id}</BoldText></ID>
                <AttendanceBarContainer>
                <AttendanceBar percentage={employee.attendance_percentage} name={employee.name}>
                  <Tooltip>{employee.name}: {employee.attendance_percentage}%</Tooltip>
                  <Percentage>{employee.attendance_percentage}%</Percentage>
                </AttendanceBar>
                </AttendanceBarContainer>
              </EmployeeInfo>
            ))}
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
