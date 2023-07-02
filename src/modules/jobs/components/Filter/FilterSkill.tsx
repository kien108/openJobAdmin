import { Col, Row } from "antd";
import React from "react";

import { Input, SearchIcon, Select } from "../../../../libs/components";
import { FormProvider, useForm } from "react-hook-form";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";
import { useGetSpecializationsQuery } from "../../services";

const FilterSkill = () => {
   const [searchParams, setSearchParams] = useSearchParams();

   const form = useForm({});

   const {
      data: dataFilterSpec,
      isLoading: loadingFilterSpec,
      isFetching: fetchingFilterSpec,
   } = useGetSpecializationsQuery(
      {},
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const setValueToSearchParams = (name: string, value: string) => {
      console.log({ value });
      if (value) {
         searchParams.set(name, value);
         setSearchParams(searchParams);
      } else {
         searchParams.delete(name);
         setSearchParams(searchParams);
      }
   };

   const handleOnChange = debounce(setValueToSearchParams, 500);

   return (
      <FormProvider {...form}>
         <Row gutter={[20, 20]} align="middle">
            <Col span={16}>
               <Input
                  placeholder="Tên kỹ năng"
                  icons={<SearchIcon width={20} />}
                  name="name"
                  onChange={(e: any) => {
                     form.setValue("name", e.target.value);
                     handleOnChange("name", e.target.value.trim());
                  }}
               />
            </Col>

            <Col span={8}>
               <Select
                  name="specialization"
                  label="Chuyên môn"
                  required
                  loading={fetchingFilterSpec}
                  options={(dataFilterSpec ?? []).map((item: any) => ({
                     key: item.id,
                     label: item.name,
                     value: item.id,
                     render: () => item.name,
                  }))}
                  onChange={(value) => {
                     setValueToSearchParams("specialization", value);
                     form.setValue("specialization", value);
                  }}
               />
            </Col>
         </Row>
      </FormProvider>
   );
};

export default FilterSkill;
