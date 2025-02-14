import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmpSidebar from './EmpSidebar';
import styled from 'styled-components';
import axios from 'axios';

const WelcomeMessage = styled.h4`
  background: linear-gradient(to right, #0c4d00, #188f01);
  color: white;
  padding: 10px;
  width: 100%;
`;

const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const ViewStatusButton = styled(Button)`
  background: #4CAF50; 
  color: white;
  margin-top: 200px;
`;

const ApplyLeaveButton = styled(Button)`
  background: #008CBA; 
  color: white;
  margin-left: 190px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const FormContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin: 20px;
  width: 50%; 
  margin: auto;
`;

const InputContainer = styled.div`
  margin: 10px 0;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 100px; 
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  resize: none;
`;

const EmployeeLeave = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const id = localStorage.getItem('id');

  const applyLeave = async () => {
    if (!startDate || !endDate || !reason) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/addleave', {
        id,
        startDate,
        endDate,
        reason
      });
      console.log(response.data);
      alert('Leave Applied!');
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <EmpSidebar />
        <div className="col p-0 m-0">
          <WelcomeMessage>Request Leave</WelcomeMessage>
          <ButtonContainer>
            <ViewStatusButton onClick={() => navigate('/employeedashboard/applyleaves/viewleaves')}>
              View Status
            </ViewStatusButton>
            <FormContainer>
              <InputContainer>
                <StyledInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </InputContainer>
              <InputContainer>
                <StyledInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </InputContainer>
              <InputContainer>
                <StyledTextArea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for leave" />
              </InputContainer>
              <ApplyLeaveButton onClick={applyLeave}>
                Apply for Leave
              </ApplyLeaveButton>
            </FormContainer>
          </ButtonContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeave;
