import { v4 as uuidv4 } from "uuid";
const variables = [
   {
      id: uuidv4(),
      name: "userName",
      description: "Tên đăng nhập",
      marker: "[[userName]]",
   },
   {
      id: uuidv4(),
      name: "companyName",
      description: "Tên công ty",
      marker: "[[companyName]]",
   },
   {
      id: uuidv4(),
      name: "jobTitle",
      description: "Tiêu đề",
      marker: "[[jobTitle]]",
   },
];

export default variables;
