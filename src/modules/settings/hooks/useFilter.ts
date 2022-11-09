import { useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";

const useFilter = () => {
   const [params, setParams] = useState<any>({});
   const [searchParams] = useSearchParams();

   const objectWithoutKey = (object: any, key: any) => {
      const { [key]: deletedKey, ...otherKeys } = object;
      return otherKeys;
   };

   useEffect(() => {
      searchParams.get("keyword")
         ? setParams((prev: any) => ({ ...prev, keyword: searchParams.get("keyword") }))
         : setParams((prev: any) => objectWithoutKey(prev, "keyword"));

      searchParams.get("byCompany")
         ? setParams((prev: any) => ({ ...prev, byCompany: searchParams.get("byCompany") }))
         : setParams((prev: any) => objectWithoutKey(prev, "byCompany"));
   }, [searchParams]);

   return params;
};
export default useFilter;
