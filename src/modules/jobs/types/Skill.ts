export interface IResSkills {
   content: ISkill[];
   totalElements: number;
   totalPages: number;
}

export interface ISkill {
   createdAt: string;
   createdBy: string;
   id: number;
   isVerified: boolean;
   name: string;
   updatedAt: string;
   updatedBy: string;
}
