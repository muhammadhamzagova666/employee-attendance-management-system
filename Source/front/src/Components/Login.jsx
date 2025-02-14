import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url =
            values.designation === "Manager"
                ? "http://localhost:3000/auth/adminlogin"
                : "http://localhost:3000/auth/employeelogin";
        try {
            const result = await axios.post(url, values);
            if (result.data.loginStatus) {
                localStorage.setItem("valid", true);
                localStorage.setItem("id", result.data.id);
                localStorage.setItem("name", result.data.name);
                localStorage.setItem("email", values.email);
                if (result.data.designation === "Manager") {
                    navigate("/dashboard");
                } else if (result.data.designation === "Employees") {
                    navigate("/EmployeeDashboard");
                }
            } else {
                setError(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
            <div className="p-3 rounded w-25 border loginForm">
                <div className="text-warning">{error && error}</div>
                <h2>Login Page</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email:</strong>
                        </label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Enter Email"
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password:</strong>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            onChange={(e) =>
                                setValues({ ...values, password: e.target.value })
                            }
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Designation">
                            <strong>Designation:</strong>
                        </label>
                        <select
                            name="Designation"
                            onChange={(e) =>
                                setValues({ ...values, designation: e.target.value })
                            }
                            className="form-control rounded-0"
                        >
                            <option value="">Select Designation</option>
                            <option value="Manager">Manager</option>
                            <option value="Employees">Employee</option>
                        </select>
                    </div>
                    <button className="btn btn-success w-100 rounded-0 mb-2">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
