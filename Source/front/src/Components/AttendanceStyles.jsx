import styled from "styled-components";

export const TableContainer = styled.div`
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -40%);
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    width: 1%;
    white-space: nowrap;
  }

  th {
    background-color: #f2f2f2;
  }
`;

export const Heading = styled.h4`
  background: linear-gradient(to right, #7a0606, #b10909);
  color: white;
  padding: 10px;
  width: 100%; 
`;

export const DateInput = styled.input`
  position: absolute;
  top: 26%;
  left: 77%;
  transform: translate(-50%, -50%);
`;

export const SaveButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 8px 15px;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-20%, 131.5%);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #43a047;
  }
`;

export const AddDateButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 8px 15px;
  position: absolute;
  transform: translate(925%, 132%);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #;
  }
`;
