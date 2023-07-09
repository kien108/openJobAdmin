import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { Button, Checkbox, Input, openNotification } from "../../../../../../libs/components";
import { useLoginMutation } from "../../services";
import { AuthResponse } from "../../types/Responses";
import logo from "../../../../../../assets/img/hehe.png";

import { saveRemember, saveUserId } from "../../../../../../libs/common";
import { useCommonDispatch } from "../../../../../../libs/common";

import {
   Contact,
   ContainerLogin,
   InputMessageStyled,
   LabelRemember,
   StyledButton,
   StyledForm,
   StyledGroupRemembers,
   StyledLogo,
} from "./styles";
import { useEffect, useState } from "react";

const Login = () => {
   const dispatch = useCommonDispatch();

   const { t } = useTranslation();
   const navigate = useNavigate();
   const location = useLocation();
   const [isRememberMe, setIsRememberMe] = useState(false);

   const from = location.state?.from || "/";

   const [error, setError] = useState(false);

   const [login, { isLoading }] = useLoginMutation();

   const form = useForm({
      defaultValues: {
         username: "",
         password: "",
      },
      resolver: yupResolver(
         yup.object({
            username: yup.string().required("Trường này không được để trống!"),
            password: yup.string().required("Trường này không được để trống!"),
         })
      ),
   });

   const { watch } = form;

   const onSubmit = (data: any) => {
      login({
         username: data.username,
         password: data.password,
      })
         .unwrap()
         .then((data: AuthResponse) => {
            if (isRememberMe) {
               localStorage.setItem("isRemember", JSON.stringify(true));

               localStorage.setItem("access_token", data["access-token"]);
            } else {
               localStorage.setItem("isRemember", JSON.stringify(false));
               sessionStorage.setItem("access_token", data["access-token"]);
            }

            dispatch(saveUserId({ id: data.id }));
            localStorage.setItem("userId", data.id);

            localStorage.setItem("refresh_token", data["refresh-token"]);
            navigate(from, { replace: true });
         })
         .catch((error) => {
            if (error?.data?.errorMessage === "Bad credentials") {
               setError(true);
            } else {
               setError(false);
               openNotification({
                  type: "error",
                  message: error?.data?.message,
                  duration: 5,
               });
            }
         });
   };

   useEffect(() => {
      const subscription = watch((value, { name, type }) => {
         if (type === "change") {
            setError(false);
         }
      });
      return () => subscription.unsubscribe();
   }, [watch]);

   useEffect(() => {
      if (localStorage.getItem("access_token") || sessionStorage.getItem("access_token")) {
         localStorage.removeItem("access_token");
         sessionStorage.removeItem("access_token");
      }
      if (localStorage.getItem("refresh_token")) {
         localStorage.removeItem("refresh_token");
      }
   }, []);
   return (
      <ContainerLogin>
         <FormProvider {...form}>
            <StyledForm>
               <StyledLogo src={logo} />
               <Input
                  label={"Tên đăng nhập"}
                  placeholder={"Nhập tên đăng nhập"}
                  name="username"
                  required
               />
               <br />
               <Input
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  type="password"
                  name="password"
                  required
               />
               {error && (
                  <InputMessageStyled>
                     Tên đăng nhập hoặc mật khẩu không chính xác
                  </InputMessageStyled>
               )}
               <StyledGroupRemembers>
                  <Checkbox
                     id="remember"
                     onChange={(e) => {
                        setIsRememberMe(e.target.checked);
                     }}
                  />
                  <LabelRemember htmlFor="remember">Nhớ mật khẩu</LabelRemember>
               </StyledGroupRemembers>
               <Contact>
                  <Trans
                     i18nKey="login.contact"
                     components={{
                        1: (
                           <a
                              href="https://www.facebook.com/kien.letrung.376258"
                              target="_blank"
                              rel="noreferrer"
                           />
                        ),
                     }}
                  />
               </Contact>
               <StyledButton>
                  <Button loading={isLoading} onClick={() => form.handleSubmit(onSubmit)()}>
                     Đăng nhập
                  </Button>
               </StyledButton>
            </StyledForm>
         </FormProvider>
      </ContainerLogin>
   );
};

export default Login;
