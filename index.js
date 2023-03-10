const inquirer = require("inquirer")
const mysql = require("mysql2");
const questionBank = require("./assets/questionbank")
const cTable = require('console.table')
require('dotenv').config()

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.PASSWORD,
      database: 'employee_db'
    },
    console.log(`Connected to the movies_db database.`)
  );

function init(){
    mainMenu(questionBank)
}
init()

function mainMenu({mainmenu}){
    inquirer.prompt(mainmenu)
    .then(data => {
        pickOption(data)
    })
}

function pickOption({type}){
    switch(type){
        case "VIEW DEPARTMENTS": viewDepartments()
        break;

        case "VIEW ROLES": viewRoles()
        break;

        case "VIEW EMPLOYEES": viewEmployees()
        break;

        case "ADD DEPARTMENT": addDepartment(questionBank)
        break;

        case "ADD ROLE": addRole(questionBank)
        break;

        case "ADD EMPLOYEE": addEmployee(questionBank)
        break;

        case "UPDATE EMPLOYEE": updateEmployee()
        break;

        case "VIEW EMPLOYEES BY MANAGER": viewEmployeesByManager()
        break;

        case "VIEW EMPLOYEES BY DEPARTMENT": viewEmployeesByDepartment()
        break;

        case "VIEW DEPARTMENT BUDGET": viewDepartmentBudget()
        break;

        case "UPDATE EMPLOYEE MANAGER": updateEmployeeManager()
        break;

        case "DELETE DEPARTMENT": deleteDepartment()
        break;

        case "DELETE ROLE": deleteRole()
        break;

        case "DELETE EMPLOYEE": deleteEmployee()
        break;

        case "EXIT": process.exit()

        default: break;
    }
}


function viewDepartments(){
    const view = `SELECT * FROM department`
    db.query(view, (err, results)=>{
        if (err) {
            console.log(err);
            }
            console.table('',results)
            mainMenu(questionBank)
    })
}

function viewRoles(){
    const view = `SELECT title, role.id, department.name AS department, salary FROM role JOIN department ON role.department_id = department.id`
    db.query(view, (err, results)=>{
        if (err) {
            console.log(err);
            }
            console.table('',results)
            mainMenu(questionBank)
    })
}

