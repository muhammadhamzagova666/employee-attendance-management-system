import express from "express";
import jwt from "jsonwebtoken";
import con from "../utils/db.js";

const router = express.Router();

router.get("/getAllAttendance/:id", (req, res) => {
  const sql =`
      SELECT 
      a.id,
      e.name,
      TIME_FORMAT(a.in_time, '%H:%i:%s') as in_time,
      DATE_FORMAT(a.attendance_date, '%Y-%m-%d') as date,
      a.status
      FROM attendance a 
      join employees e on e.id=a.id
      join departments d on e.department_id=d.id
      where d.manager_id = ? 
      order by date desc;
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json(result);
  });
});

router.post("/updateAttendance/:id", (req, res) => {
  const { date, action } = req.body;
  const sql =`
      UPDATE attendance 
      SET status = ?
      WHERE id = ? AND DATE_FORMAT(attendance_date, '%Y-%m-%d') = ?;
    `;
  con.query(sql, [action, req.params.id, date], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json({ message: "Attendance updated successfully" });
  });
});

router.get("/getAttendance/:id", (req, res) => {
  const sql =`
      SELECT 
      a.id,
      e.name,
      TIME_FORMAT(a.in_time, '%H:%i:%s') as in_time,
      DATE_FORMAT(a.attendance_date, '%Y-%m-%d') as date,
      a.status
      FROM attendance a 
      join employees e on e.id=a.id
      join departments d on e.department_id=d.id
      where d.manager_id = ? and a.status ='-';
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json(result);
  });
});

router.get("/requestattendance/:id", (req, res) => {
  const { id } = req.params;
  const sql = "INSERT INTO attendance (id) VALUES (?)";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json({ message: "Attendance marked successfully" });
  });
});

router.post("/updateemployee/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, address } = req.body;
  const sql =
    "UPDATE employees SET name = ?, email = ?, password = ?, address = ? WHERE id = ?";

  con.query(sql, [name, email, password, address, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json({ message: "Employee updated successfully" });
  });
});

router.get("/getallemployeeinfo/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * from employees where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json(result[0]);
  });
});

router.get("/getemployeeinfo/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT e.salary , e.address , j.title as jobtitle, d.name as departmentname FROM employees e join jobs j on e.job_id=j.id join departments d on e.department_id=d.id WHERE e.id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json(result[0]);
  });
});

router.get("/getattendancepercentagewrtemployee/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT
      id,
      COALESCE((COUNT(CASE WHEN status = 'P' THEN 1 END) / NULLIF(COUNT(*), 0)) * 100, 0) AS attendance_percentage
    FROM
      attendance
    WHERE
      id = ?
    GROUP BY
      id;
  `;
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Query error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "No attendance records found for the employee." });
    }
    const percentage = result[0].attendance_percentage;
    res.json(percentage);
  });
});


router.get("/getattendancewrtemployee/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT DATE_FORMAT(attendance_date, '%Y-%m-%d') as date, status FROM attendance WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json(result);
  });
});

router.post("/updateleave/:id", (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const sql = "UPDATE leaves SET status = ? WHERE id = ?";

  con.query(sql, [action, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json({ message: "Leave status updated successfully" });
  });
});

router.get("/getleaveswrtmanager/:id", (req, res) => {
  const sql =
    "SELECT l.id, l.employee_id, DATE_FORMAT(l.start_date, '%Y-%m-%d') as start_date, DATE_FORMAT(l.end_date, '%Y-%m-%d') as end_date, l.reason, l.status FROM leaves l join employees e on e.id=l.employee_id join departments d on d.id=e.department_id WHERE d.manager_id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json(result);
  });
});

router.get("/getleaves/:id", (req, res) => {
  const sql =
    "SELECT id, employee_id, DATE_FORMAT(start_date, '%Y-%m-%d') as start_date, DATE_FORMAT(end_date, '%Y-%m-%d') as end_date, reason, status FROM leaves WHERE employee_id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json(result);
  });
});

router.post("/addleave", (req, res) => {
  const { id, startDate, endDate, reason } = req.body;
  const sql =
    "INSERT INTO leaves (employee_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)";

  con.query(sql, [id, startDate, endDate, reason], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query error" });
    }
    res.json({ message: "Leave applied successfully" });
  });
});

router.post("/updatemanager/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const sql = "UPDATE admin SET name = ?, email = ?, password = ? WHERE id = ?";

  con.query(sql, [name, email, password, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Query error" });
    res.json({ message: "Manager updated successfully" });
  });
});

router.get("/getmanager/:id", (req, res) => {
  const sql = "SELECT * FROM admin WHERE id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Query error" });
    res.json(result);
  });
});

router.get("/getemployeesattendancepercentage/:id", (req, res) => {
  const sql = `
    SELECT
      e.id,
      e.name,
      COALESCE(ROUND((COUNT(a.id) / NULLIF((SELECT COUNT(*) FROM attendance WHERE id = e.id), 0)) * 100, 2), 0) AS attendance_percentage
    FROM
      employees e
    LEFT JOIN
      attendance a ON e.id = a.id AND a.status = 'P'
    JOIN
      departments d ON e.department_id = d.id
    WHERE
      d.manager_id = ?
    GROUP BY
      e.id, e.name;
  ;
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Query error" });
    res.json(result);
  });
});

