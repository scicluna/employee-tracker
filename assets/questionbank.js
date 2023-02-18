const questionBank = {
    mainmenu: [
        {
            type: "list",
            name: "type",
            message: `WHAT WOULD YOU LIKE TO DO?`,
            choices: ["VIEW DEPARTMENTS", "VIEW ROLES", "VIEW EMPLOYEES", "ADD DEPARTMENT", "ADD ROLE", "ADD EMPLOYEE", "UPDATE EMPLOYEE"]
        }
    ],
    departmentadd: [
        {
            type: "input",
            name: "departmentName",
            message: "What is the new department called?"
        }
    ],
    roleadd: [
        {
            type: "input",
            name: "roleName",
            message: "What is the new role called?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?"
        },
    ],
    roleadd2: [      
        {
            type: "list",
            name: "type",
            message: "What Department do they belong to?",
            choices: ["Engineer", "Intern", "I'm done adding members"]
        }
    ],
    employeeadd: [
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
    ]
}


module.exports = questionBank
//THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database