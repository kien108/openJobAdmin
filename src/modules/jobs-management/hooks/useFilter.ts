import moment from "moment";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Params {
   keyword?: string;
   majorId?: string;
   specializationId?: string;
}

const useFilterSearchJob = () => {
   const [searchParams] = useSearchParams();
   const [params, setParams] = useState<Params>({});

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
      searchParams.get("majorId")
         ? setParams((prev) => ({
              ...prev,
              majorId: searchParams.get("majorId")!.trim() ?? "",
           }))
         : setParams((prev) => {
              delete prev.majorId;
              return { ...prev };
           });

      searchParams.get("specializationId")
         ? setParams((prev) => ({
              ...prev,
              specializationId: searchParams.get("specializationId")!.trim() ?? "",
           }))
         : setParams((prev) => {
              delete prev.specializationId;
              return { ...prev };
           });
   }, [searchParams]);

   return params;
};

export default useFilterSearchJob;
