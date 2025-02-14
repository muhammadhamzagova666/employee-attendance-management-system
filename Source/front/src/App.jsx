import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import EmployeeDashboard from './Components/EmployeeDashboard'
import Home from './Components/Home'
import ManageEmployee from './Components/ManageEmployee'
import Profile from './Components/Profile'
import AddEmployee from './Components/AddEmployee'
import UpdateEmployee from './Components/UpdateEmployee'
import Attendance from './Components/Attendance'
import ViewLeaves from './Components/ViewLeaves'
import EmployeeProfile from './Components/EmployeeProfile'
import EmployeeLeave from './Components/EmployeeLeave'
import ViewStatus from './Components/ViewStatus'
import ViewAttendance from './Components/ViewAttendance'
import ViewAllAttendance from './Components/ViewAllAttendance'

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/employeedashboard' element={<EmployeeDashboard />}></Route>
        <Route path='' element={<Home />}></Route>
        <Route path='/dashboard/manage_employee' element={<ManageEmployee />}></Route>
        <Route path='/dashboard/attendance' element={<Attendance />}></Route>
        <Route path='/dashboard/profile' element={<Profile />}></Route>
        <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
        <Route path='/dashboard/update_employee/:id' element={<UpdateEmployee />}></Route>
        <Route path='/dashboard/viewleaves' element={<ViewLeaves />}></Route>
        <Route path='/dashboard/attendance/viewall' element={<ViewAllAttendance />}></Route>
        <Route path='/employeedashboard/employeeprofile' element={<EmployeeProfile />}></Route>
        <Route path='/employeedashboard/applyleaves' element={<EmployeeLeave />}></Route>
        <Route path='/employeedashboard/viewattendance' element={<ViewAttendance />}></Route>
        <Route path='/employeedashboard/applyleaves/viewleaves' element={<ViewStatus />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
