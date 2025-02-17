const Employee = require('../../models/Employee');

const employeeResolvers = {
    Query: {
        getAllEmployees: async (parent, args) => {
            console.log(`Fetching all employees`);
            return await Employee.find({});
        },

        getEmployeeById: async (parent, args) => {
            console.log(`Fetching employee with doc ID: ${args.eid}`);
            const emp = await Employee.findById(args.eid);
            if (!emp) throw new Error("Employee not found");
            return emp;
        },

        getEmployeeByDesignationOrDepartment: async (parent, args) => {
            console.log(`Fetching employees by Designation: ${args.designation}, Department: ${args.department}`);

            let query = {};
            if (args.designation) query.designation = new RegExp(args.designation, 'i');
            if (args.department) query.department = new RegExp(args.department, 'i');

            const employees = await Employee.find(query);
            if (!employees.length) throw new Error("No employees found with the given criteria.");
            return employees;
        },
       
    },

    Mutation: {
        addEmployee: async (parent, args) => {
            console.log(`Trying to insert employee with email: ${args.email}`);

            let genderToAdd = args.gender ? args.gender.charAt(0).toUpperCase() + args.gender.slice(1).toLowerCase() : "Other";


            let newEmployee = new Employee({
                first_name: args.first_name,
                last_name: args.last_name,
                email: args.email,
                gender: genderToAdd,
                city: args.city,
                designation: args.designation,
                salary: args.salary,
                date_of_joining: args.date_of_joining,
                department: args.department,
                employee_photo: args.employee_photo
            });

            return await newEmployee.save();
        },

        updateEmployeeById: async (parent, args) => {
            try {
                if (!args.eid) {
                    console.log("Error: Employee ID is required for update.");
                    throw new Error("Employee ID is required for update.");
                }
        
                console.log(`Trying to update employee with ID: ${args.eid}`);
        
                let genderToUpdate = args.gender
                    ? args.gender.charAt(0).toUpperCase() + args.gender.slice(1).toLowerCase()
                    : undefined; 
        
                const updateFields = {};
        
                
                if (args.first_name) updateFields.first_name = args.first_name;
                if (args.last_name) updateFields.last_name = args.last_name;
                if (args.email) updateFields.email = args.email;
                if (args.city) updateFields.city = args.city;
                if (args.designation) updateFields.designation = args.designation;
                if (args.salary) updateFields.salary = args.salary;
                if (args.department) updateFields.department = args.department;
                if (genderToUpdate) updateFields.gender = genderToUpdate;
                if (args.employee_photo) updateFields.employee_photo = args.employee_photo;
        
                const updatedEmployee = await Employee.findByIdAndUpdate(
                    args.eid,
                    { $set: updateFields },
                    { new: true, runValidators: true } 
                );
        
                if (!updatedEmployee) {
                    console.log(`No employee found with ID: ${args.eid}`);
                    throw new Error("Employee not found");
                }
        
                console.log(`Employee updated successfully: ${JSON.stringify(updatedEmployee)}`);
                return updatedEmployee;
            } catch (error) {
                console.error(`Error updating employee: ${error.message}`);
                throw new Error("Error updating employee. " + error.message);
            }
        },
        

        deleteEmployeeById: async (parent, args) => {
            if (!args.eid) {
                console.log(`ID not provided`);
                throw new Error("Please provide employee ID to delete");
            }

            console.log(`Trying to delete employee ID: ${args.eid}`);

            const emp = await Employee.findByIdAndDelete(args.eid);
            if (!emp) {
                throw new Error("Employee not found");
            }

            return "Employee deleted successfully";
        }
    }
};

module.exports = employeeResolvers;
