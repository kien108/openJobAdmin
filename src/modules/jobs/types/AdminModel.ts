export interface IAdmin {
   admins: {
      role: string;
      id: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
      username: string;
      password: string;
   }[];
   totalElements: number;
   totalPages: number;
}

export interface IAdminDetail {
   firstName: string;
   id: string;
   isActive: boolean;
   lastName: string;
   password: string;
   role: "ADMIN";
   username: string;
}
