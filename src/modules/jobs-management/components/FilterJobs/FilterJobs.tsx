import { Button, Input, SearchIcon, Select } from "../../../../libs/components";
import { Col, Row, Spin } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import { useDebounce } from "../../../../libs/common";
import {
   useGetCompaniesQuery,
   useGetMajorsQuery,
   useGetSpecializationsQuery,
} from "../../services";

const FilterCompany = () => {
   const { t } = useTranslation();

   const [searchParams, setSearchParams] = useSearchParams();
   const [options, setOptions] = useState<any>([]);
   const [provinces, setProvinces] = useState<any>([]);
   const [majors, setMajors] = useState<any>([]);
   const [specializations, setSpecializations] = useState<any>([]);
   const [searchLocation, setSearchLocation] = useState<any>("");

   const searchProvinceDebounce = useDebounce(searchLocation, 300);

   const defaultValues = useMemo(
      () => ({
         keyword: searchParams.get("keyword"),
         company: searchParams.get("company"),
         majorId: searchParams.get("majorId"),
         specializationId: searchParams.get("specializationId"),
      }),
      [searchParams]
   );

   const {
      data: dataCompanies,
      isLoading: loadingCompanies,
      isFetching: fetchingCompanies,
   } = useGetCompaniesQuery({ page: 0, size: 99 });

   const form = useForm({ defaultValues });

   const {
      data: dataMajors,
      isLoading: loadingMajors,
      isFetching: fetchingMajors,
   } = useGetMajorsQuery({});
   const {
      data: dataSpecializations,
      isLoading: loadingSpecializations,
      isFetching: fetchingSpecializations,
   } = useGetSpecializationsQuery(
      {},
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const setValueToSearchParams = (name: string, value: string) => {
      if (value) {
         searchParams.set(name, value);
         setSearchParams(searchParams);
      } else {
         searchParams.delete(name);
         setSearchParams(searchParams);
      }
   };

   const handleOnChange = debounce(setValueToSearchParams, 500);

   useEffect(() => {
      const options = dataMajors?.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => <span>{item?.name}</span>,
      }));

      setMajors(options || []);
   }, [dataMajors]);

   useEffect(() => {
      const options = dataSpecializations?.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => <span>{item?.name}</span>,
      }));

      setSpecializations(options || []);
   }, [dataSpecializations]);

   useEffect(() => {
      if (!dataCompanies) return;

      const options = (dataCompanies?.companies ?? [])?.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => <span>{item?.name}</span>,
      }));

      setProvinces(options);
   }, [dataCompanies]);
   return (
      <FormProvider {...form}>
         <Row gutter={[30, 30]} align="middle">
            <Col span={8}>
               <Input
                  className="search"
                  title={t("companyName")}
                  placeholder="Company name, job title"
                  icons={<SearchIcon width={20} />}
                  name="keyword"
                  onChange={(e: any) => {
                     form.setValue("keyword", e.target.value);
                     handleOnChange("keyword", e.target.value);
                  }}
               />
            </Col>
            <Col span={8}>
               <Spin spinning={loadingMajors || fetchingMajors}>
                  <Select
                     name="majorId"
                     label="Major"
                     required
                     options={majors || []}
                     loading={loadingMajors || fetchingMajors}
                     onChange={(value) => {
                        setValueToSearchParams("majorId", value);
                        form.setValue("majorId", value);
                     }}
                  />
               </Spin>
            </Col>
            <Col span={8}>
               <Spin spinning={loadingSpecializations || fetchingSpecializations}>
                  <Select
                     required
                     name="specializationId"
                     label="Specialization"
                     options={specializations || []}
                     loading={loadingSpecializations || fetchingSpecializations}
                     onChange={(value) => {
                        setValueToSearchParams("specializationId", value);
                        form.setValue("specializationId", value);
                     }}
                  />
               </Spin>
            </Col>
            {/* <Col span={6}>
               <Select
                  name="company"
                  label={t("Company")}
                  required
                  showSearch
                  options={provinces || []}
                  onSearch={(value) => setSearchLocation(value)}
                  onChange={(value) => handleOnChange("company", value)}
                  loading={loadingCompanies || fetchingCompanies}
               />
            </Col> */}
         </Row>
      </FormProvider>
   );
};

export default FilterCompany;
