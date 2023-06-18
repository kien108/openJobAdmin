import React, { FC, ReactNode, useEffect, useRef, useState } from "react";

import {
   Button,
   GetImage,
   Input,
   openNotification,
   OptionType,
   Select,
   Switch,
   UploadMultiple,
   UploadSingle,
} from "../../../../libs/components";

import { GroupButton, StyledCreateAndEditHr, StyledExtendOption, StyledNotFound } from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm, useFieldArray } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Col, Divider, Row, Spin } from "antd";
import {
   useActivateMutation,
   useCreateHeadHunterMutation,
   useGetByIdQuery,
   useGetCompaniesQuery,
   useGetListDistrictsQuery,
   useGetProvincesQuery,
   useUpdateHrMutation,
} from "../../services";

import { useDebounce, useGetAdminByIdQuery } from "../../../../libs/common";
import { useSearchParams } from "react-router-dom";

import { EmailVariables } from "../EmailVariables";
import { Title } from "../Title";

import { HiInformationCircle } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { ECompanyType, EMemberTypes } from "../../../../types";
import moment from "moment";

interface ICreateAndEditAdmin {
   handleClose: () => void;
}

interface FormType {
   firstName: any;
   email: any;
   companyName: any;
   isActive: any;
   accountBalance: number;
   province: any;
   district: any;
   avatar: any;
   scope: any;
   companyPhone: any;
   description: any;
   phone: any;
   position: any;
   company_type: any;
   member_type: any;
   extraAddress: any;
   imgs: any;
}
const CreateAndEditHr: FC<ICreateAndEditAdmin> = ({ handleClose }) => {
   const { t } = useTranslation();
   const [searchParams, setSearchParams] = useSearchParams();

   const [message, setMessage] = useState<string | undefined>(undefined);
   const [isEdit, setEdit] = useState<boolean>(false);
   const contentRef = useRef<any>(undefined);
   const [avatar, setAvatar] = useState<any>();
   const [imgs, setImgs] = useState<any>();
   const [formReset, setFormReset] = useState<boolean>(false);

   const [districts, setDistricts] = useState<any>([]);
   const [provinces, setProvinces] = useState<any>([]);
   const [searchProvince, setSearchProvince] = useState<any>("");
   const [searchDistrict, setSearchDistrict] = useState<any>("");

   const searchProvinceDebounce = useDebounce(searchProvince, 300);

   const searchDistrictDebounce = useDebounce(searchDistrict, 300);

   const form = useForm<FormType>({
      defaultValues: {
         firstName: "",
         email: "",
         companyName: "",
         isActive: true,
         accountBalance: 0,
         province: "",
         district: "",
         avatar: "",
         scope: "",
         companyPhone: "",
         description: "",
         phone: "",
         position: "",
         company_type: "",
         member_type: "",
         extraAddress: "",
         imgs: [],
      },
      resolver: yupResolver(
         yup.object({
            firstName: isEdit
               ? yup.string()
               : yup.string().trim().required(t("common:form.required")),
            companyName: isEdit
               ? yup.string()
               : yup.string().trim().required(t("common:form.required")),
            email: isEdit
               ? yup.string()
               : yup.string().email(t("common:form.email")).required(t("common:form.required")),
            isActive: yup.boolean(),
         })
      ),
   });

   const { fields, remove } = useFieldArray({
      name: "imgs",
      control: form.control,
   });

   const {
      data: dataProvinces,
      isLoading: loadingProvince,
      isFetching: fetchingProvinces,
   } = useGetProvincesQuery(
      { keyword: searchProvinceDebounce },
      { refetchOnMountOrArgChange: true }
   );

   const {
      data: dataDistricts,
      isLoading: loadingDistricts,
      isFetching: fetchingDistricts,
   } = useGetListDistrictsQuery(
      { keyword: searchDistrictDebounce, province: form.watch("province") },
      { refetchOnMountOrArgChange: true, skip: !form.watch("province") }
   );

   const [checkedStatus, setCheckedStatus] = useState<boolean>(form.getValues("isActive"));

   const [createHeadHunter, { isLoading: loadingCreate }] = useCreateHeadHunterMutation();

   const [updateHr, { isLoading: loadingUpdate }] = useUpdateHrMutation();

   const { data: dataAccount, isFetching: loadingAccount } = useGetByIdQuery(
      searchParams.get("id")!,
      {
         skip: !searchParams.get("id"),
         refetchOnMountOrArgChange: true,
      }
   );

   function isBase64(str: any) {
      const base64Regex = /^(data:image\/[a-z]+;base64,)?[A-Za-z0-9+/=]+$/;
      return base64Regex.test(str);
   }

   const onSubmit = (data: any) => {
      const { companyName, ...dataBody } = data;

      const base64Imgs = imgs?.filter((item: any) => isBase64(item?.url || item?.thumbUrl));
      const existImgs = imgs?.filter((item: any) => !isBase64(item?.url || item?.thumbUrl));
      const payload = {
         ...dataAccount,
         company: {
            ...dataAccount?.company,
            accountBalance: data?.accountBalance,
            address: `${data?.extraAddress},${data?.district},${data?.province}`,
            base64Images: (base64Imgs ?? [])?.map((item: any) => item?.url || item?.thumbUrl),
            imageUrlsString: (existImgs ?? [])
               ?.map((item: any) => item?.url || item?.thumbUrl)
               ?.join(", "),
            companyType: data?.company_type,
            description: data?.description,
            isActive: checkedStatus,
            logoUrl: avatar?.[0]?.url || avatar?.[0]?.thumbUrl,
            memberType: data?.member_type,
            name: data?.companyName,
            phone: data?.companyPhone,
            scope: data?.scope,
         },

         firstName: data?.firstName,
         email: data?.email,
         position: data?.position,
         phone: data?.phone,
      };

      updateHr(payload)
         .unwrap()
         .then(() => {
            openNotification({
               type: "success",
               message: t("Update this account successfully!!!"),
            });
            searchParams.delete("id");
            setSearchParams(searchParams);
            handleClose();
         })
         .catch((error) => {
            openNotification({
               type: "error",
               message: t("common:ERRORS.SERVER_ERROR"),
            });
         });
   };

   useEffect(() => {
      setEdit(!!searchParams.get("id"));
   }, [searchParams.get("id")]);

   useEffect(() => {
      if (!dataAccount) return;
      const { setValue } = form;
      const { company } = dataAccount;
      const [extraAddress, district, province] = company?.address?.split(",") || Array(3).fill("");

      setValue("avatar", company?.logoUrl, { shouldDirty: true });
      company?.logoUrl &&
         setAvatar([
            {
               url: company?.logoUrl,
            },
         ]);

      setValue("companyName", company.name);
      setValue("email", dataAccount.email);
      setValue("scope", company?.scope);
      setValue("companyPhone", company?.phone);
      setValue("company_type", company?.companyType);
      setValue("member_type", company?.memberType);
      setValue("accountBalance", company?.accountBalance);
      province && setValue("province", province);
      district && setValue("district", district);
      extraAddress && setValue("extraAddress", extraAddress);

      setImgs(company?.imageUrls);
      setValue("imgs", company?.imageUrls ?? [], { shouldDirty: true });
      setValue("description", company?.description);

      setValue("firstName", dataAccount?.firstName);
      setValue("phone", dataAccount?.phone);
      setValue("position", dataAccount?.position);
      setValue("isActive", company?.isActive);
      setCheckedStatus(company?.isActive);

      setFormReset((prev) => !prev);
   }, [dataAccount]);

   useEffect(() => {
      if (!dataProvinces) return;

      const options = dataProvinces.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.name,
         render: () => <span>{item?.name}</span>,
      }));

      setProvinces(options);
   }, [dataProvinces]);

   useEffect(() => {
      const options = (dataDistricts ?? []).map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.name,
         render: () => <span>{item?.name}</span>,
      }));

      setDistricts(options);
   }, [dataDistricts]);
   return (
      <Spin spinning={loadingAccount}>
         <StyledCreateAndEditHr>
            <FormProvider {...form}>
               <span className="history">
                  Cập nhật lần cuối bởi {dataAccount?.company?.updatedBy} vào lúc{" "}
                  {moment(dataAccount?.company?.updatedAt).format("HH:mm, DD/MM/YYYY")}
               </span>
               <Title title="Thông tin công ty" icon={<HiInformationCircle size={28} />} />
               <Col span={12} className="row">
                  <span className="label">Ảnh đại diện</span>
                  <GetImage url={dataAccount?.company?.logoUrl} width={150} />
               </Col>

               <Row gutter={[15, 15]}>
                  <Col span={24}>
                     <Input
                        required
                        name="companyName"
                        placeholder="Nhập Tên công ty"
                        label="Tên công ty"
                        disabled
                     />
                  </Col>
                  <Col span={12}>
                     <Input
                        label={"Email"}
                        name="email"
                        required
                        placeholder={t("abc@gmail.com")}
                        message={message}
                        disabled
                     />
                  </Col>

                  <Col span={12}>
                     <Input
                        name="scope"
                        placeholder="Số lượng nhân viên"
                        label="Số lượng nhân viên"
                        disabled
                     />
                  </Col>
                  <Col span={12}>
                     <Input
                        required
                        name="companyPhone"
                        placeholder="Nhập số điện thoại"
                        label="Số điện thoại"
                        disabled
                     />
                  </Col>

                  <Col span={12}>
                     <Select
                        name="company_type"
                        placeholder="Chọn loại công ty"
                        title="Loại công ty"
                        options={[
                           {
                              key: 1,
                              value: ECompanyType.PRODUCT,
                              label: ECompanyType.PRODUCT,
                              render: () => ECompanyType.PRODUCT,
                           },
                           {
                              key: 2,
                              value: ECompanyType.OUTSOURCE,
                              label: ECompanyType.OUTSOURCE,
                              render: () => ECompanyType.OUTSOURCE,
                           },
                           {
                              key: 3,
                              value: ECompanyType.HYBRID,
                              label: ECompanyType.HYBRID,
                              render: () => ECompanyType.HYBRID,
                           },
                        ]}
                        disabled
                     />
                  </Col>

                  <Col span={12}>
                     <Select
                        name="member_type"
                        placeholder="Chọn loại thành viên"
                        title="Loại thành viên"
                        options={[
                           {
                              key: 1,
                              value: EMemberTypes.DEFAULT,
                              label: EMemberTypes.DEFAULT,
                              render: () => EMemberTypes.DEFAULT,
                           },
                           {
                              key: 2,
                              value: EMemberTypes.PREMIUM,
                              label: EMemberTypes.PREMIUM,
                              render: () => EMemberTypes.PREMIUM,
                           },
                        ]}
                        disabled
                     />
                  </Col>

                  <Col span={12}>
                     <Input
                        name="accountBalance"
                        placeholder="Số dư tài khoản"
                        label="Số dư tài khoản"
                        disabled
                     />
                  </Col>

                  <Col span={12}>
                     <Select
                        name="province"
                        title="Tỉnh"
                        placeholder="Chọn tỉnh"
                        required
                        showSearch
                        onSearch={(value) => setSearchProvince(value)}
                        onSelect={(value: any) => {
                           form.setValue("province", value);
                           form.setValue("district", "");
                        }}
                        options={provinces || []}
                        loading={false}
                        disabled
                     />
                  </Col>
                  <Col span={12}>
                     <Spin spinning={loadingDistricts || fetchingDistricts}>
                        <Select
                           required
                           disabled
                           name="district"
                           title="Huyện"
                           placeholder="Chọn huyện"
                           showSearch={true}
                           onSearch={(value) => setSearchDistrict(value)}
                           options={districts || []}
                           loading={false}
                        />
                     </Spin>
                  </Col>
                  <Col span={24}>
                     <Input
                        name="extraAddress"
                        placeholder="Địa chỉ cụ thể"
                        label="Địa chỉ cụ thể"
                        disabled
                     />
                  </Col>

                  <Col span={24} className="row">
                     <span className="label">Danh sách ảnh</span>

                     <div className="imgs">
                        {(dataAccount?.company?.imageUrls ?? [])?.map((item) => (
                           <GetImage url={item} />
                        ))}
                     </div>
                  </Col>

                  <Col span={24}>
                     <EmailVariables
                        data={dataAccount?.company?.description}
                        editorRef={contentRef}
                        name="description"
                        label="Mô tả"
                     />
                  </Col>

                  <Col span={24} style={{ marginTop: "20px" }}>
                     <Title title="Thông tin người đại diện" icon={<FaUserCircle size={26} />} />
                  </Col>

                  <Col span={12}>
                     <Input
                        required
                        label={"Họ và tên người đại diện"}
                        name="firstName"
                        placeholder={"Nhập họ và tên người đại diện"}
                        disabled
                     />
                  </Col>
                  <Col span={12}>
                     <Input
                        disabled
                        required
                        label="Chức vụ"
                        name="position"
                        placeholder={"Nhập chức vụ"}
                     />
                  </Col>
                  <Col span={12}>
                     <Input
                        label={t("Số điện thoại")}
                        name="phone"
                        required
                        placeholder={t("Nhập số điện thoại")}
                        disabled
                     />
                  </Col>
               </Row>

               <Switch
                  label={t("adminManagement.status")}
                  checked={checkedStatus}
                  onChange={(checked) => {
                     setCheckedStatus(checked);
                     form.setValue("isActive", checked);
                  }}
                  checkedLabel={t("common:form.active")}
                  unCheckedLabel={t("common:form.inActive")}
                  disabled
               />
               <GroupButton>
                  <Button
                     onClick={() => {
                        handleClose();
                        searchParams.delete("id");
                        setSearchParams(searchParams);
                     }}
                     border="outline"
                  >
                     {t("common:confirm.cancel")}
                  </Button>
               </GroupButton>
            </FormProvider>
         </StyledCreateAndEditHr>
      </Spin>
   );
};

export default CreateAndEditHr;
