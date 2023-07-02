import React, { FC, useEffect } from "react";
import { BtnFunction, Container, GroupButton } from "./styles";
import { BsArrowLeft } from "react-icons/bs";

import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { Button, DatePicker, Input, openNotification, Select } from "../../../../libs/components";
import { Col, Row, Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCommonSelector, RootState, useGetAdminByIdQuery } from "../../../../libs/common";
import moment from "moment";
import { useActivateMutation, useDeActivateMutation, useGetByIdQuery } from "../../services";
import Avatar from "react-avatar";
import { randomColor } from "../../../../utils";
import { v4 as uuidv4 } from "uuid";

interface IProps {
   handleClose: () => void;
}
const ContactInformation: FC<IProps> = ({ handleClose }) => {
   const { t } = useTranslation();
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();

   const form = useForm({
      defaultValues: {
         firstName: "",
         lastName: "",
         email: "",
         phone: "",
         gender: "Male",
         dob: "",
      },
      resolver: yupResolver(
         yup.object({
            firstName: yup.string().trim().required(t("common:form.required")),
            lastName: yup.string().trim().required(t("common:form.required")),
            phone: yup.string().trim(),
            gender: yup.string(),
            email: yup.string().email(t("common:form.email")).required(t("common:form.required")),
         })
      ),
   });

   const {
      data: dataUser,
      isLoading: loadingUser,
      isFetching: fetchingUser,
   } = useGetByIdQuery(searchParams.get("id")!, {
      refetchOnMountOrArgChange: true,
      skip: !searchParams.get("id"),
   });

   const [activate, { isLoading: loadingActivate }] = useActivateMutation();
   const [deActivate, { isLoading: loadingDeactivate }] = useDeActivateMutation();

   const onSubmit = (data: any) => {
      // upload({ authProvider: "DATABASE", ...user, ...data })
      //    .unwrap()
      //    .then(() => {
      //       openNotification({
      //          type: "success",
      //          message: t("Update this profile successfully!!!"),
      //       });
      //    })
      //    .catch((error) => {
      //       openNotification({
      //          type: "error",
      //          message: t("common:ERRORS.SERVER_ERROR"),
      //       });
      //    });
   };

   const handleConfirmDeactivate = () => {
      searchParams.get("id") &&
         deActivate(searchParams.get("id")!)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: "Vô hiệu hóa tài khoản thành công",
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

   const handleActivate = () => {
      searchParams.get("id") &&
         activate(searchParams.get("id")!)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: "Kích hoạt tài khoản thành công",
               });
               searchParams.delete("id");
               setSearchParams(searchParams);
               handleClose();
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("INTERNAL SERVER ERROR"),
               });
            });
   };
   return (
      <Spin spinning={loadingUser || fetchingUser}>
         <Container>
            <FormProvider {...form}>
               <Avatar
                  style={{ margin: "0 auto 50px" }}
                  size="120"
                  round={true}
                  fgColor="#1b1f3b"
                  color={randomColor({
                     id: uuidv4(),
                     lightness: 80,
                  })}
                  maxInitials={2}
                  src={dataUser?.avatarUrl}
                  name={dataUser?.lastName}
               />
               <div className="item">
                  <span className="label">Tên:</span>
                  <span className="value">{dataUser?.firstName || "-"}</span>
               </div>
               <div className="item">
                  <span className="label">Họ tên:</span>
                  <span className="value">{dataUser?.lastName || "-"}</span>
               </div>
               <div className="item">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">{dataUser?.phone || "-"}</span>
               </div>
               <div className="item">
                  <span className="label">Email:</span>
                  <span className="value">{dataUser?.email || "-"}</span>
               </div>
               <div className="item">
                  <span className="label">Giới tính:</span>
                  <span className="value">{dataUser?.gender || "-"}</span>
               </div>
               <div className="item">
                  <span className="label">Ngày sinh:</span>
                  <span className="value">
                     {dataUser?.dob ? moment(dataUser?.dob).format("DD/MM/YYYY") : "-"}
                  </span>
               </div>

               <GroupButton>
                  {!dataUser?.isActive ? (
                     <Button
                        loading={loadingActivate}
                        onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           handleActivate();
                        }}
                     >
                        Kích hoạt
                     </Button>
                  ) : (
                     <Button
                        loading={loadingDeactivate}
                        onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           handleConfirmDeactivate();
                        }}
                     >
                        Vô hiệu hóa
                     </Button>
                  )}
                  <Button
                     onClick={() => {
                        handleClose();
                        searchParams.delete("id");
                        setSearchParams(searchParams);
                     }}
                     border={"outline"}
                  >
                     Đóng
                  </Button>
               </GroupButton>
            </FormProvider>
         </Container>
      </Spin>
   );
};

export default ContactInformation;
