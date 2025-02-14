import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    job_id: "",
    department_id: "",
  });

  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsAndDepartments = async () => {
      try {
        const jobsResponse = await axios.get('http://localhost:3000/auth/getjobs');
        const departmentsResponse = await axios.get('http://localhost:3000/auth/getdepartments');

        setJobs(jobsResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobsAndDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      console.log(employee.job_id)
      const response = await axios.post('http://localhost:3000/auth/add_employee', employee);

      if (response.data.Status) {
        navigate('/dashboard/manage_employee');
      } else {
        alert(response.data.Error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };


  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label for="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              name="name"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label for="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label for="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              name="password"
              value={employee.password}
              onChange={handleChange}
              required
            />
            <label for="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="col-12">
            <label for="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              name="address"
              value={employee.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label for="inputJob" className="form-label">
              Job
            </label>
            <select
              className="form-select rounded-0"
              id="inputJob"
              name="job_id"
              value={employee.job_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose a job...</option> 
              {jobs.map((job) => (
                <option value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>
          <div className="col-12 mb-3">
            <label for="inputDepartment" className="form-label">
              Department
            </label>
            <select
              className="form-select rounded-0"
              id="inputDepartment"
              name="department_id"
              value={employee.department_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose a department...</option> 
              {departments.map((department) => (
                <option value={department.id}>{department.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
