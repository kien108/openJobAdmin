export interface IResJobs {
   jobs: IJob[];
   totalElements: number;
   totalPages: number;
}

export interface IJob {
   createdAt: string;
   createdBy: string;
   description: string;
   expiredAt: string;
   hoursPerWeek: string;
   id: string;
   jobLevel: string;
   jobSkills: IJobSkill[];
   jobType: string;
   quantity: number;
   salaryInfo: {
      isSalaryNegotiable: boolean;
      maxSalary: number;
      minSalary: number;
      salaryType: string;
   };
   title: string;
   updatedAt: string;
   updatedBy: string;
   workPlace: string;
   major: {
      id: number;
      name: string;
   };
   specialization: {
      id: number;
      name: string;
   };
}

export interface IJobSkill {
   id: number;
   required: boolean;
   skill: {
      createdAt: string;
      createdBy: string;
      id: number;
      isVerified: boolean;
      name: string;
      updatedAt: string;
      updatedBy: string;
   };
   yoe: string;
   weight: number;
}

export interface IJobRecord extends IJob {
   key: string;
}
