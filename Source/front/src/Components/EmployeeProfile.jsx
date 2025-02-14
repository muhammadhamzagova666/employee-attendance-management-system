import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import EmpSidebar from "./EmpSidebar";
import styled from "styled-components";
import axios from "axios";

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #0c4d00, #188f01);
  color: white;
  padding: 10px;
  width: 100%;
`;

const ProfileContainer = styled.div`
  margin: 30px auto;
  padding: 20px; 
  border: 2.5px solid black;
  border-radius: 5px;
  width: 60%; 
  max-width: 800px; 
`;

const ShowPasswordButton = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 5px 10px; 
  border: none;
  margin-left: 570px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const ShowPasswordButtoninEditmode = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 5px 10px; 
  border: none;
  margin-left: 280px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ChangeButton = styled.button`
  background-color: #e74c3c;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #c0392b;
  }
`;

const SaveButton = styled.button`
  background-color: #28a745; 
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background-color: #218838; 
  }
`;

const CancelButton = styled.button`
  background-color: #dc3545; 
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c82333; 
  }
`;

const Input = styled.input`
  width: 50%; // Adjust the width as needed
  margin-left: auto;
  margin: 20px auto;
  margin-right: auto;
  display: block;
`;

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const id = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/getallemployeeinfo/${id}`
        );
        setEmployee(response.data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    fetchEmployee();
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSave = async () => {
    if (
      !employee.name ||
      !employee.email ||
      !employee.address ||
      !employee.password
    ) {
      alert("All fields must be filled out");
      return;
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(employee.email)) {
      alert("Invalid email format");
      return;
    }

    const confirmUpdate = window.confirm(
      "Are you sure? You will be logged out of the session!"
    );
    if (!confirmUpdate) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/auth/updateemployee/${id}`,
        employee
      );
      console.log(response.data);
      setEditMode(false);
      // Logout and navigate to login
      axios.get("http://localhost:3000/auth/logout").then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/login");
        } else {
          console.error("Logout failed");
        }
      });
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <EmpSidebar />
        <div className="col p-0 m-0">
          <div className="d-flex align-items-center justify-content-center ">
            <WelcomeMessage>Profile </WelcomeMessage>
          </div>
          <ProfileContainer>
            {editMode ? (
              <>
                <Input
                  type="text"
                  value={employee.name}
                  onChange={(e) =>
                    setEmployee({ ...employee, name: e.target.value })
                  }
                />
                <Input
                  type="email"
                  value={employee.email}
                  onChange={(e) =>
                    setEmployee({ ...employee, email: e.target.value })
                  }
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={employee.password}
                  onChange={(e) =>
                    setEmployee({ ...employee, password: e.target.value })
                  }
                />
                <ShowPasswordButtoninEditmode onClick={toggleShowPassword}>
                  {showPassword ? "Hide" : "Show"}
                </ShowPasswordButtoninEditmode>
                <Input
                  type="text"
                  value={employee.address}
                  onChange={(e) =>
                    setEmployee({ ...employee, address: e.target.value })
                  }
                />
                <ButtonContainer>
                  <SaveButton onClick={handleSave}>Save</SaveButton>
                  <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                </ButtonContainer>
              </>
            ) : (
              <>
                <Info>
                  <strong>Name:</strong> {employee ? employee.name : ""}
                </Info>
                <Info>
                  <strong>Email:</strong> {employee ? employee.email : ""}
                </Info>
                <Info>
                  <strong>Address:</strong> {employee ? employee.address : ""}
                </Info>
                <Info>
                  <strong>Password:</strong>{" "}
                  {showPassword ? employee.password : "••••••"}
                </Info>
                <ShowPasswordButton onClick={toggleShowPassword}>
                  {showPassword ? "Hide" : "Show"}
                </ShowPasswordButton>
                <ButtonContainer>
                  <ChangeButton onClick={() => setEditMode(true)}>
                    Change
                  </ChangeButton>
                </ButtonContainer>
              </>
            )}
          </ProfileContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
