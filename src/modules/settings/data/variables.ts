import { v4 as uuidv4 } from "uuid";
const variables = [
   {
      id: uuidv4(),
      name: "name",
      description: "User name",
      marker: "[[name]]",
   },
   {
      id: uuidv4(),
      name: "company",
      description: "Company name",
      marker: "[[company]]",
   },
   {
      id: uuidv4(),
      name: "email",
      description: "Email",
      marker: "[[email]]",
   },
   {
      id: uuidv4(),
      name: "password",
      description: "Password",
      marker: "[[password]]",
   },
   {
      id: uuidv4(),
      name: "createDate",
      description: "createDate",
      marker: "[[createDate]]",
   },
   {
      id: uuidv4(),
      name: "sender",
      description: "Sender name",
      marker: "[[sender]]",
   },
   {
      id: uuidv4(),
      name: "recipient",
      description: "Recipient name",
      marker: "[[recipient]]",
   },
   {
      id: uuidv4(),
      name: "duration",
      description: "Duration",
      marker: "[[duration]]",
   },
   {
      id: uuidv4(),
      name: "fromDate",
      description: "From Date",
      marker: "[[fromDate]]",
   },
   {
      id: uuidv4(),
      name: "toDate",
      description: "To Date",
      marker: "[[toDate]]",
   },
   {
      id: uuidv4(),
      name: "cc",
      description: "CC",
      marker: "[[cc]]",
   },
];

export default variables;
