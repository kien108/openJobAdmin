import React, { FC, ReactNode, useEffect, useState } from "react";

import {
   Button,
   Input,
   openNotification,
   OptionType,
   Select,
   Switch,
} from "../../../../libs/components";

import { GroupButton, StyledCreateAndEditAdmin } from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";
import {
   useCheckPasswordMutation,
   useCheckUsernameMutation,
   useCreateAdminMutation,
   useGetByIdQuery,
   useUpdateAdminMutation,
} from "../../services";
import {
   RootState,
   useCommonSelector,
   useDebounce,
   useGetAdminByIdQuery,
} from "../../../../libs/common";
import { useSearchParams } from "react-router-dom";

interface ICreateAndEditAdmin {
   handleClose: () => void;
}

const CreateAndEditAdmin: FC<ICreateAndEditAdmin> = ({ handleClose }) => {
   const { t } = useTranslation();
   const { id: userId } = useCommonSelector((state: RootState) => state.user.user);
   const [searchParams, setSearchParams] = useSearchParams();

   const form = useForm({
      defaultValues: {
         firstName: "",
         lastName: "",
         username: "",
         password: "",
         isActive: true,
         role: "",
      },
      resolver: yupResolver(
         yup.object({
            firstName: yup.string().trim().required("Trường này không được để trống!"),
            lastName: yup.string().trim().required("Trường này không được để trống!"),
            username: yup.string().trim().required("Trường này không được để trống!"),
            password: !searchParams.get("id")
               ? yup
                    .string()
                    .trim()
                    .required("Trường này không được để trống!")
                    .min(8, "Mật khẩu phải ít nhất 8 ký tự")
               : yup.string(),
            isActive: yup.boolean(),
            role: yup.string().trim().required("Trường này không được để trống!"),
         })
      ),
   });

   const [checkedStatus, setCheckedStatus] = useState<boolean>(form.getValues("isActive"));
   const [message, setMessage] = useState<string | undefined>(undefined);
   const [messagePassword, setMessagePassword] = useState<string | undefined>(undefined);

   const debounceUsername = useDebounce(form.watch("username"), 500);
   const debouncePassword = useDebounce(form.watch("password"), 500);

   const options: OptionType[] = [
      {
         key: 1,
         label: "super_admin",
         value: "SUPER_ADMIN",
         render: () => "Quản trị viên cấp cao",
      },
      {
         key: 2,
         label: "admin",
         value: "ADMIN",
         render: () => "Quản trị viên",
      },
   ];

   const [createAdmin, { isLoading: loadingCreate }] = useCreateAdminMutation();
   const [updateAdmin, { isLoading: loadingUpdate }] = useUpdateAdminMutation();
   const [checkUsername, { isLoading: loadingCheckExistUsername }] = useCheckUsernameMutation();
   const [checkPassword, { isLoading: loadingCheckPassword }] = useCheckPasswordMutation();
   const {
      data: dataAccount,
      isLoading: loadingAccount,
      isFetching: fetchingAccount,
   } = useGetByIdQuery(searchParams.get("id")!, {
      skip: !searchParams.get("id"),
      refetchOnMountOrArgChange: true,
   });

   const handleCheckUsername = (username: string | undefined) => {
      username &&
         checkUsername({ username })
            .unwrap()
            .then(() => {
               setMessage(undefined);
            })
            .catch((error) => {
               setMessage("Tên đăng nhập đã tồn tại");
            });
   };

   const handleCheckPassword = () => {
      dataAccount &&
         checkPassword({ id: dataAccount.id, password: debouncePassword })
            .unwrap()
            .then(() => {
               setMessagePassword(undefined);
            })
            .catch((error) => {
               setMessagePassword(t("adminManagement.notMatch"));
            });
   };

   const onSubmit = (data: any) => {
      searchParams.get("id")
         ? updateAdmin({ id: searchParams.get("id"), ...data, password: dataAccount?.password })
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: "Cập nhật quản trị viên thành công!",
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
              })
         : createAdmin(data)
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: "Tạo mới quản trị viên thành công!",
                 });
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
      if (dataAccount && dataAccount.username === form.watch("username")) {
         setMessage(undefined);
         return;
      }

      handleCheckUsername(form.watch("username"));
   }, [debounceUsername]);

   useEffect(() => {
      if (!dataAccount || !debouncePassword) return;

      handleCheckPassword();
   }, [debouncePassword]);

   useEffect(() => {
      if (!dataAccount) return;

      form.setValue("firstName", dataAccount?.firstName);
      form.setValue("lastName", dataAccount.lastName);
      form.setValue("username", dataAccount.username);
      form.setValue("role", dataAccount.role);
      form.setValue("isActive", dataAccount.isActive);

      setCheckedStatus(dataAccount.isActive);
   }, [dataAccount]);

   return (
      <Spin
         spinning={
            loadingAccount || fetchingAccount || loadingCheckExistUsername || loadingCheckPassword
         }
      >
         <StyledCreateAndEditAdmin>
            <FormProvider {...form}>
               <Row gutter={20}>
                  <Col span={12}>
                     <Input
                        required
                        label={t("adminManagement.firstName")}
                        name="firstName"
                        placeholder={t("adminManagement.enterFirstName")}
                     />
                  </Col>
                  <Col span={12}>
                     <Input
                        required
                        label={t("adminManagement.lastName")}
                        name="lastName"
                        placeholder={t("adminManagement.enterLastName")}
                     />
                  </Col>
               </Row>
               <Input
                  label="Tên đăng nhập"
                  name="username"
                  required
                  placeholder="Nhập tên đăng nhập"
                  message={message}
               />
               {!searchParams.get("id") && (
                  <Input
                     required
                     type="password"
                     label="Mật khẩu"
                     name="password"
                     placeholder="Nhập mật khẩu"
                     message={messagePassword}
                  />
               )}
               {/*_ */}

               {userId !== searchParams.get("id") && (
                  <Select options={options} name="role" value={"ADMIN"} required title="Vai trò" />
               )}
               {userId !== searchParams.get("id") && (
                  <Switch
                     label="Trạng thái"
                     checked={checkedStatus}
                     onChange={(checked) => {
                        setCheckedStatus(checked);
                        form.setValue("isActive", checked);
                     }}
                     checkedLabel="Kích hoạt"
                     unCheckedLabel="Vô hiệu hóa"
                  />
               )}
               <GroupButton>
                  <Button
                     onClick={() => {
                        handleClose();
                        searchParams.delete("id");
                        setSearchParams(searchParams);
                     }}
                     border="outline"
                  >
                     Hủy bỏ
                  </Button>

                  <Button
                     loading={loadingCreate || loadingUpdate}
                     disabled={!!message || !!messagePassword}
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit(onSubmit)();
                     }}
                  >
                     Lưu
                  </Button>
               </GroupButton>
            </FormProvider>
         </StyledCreateAndEditAdmin>
      </Spin>
   );
};

export default CreateAndEditAdmin;