router.get("/getleavescount/:id", (req, res) => {
  const sql =
    "SELECT count(*) as count FROM employees e join departments d on e.department_id=d.id join leaves l on e.id=l.employee_id where d.manager_id = ? and l.status = 'Under Review';";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }
    return res.json(result[0]);
  });
});

router.get("/getmanagercount", (req, res) => {
  const sql = "SELECT count(*) as count FROM admin";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }
    return res.json(result[0]);
  });
});

router.get("/getemployeessalary/:id", (req, res) => {
  const sql =
    "SELECT sum(salary) as count FROM employees e join departments d on e.department_id=d.id where d.manager_id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }
    return res.json(result[0]);
  });
});

router.get("/getemployeescount/:id", (req, res) => {
  const sql =
    "SELECT COUNT(*) as count FROM employees e join departments d on e.department_id=d.id where d.manager_id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }
    return res.json(result[0]);
  });
});

router.get("/getemployeesattendance/:id", (req, res) => {
  const sql =
    "SELECT e.id, e.name, DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS dates, a.status AS statuses FROM employees e LEFT JOIN attendance a ON a.id=e.id JOIN departments d ON e.department_id=d.id WHERE d.manager_id = ?;";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Query error" });

    // Group the attendance records by employee
    const employees = {};
    result.forEach((record) => {
      if (!employees[record.id]) {
        employees[record.id] = {
          id: record.id,
          name: record.name,
          dates: {},
        };
      }
      employees[record.id].dates[record.dates] = record.statuses;
    });

    res.json(Object.values(employees));
  });
});

router.post("/saveattendance", (req, res) => {
  const employees = req.body;
  const queries = [];

  for (const employee of employees) {
    const { id, dates } = employee;

    for (const date in dates) {
      const status = dates[date];

      const sql = `INSERT IGNORE INTO attendance (id, attendance_date, status) VALUES (?, ?, ?)`;
      const values = [id, date, status];

      const query = new Promise((resolve, reject) => {
        con.query(sql, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      queries.push(query);
    }
  }

  Promise.all(queries)
    .then(() => {
      res.json({ message: "Attendance saved successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Query error" });
    });
});

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({
        loginStatus: true,
        designation: "Manager",
        id: result[0].id,
        name: result[0].name,
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: "wrong email or password or designation",
      });
    }
  });
});

router.post("/employeelogin", (req, res) => {
  const sql = "SELECT * from employees Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "employee", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({
        loginStatus: true,
        designation: "Employees",
        id: result[0].id,
        name: result[0].name,
      });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

router.post("/add_employee", (req, res) => {
  const { name, email, password, salary, address, job_id, department_id } =
    req.body;
  const sql = `INSERT INTO employees(name, email, password, salary, address, job_id ,department_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    name,
    email,
    password,
    salary,
    address,
    job_id,
    department_id,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }

    return res.json({ Status: true });
  });
});

router.get("/getemployees/:id", (req, res) => {
  const sql =
    "SELECT e.id,e.name,e.email,e.salary,e.address,e.job_id,e.department_id FROM employees e join departments d on e.department_id=d.id where d.manager_id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }

    return res.json(result);
  });
});

router.get("/getjobs", (req, res) => {
  const sql = "SELECT * FROM jobs";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }

    return res.json(result);
  });
});

router.get("/getdepartments", (req, res) => {
  const sql = "SELECT id,name FROM departments";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }

    return res.json(result);
  });
});

router.delete("/delete_employee/:id", (req, res) => {
  const sql = "DELETE FROM employees WHERE id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }

    return res.json({ Status: true });
  });
});

router.get("/getemployee/:id", (req, res) => {
  const sql = "SELECT * FROM employees WHERE id = ?";

  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }

    return res.json(result[0]);
  });
});

router.put("/update_employee/:id", (req, res) => {
  const { name, email, password, salary, address, job_id, department_id } =
    req.body;
  const sql = `UPDATE employees SET name = ?, email = ?, password = ?, salary = ?, address = ?, job_id = ?, department_id = ? WHERE id = ?`;
  const values = [
    name,
    email,
    password,
    salary,
    address,
    job_id,
    department_id,
    req.params.id,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ Status: false, Error: err.message });
    }

    return res.json({ Status: true });
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");

  res.json({ Status: true, message: "Logged out successfully" });
});

export { router as adminRouter };
