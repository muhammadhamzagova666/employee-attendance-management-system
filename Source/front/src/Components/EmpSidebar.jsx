import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmpSidebar.css"
import "bootstrap-icons/font/bootstrap-icons.css";


const EmpSidebar = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        navigate("/login");
      }
    });
  };

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style={{backgroundColor: '#212020' }}>
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
        <Link
          to="/employeedashboard"
          className="d-flex align-items-center pb-3 mb-md-1 mt-md-1 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-5 fw-bolder align-items-center d-none d-sm-inline">
            {name}{" "}
            <span style={{ fontSize: "0.8em", fontWeight: "normal" }}>
              {email}
            </span>
          </span>
        </Link>
        <div
          style={{ borderTop: "3px solid white", width: "100%", margin: "0" }}
        />
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
          id="menu"
        >
          <li className="w-100">
            <Link
              to="/employeedashboard"
              className="nav-link text-white px-0 align-middle"
            >
              <i className="fs-4 bi-speedometer2 ms-2"></i>
              <span className="ms-2 d-none d-sm-inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dashboard&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </Link>
          </li>
          <li className="w-100">
            <Link
              to="/employeedashboard/applyleaves"
              className="nav-link px-0 align-middle text-white"
            >
              <i className="fs-4 bi-building-x ms-2"></i>
              <span className="ms-2 d-none d-sm-inline">Leave</span>
            </Link>
          </li>
          <li className="w-100">
            <Link
              to="/employeedashboard/viewattendance"
              className="nav-link px-0 align-middle text-white"
            >
              <i className="fs-4 bi-grid-1x2 ms-2"></i>
              <span className="ms-2 d-none d-sm-inline">Attendance</span>
            </Link>
          </li>
          <li className="w-100">
            <Link
              to="/employeedashboard/employeeprofile"
              className="nav-link px-0 align-middle text-white"
            >
              <i className="fs-4 bi-person ms-2"></i>
              <span className="ms-2 d-none d-sm-inline">Profile</span>
            </Link>
          </li>
          <li className="w-100" onClick={handleLogout}>
            <Link className="nav-link px-0 align-middle text-white ">
              <i className="fs-4 bi-power ms-2"></i>
              <span className="ms-2 d-none d-sm-inline">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmpSidebar;
