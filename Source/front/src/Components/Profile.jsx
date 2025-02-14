import React, { useState, useEffect,  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import styled from 'styled-components';

const ProfileContainer = styled.div`
  margin: 30px auto;
  padding: 10px;
  border: 2.5px solid black;
  border-radius: 5px;
  width: 50%;
  max-width: 600px;
`;

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #7a0606, #b10909);
  color: white;
  padding: 10px;
  width: 100%;
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
  background-color: #28a745; // Make the button green
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

const Input = styled.input`
  width: 50%; 
  margin-left: auto;
  margin-right: auto;
  display: block;
`;


const Profile = () => {
  const [manager, setManager] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const m_id = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/getmanager/${m_id}`);
        console.log(response.data); 
        setManager(response.data[0]); 
      } catch (error) {
        console.error(error); 
      }
    };

    fetchManager();
  }, []);

  const handleSave = async () => {
    if (!manager.name || !manager.email || !manager.password) {
      alert('All fields must be filled out');
      return;
    }
  
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(manager.email)) {
      alert('Invalid email format');
      return;
    }
  
    const confirmUpdate = window.confirm('Are you sure? You will be logged out of the session!');
    if (!confirmUpdate) {
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:3000/auth/updatemanager/${m_id}`, manager);
      console.log(response.data);
      setEditMode(false);
      axios.get("http://localhost:3000/auth/logout").then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/login");
        } else {
          console.error('Logout failed:', result.data);
        }
      }).catch((error) => {
        console.error('Error during logout:', error);
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  

  if (!manager) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar />
        <div className="col p-0 m-0">
          <WelcomeMessage>Manager Profile</WelcomeMessage>
          <ProfileContainer>
            <Info>
              <strong>ID:</strong> {manager.id}
            </Info>
            <Info>
              <strong>Name:</strong> 
              {editMode ? (
                <Input defaultValue={manager.name} onChange={(e) => setManager({ ...manager, name: e.target.value })} />
              ) : (
                manager.name
              )}
            </Info>
            <Info>
              <strong>Email:</strong> 
              {editMode ? (
                <Input type="email" defaultValue={manager.email} onChange={(e) => setManager({ ...manager, email: e.target.value })} />
              ) : (
                manager.email
              )}
            </Info>
            <Info>
              <strong>Password:</strong> 
              {editMode ? (
                <Input type={showPassword ? 'text' : 'password'} defaultValue={manager.password} onChange={(e) => setManager({ ...manager, password: e.target.value })} />
              ) : (
                '******'
              )}
  
              {editMode && <button style={{marginright: 1000}} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>}
            </Info>
          </ProfileContainer>
          <ButtonContainer>
            {editMode ? (
              <>
                <SaveButton onClick={handleSave}>Save</SaveButton>
                <ChangeButton onClick={() => window.location.reload()}>Cancel</ChangeButton>
              </>
            ) : (
              <ChangeButton onClick={() => setEditMode(true)}>Change</ChangeButton>
            )}
          </ButtonContainer>
        </div>
      </div>
    </div>
  );
};

export default Profile;
