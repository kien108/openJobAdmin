import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { Button, Checkbox, Input } from "../../../../../../libs/components";
import { useLoginMutation } from "../../services";
import { AuthResponse } from "../../types/Responses";
import logo from "../../../../../../assets/img/logo.png";

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
            username: yup.string().required(t("common:form.required")),
            password: yup.string().required(t("common:form.required")),
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
               dispatch(saveRemember({ isRemember: true } as any));
               localStorage.setItem("access_token", data["access-token"]);
            } else {
               dispatch(saveRemember({ isRemember: false } as any));
               sessionStorage.setItem("access_token", data["access-token"]);
            }

            dispatch(saveUserId({ id: data.id }));
            localStorage.setItem("userId", data.id);

            localStorage.setItem("refresh_token", data["refresh-token"]);
            navigate(from, { replace: true });
         })
         .catch((e) => {
            setError(true);
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
                  label={t("login.username")}
                  placeholder={t("login.enterUsername")}
                  name="username"
                  required
               />
               <br />
               <Input
                  label={t("login.password")}
                  placeholder={t("login.enterPassword")}
                  type="password"
                  name="password"
                  required
               />
               {error && <InputMessageStyled>{t("form.error")}</InputMessageStyled>}
               <StyledGroupRemembers>
                  <Checkbox
                     id="remember"
                     onChange={(e) => {
                        setIsRememberMe(e.target.checked);
                     }}
                  />
                  <LabelRemember htmlFor="remember">{t("login.remember")}</LabelRemember>
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
                     {t("login.btn")}
                  </Button>
               </StyledButton>
            </StyledForm>
         </FormProvider>
      </ContainerLogin>
   );
};

export default Login;
