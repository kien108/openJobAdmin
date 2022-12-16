import moment from "moment";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Param {
   keyword?: string;
   company?: string;
}

const useFilterSearchJob = () => {
   const [searchParams] = useSearchParams();
   const [params, setParams] = useState<Param>({});

   useEffect(() => {
      searchParams.get("keyword")
         ? setParams((prev) => ({
              ...prev,
              keyword: searchParams.get("keyword")!.trim() ?? "",
           }))
         : setParams((prev) => {
              delete prev.keyword;
              return { ...prev };
           });
      searchParams.get("company")
         ? setParams((prev) => ({
              ...prev,
              company: searchParams.get("company")!.trim() ?? "",
           }))
         : setParams((prev) => {
              delete prev.company;
              return { ...prev };
           });
   }, [searchParams]);

   return params;
};

export default useFilterSearchJob;
