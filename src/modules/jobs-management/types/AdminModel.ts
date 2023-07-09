export interface ICompanies {
   companies: ICompany[];
   totalElements: number;
   totalPages: number;
}

export interface ICompany {
   id: string;
   name: string;
   address: string;
   phone: string;
   totalEmployee: 0;
   description: string;
   logoUrl: string;
   wallpaperUrl: string;
   imageUrls: string[];
   isActive: true;
   companyType: string;
   memberType: string;
   scope: number;
   updatedAt: string;
   updatedBy: string;
   amountOfFreeCvViews: any;
   amountOfFreeJobs: any;
}

export interface IHrs {
   users: IHr[];
   totalElements: number;
   totalPages: number;
}

export interface IHr {
   id: string;
   email: string;
   firstName: string;
   lastName: string;
   role: string;
   isActive: boolean;
   avatarUrl: string;
   company: ICompany;
   password: string;
   reports: number;
}
