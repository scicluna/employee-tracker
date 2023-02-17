INSERT INTO department (name)
VALUES ("HR"),
       ("IT"),
       ("SALES");

INSERT INTO role (title, salary, department_id)
VALUES ("HR SPECIALIST", 50000, 1),
       ("FRONT DESK", 30000, 1),
       ("TECHNICIAN", 60000, 2),
       ("SENIOR TECHNICIAN", 120000, 2),
       ("SALES VP", 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 4, NULL),
       ("Bill", "Bob", 3, 1),
       ("Dim", "Dilly", 3, 1),
       ("Darcy", "Willis", 2, NULL),
       ("Jim", "Davis", 5, NULL),
       ("Yake", "Blake", 5, NULL),
       ("Yolanda", "Smith", 1, NULL);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

