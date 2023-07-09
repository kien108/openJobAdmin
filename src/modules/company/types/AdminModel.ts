export interface ICompanies {
   companies: ICompany[];
   totalElements: number;
   totalPages: number;
}

export interface IUnapproveds {
   content: IUnapproved[];
   totalElements: 0;
   totalPages: 0;
}

export interface IUnapproved {
   companyName: string;
   createdAt?: string;
   createdBy?: string;
   email: string;
   headHunterName: string;
   id: string;
   phone: string;
   position: string;
   updatedAt?: string;
   updatedBy?: string;
}

export interface ICompany {
   id: any;
   name: any;
   address: any;
   phone: any;
   totalEmployee: any;
   description: any;
   logoUrl: any;
   wallpaperUrl: any;
   imageUrls: any[];
   isActive: true;
   companyType: any;
   memberType: any;
   scope: any;
   updatedAt: any;
   accountBalance: any;
   imageUrlsString: any;
   createdAt: any;
   updatedBy: any;
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
   phone: any;
   position: any;
}
