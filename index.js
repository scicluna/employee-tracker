const inquirer = require("inquirer")
const mysql = require("mysql2");
const cTable = require("console.table")
const questionBank = require("./assets/questionbank")


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'starStarstar552!',
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
        console.log(departmentName)
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
                inquirer.prompt([
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
                    managers = [...managers, "null"]
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
                        if (manager === "null"){
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