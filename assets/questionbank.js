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
            message: "Would you like to add an Engineer or Intern?",
            choices: ["Engineer", "Intern", "I'm done adding members"]
        }
    ]
}


module.exports = questionBank
//THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database