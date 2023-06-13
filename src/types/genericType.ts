export interface IResCommon<T> {
   status: boolean;
   message: string;
   data: {
      content: T;
      totalElements: number;
      totalPages: number;
      size: number;
   };
}

export interface IParamsCommon {
   [k: string]: number | string;
}
