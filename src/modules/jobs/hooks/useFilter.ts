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
      searchParams.get("name")
         ? setParams((prev: any) => ({ ...prev, name: searchParams.get("name") }))
         : setParams((prev: any) => delete params["name"]);

      searchParams.get("specialization")
         ? setParams((prev: any) => ({
              ...prev,
              speId: searchParams.get("specialization"),
           }))
         : setParams((prev: any) => delete params["specialization"]);
   }, [searchParams.toString(), searchParams.get("specialization")]);

   return params;
};
export default useFilter;