function viewEmployees(){
    const view = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager FROM employee LEFT JOIN employee AS manager ON employee.manager_id = manager.id INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id ORDER BY employee.id`
    db.query(view, (err, results)=>{
        if (err) {
            console.log(err);
            }
            console.table('',results)
            mainMenu(questionBank)
    })
}

function addDepartment({departmentadd}){
    inquirer.prompt(departmentadd)
    .then(data => {
        const {departmentName} = data
        const add = `INSERT INTO department (name) VALUES (?)`
        db.query(add, departmentName, (err, results) => {
            if (err) {
                console.log(err);
                }
                console.log(results)
                mainMenu(questionBank)
        })
    })
}

function addRole({roleadd}){
    db.query(`SELECT * FROM department`, (err, res) => {
        inquirer.prompt(roleadd)
        .then(data => {
            const {roleName, salary} = data
            const names = res.map(re=>re.name)
            inquirer.prompt([      
                {
                    type: "list",
                    name: "department",
                    message: "What Department do they belong to?",
                    choices: names
                }
            ])
            .then(data => {
                const add = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
                db.query(add, [roleName, salary, names.indexOf(data.department)+1], (error, results) =>{
                    if (error) console.log(error)
                    console.log(results)
                    mainMenu(questionBank)
                })
            })
        })
    })
}

function addEmployee({employeeadd}){
    db.query(`SELECT * FROM employee`, (err, emp) => {
        db.query(`SELECT * FROM role`, (err2, role)=>{
            inquirer.prompt(employeeadd)
            .then(data => {
                const {firstName, lastName} = data
                const roles = role.map(role=>role.title)
                inquirer.prompt([ //can return this?
                    {
                        type: "list",
                        name: "role",
                        message: "Which role do they have?",
                        choices: roles
                    }
                ])
                .then(data2 => {
                    const {role} = data2
                    let managers = emp.map(emp=>emp.first_name)
                    managers = [...managers, "No Manager"]
                    inquirer.prompt([
                        {
                            type:"list",
                            name: "manager",
                            message: "Who is their manager?",
                            choices: managers
                        }
                    ])
                    .then(data3 => {
                        let {manager} = data3
                        let managerId;
                        if (manager === "No Manager"){
                            managerId = null
                        } else managerId = managers.indexOf(manager)+1
                        
                        const add = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
                        db.query(add, [firstName, lastName, roles.indexOf(role)+1, managerId], (err3, results) =>{
                            if (err3) console.log(err3)
                            console.log(results)
                            mainMenu(questionBank)
                        })
                    })
                })
            })
        })
    })
}

function updateEmployee(){
    db.query(`SELECT * FROM employee`, (err, emp) => {
        db.query(`SELECT * FROM role`, (err, role)=>{
            const employees = emp.map(emp=>emp.first_name)
            const roles = [...role.map(role=>role.title), "nevermind"]
            inquirer.prompt([{
                type: "list",
                name: "employee",
                message: "Which employee would you like to change roles for?",
                choices: employees
            },
            {
                type:"list",
                name:"role",
                message:"Which role would you like the employee to be reassigned to?",
                choices: roles
            }])
            .then(data => {
                const {employee, role} = data
                if(role == "nevermind") mainMenu(questionBank)
                const update = `UPDATE employee SET role_id = ? WHERE employee.id = ?`
                db.query(update, [roles.indexOf(role)+1, employees.indexOf(employee)+1], (err, result) => {
                    if (err) console.log(err)
                    console.log(result)
                    mainMenu(questionBank)
                })
            })
        })
    })
}

function viewEmployeesByManager(){
    db.query(`SELECT * FROM employee`, (err, emp) => {
        const employees = emp.map(emp=>emp.first_name)
        const employeeIds = emp.map(emp=>emp.id)
        const managerIds = emp.map(emp=>emp.manager_id)
        const managers = []
            managerIds.forEach(id=>{
            if (id == null) return
            if (!managers.includes(employees[id-1]))managers.push(employees[id-1])
        })
        const managerIdTracker = []
            managers.forEach(manager=>{
                employees.forEach((employee, i)=>{
                    if (manager == employee) managerIdTracker.push(i)
                })
            })

        inquirer.prompt({
            type: "list",
            name: "manager",
            message: "Which manager's employees would you like to view?",
            choices: managers
        })
        .then(data => {
            const {manager} = data
            const query = `SELECT first_name, last_name, role.title FROM employee JOIN role ON role.id = employee.role_id WHERE manager_id = ?`
            db.query(query, employeeIds[employees.indexOf(manager)], (err, results) =>{
                if (err) console.log(err)
                console.table('',results)
                mainMenu(questionBank)
            })
        })
    })
}

function viewEmployeesByDepartment(){
    db.query(`SELECT * FROM department`, (err, dep) => {
        const departments = dep.map(dep=>dep.name)
        inquirer.prompt([{
            type: "list",
            name: "department",
            message: "Which department would you like to view?",
            choices: departments
        }])
        .then(data => {
            const {department} = data
            const departmentID = departments.indexOf(department)+1
            const sql = `SELECT first_name AS employees FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department ON role.department_id = department.id  WHERE employee.role_id = role.id AND role.department_id = ?`
            db.query(sql, departmentID, (err, results) => {
                if (err) console.log(err)
                console.table('',results)
                mainMenu(questionBank)
            })
        })
    })
}

function updateEmployeeManager(){
    db.query(`SELECT * FROM employee`, (err, emp) => {
        const employees = emp.map(emp=>emp.first_name)
        inquirer.prompt({
            type: "list",
            name: "employee",
            message: "Which employee's manager would you like to update?",
            choices: employees
        })
        .then(data => {
            const {employee} = data
            const potentialManagers = employees.filter(emp=>emp != employee)
            inquirer.prompt({
                type: "list",
                name: "manager",
                message: "Who is their new manager?",
                choices: potentialManagers
            })
            .then(data => {
                const {manager} = data
                const managerId = employees.indexOf(manager)+1
                const sql = `UPDATE employee SET manager_id = ? WHERE employee.first_name = ?`
                db.query(sql, [managerId, employee], (err, results) => {
                    if (err) console.log(err)
                    console.log(results)
                    mainMenu(questionBank)
                })
            })
        })
    })
}

function deleteDepartment(){
    db.query(`SELECT * FROM department`, (err, dep) => {
        const departments = [...dep.map(dep=>dep.name), "BACK"]
        inquirer.prompt({
            type:"list",
            name: "department",
            message: "Which department would you like to delete? (Warning, this will delete all roles and employees that belong to this department.)",
            choices: departments
        })
        .then(data=>{
            const remove = `DELETE FROM department WHERE id = ?`
            const {department} = data
            if (department == "BACK") return mainMenu(questionBank)
            const departmentId = departments.indexOf(department)+1
            db.query(remove, departmentId, (err, results) => {
                if (err) console.log(err)
                console.log(results)
                mainMenu(questionBank)
            })
        })
    })
}

function deleteRole(){
    db.query(`SELECT * FROM role`, (err, rol) => {
        const roles = [...rol.map(rol=>rol.title), "BACK"]
        inquirer.prompt({
            type:"list",
            name: "role",
            message: "Which role would you like to delete? (Warning, this will delete all employees that possess that role.)",
            choices: roles
        })
        .then(data=>{
            const remove = `DELETE FROM role WHERE id = ?`
            const {role} = data
            if (role == "BACK") return mainMenu(questionBank)
            const roleId = roles.indexOf(role)+1
            db.query(remove, roleId, (err, results) => {
                if (err) console.log(err)
                console.log(results)
                mainMenu(questionBank)
            })
        })
    })
}

function deleteEmployee(){
    db.query(`SELECT * FROM employee`, (err, emp) => {
        const employees = [...emp.map(emp=>emp.first_name), "BACK"]
        inquirer.prompt({
            type:"list",
            name: "employee",
            message: "Which employee would you like to delete?",
            choices: employees
        })
        .then(data=>{
            const remove = `DELETE FROM employee WHERE id = ?`
            const {employee} = data
            if (employee == "BACK") return mainMenu(questionBank)
            const employeeId = employees.indexOf(employee)+1
            db.query(remove, employeeId, (err, results) => {
                if (err) console.log(err)
                console.log(results)
                mainMenu(questionBank)
            })
        })
    })
}

function viewDepartmentBudget(){
    db.query(`SELECT * FROM department`, (err, dep) => {
        const departments = dep.map(dep=>dep.name)
        inquirer.prompt({
            type: "list",
            name: "department",
            message: "Which department's budget would you like to view?",
            choices: departments
        })
        .then(data => {
            const {department} = data
            const sql = `SELECT SUM(role.salary) AS  "${department} budget" FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department ON role.department_id = department.id WHERE department.name = ? `
            db.query(sql, department, (err, results) => {
                if (err) console.log(err)
                console.table('',results)
                mainMenu(questionBank)
            })
        })
    })
}
