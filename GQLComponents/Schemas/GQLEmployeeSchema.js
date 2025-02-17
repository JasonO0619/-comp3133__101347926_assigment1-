const { gql } = require('apollo-server-express');

const employeeSchema = gql`
    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
        created_at: String!
        updated_at: String!
    }

    type Query {
        getAllEmployees: [Employee]
        getEmployeeById(eid: ID!): Employee
        getEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee]
    }

    type Mutation {
        addEmployee(
            first_name: String!
            last_name: String!
            email: String!
            gender: String!
            designation: String!
            salary: Float!
            date_of_joining: String!
            department: String!
            employee_photo: String
        ): Employee

        updateEmployeeById(
            eid: ID!
            first_name: String
            last_name: String
            designation: String
            salary: Float
            department: String
        ): Employee

        deleteEmployeeById(eid: ID!): String
    }
`;

module.exports = employeeSchema;
