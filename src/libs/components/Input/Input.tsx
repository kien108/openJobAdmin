import { InputProps, Popover } from "antd";
import { TextAreaProps } from "antd/lib/input";
import { FC, ReactNode, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContentCopyIcon, EyeIcon, EyePwIcon } from "../Icons";

import {
   Container,
   ContainerInput,
   InputMessageStyled,
   Label,
   StyledIconDefault,
   StyledIconInput,
   StyledInput,
   StyledInputNumber,
   StyledInputTextarea,
   SubLabel,
} from "./style";
import "./style.scss";

interface IInput extends InputProps {
   type?: "password" | "textarea" | "copy" | "macAddress" | "time" | "number";
   label?: string;
   height?: string;
   message?: string;
   icons?: ReactNode;
   subLabel?: string;
   inputType?: string;
}

const Input: FC<IInput & TextAreaProps> = ({
   type,
   label,
   height,
   message,
   icons,
   subLabel,
   inputType,
   ...props
}) => {
   const { t } = useTranslation();
   const [show, setShow] = useState(false);
   const [isShowSubLabel, setIsShowSubLabel] = useState(false);
   const [isCopy, setIsCopy] = useState("copy");

   const {
      control,
      register,
      getValues,
      watch,
      formState: { errors },
   } = useFormContext();

   const errorMessage: any = message || (errors && props.name ? errors[props.name]?.message : "");

   const maskCPF = (value: string) => {
      return value
         .replace(/\D/g, "")
         .replace(/(\d{2})(\d)/, "$1-$2")
         .replace(/(\d{2})(\d)/, "$1-$2")
         .replace(/(\d{2})(\d)/, "$1-$2")
         .replace(/(\d{2})(\d)/, "$1-$2")
         .replace(/(\d{2})(\d)/, "$1-$2")
         .replace(/(-\d{2})\d+?$/, "$1");
   };

   const timeCPF = (value: string) => {
      const regexH = /^([0-1]?[0-9]|2[0-3])$/;
      const regexM = /^[0-5]?[0-9]$/;

      const hh = Number(value.slice(0, 1)) > 2 ? `0${value.slice(0, 1)}` : value.slice(0, 2);
      const mm =
         Number(value.slice(2, 3)) > 5 ? `0${value.slice(2, 3)}` : value.slice(2).replace(":", "");

      let curValue = "";

      if (regexH.test(hh)) {
         curValue += hh;
         if (regexM.test(mm)) {
            curValue += mm;
         } else {
            curValue += mm.slice(0, mm.length - 1);
         }
      } else {
         curValue += hh.slice(0, hh.length - 1);
      }

      const result = curValue
         .replace(/\D/g, "")
         .replace(/(\d{2})(\d)/, "$1:$2")
         .replace(/(\d{2})(\d)/, "$1");

      return result;
   };

   return (
      <Container className="container-input">
         {label && (
            <Label>
               {label}
               {props.required ? <span className="required-mark">*</span> : null}
            </Label>
         )}
         <ContainerInput>
            {type === "textarea" ? (
               <Controller
                  name={`${props.name}`}
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                     <StyledInputTextarea
                        {...field}
                        {...register(`${props.name}`)}
                        value={getValues(`${props.name}`)}
                        height={height}
                        error={errorMessage}
                        onChange={(e: any) => {
                           onChange(e.target.value);
                           props.onChange;
                        }}
                        {...props}
                     />
                  )}
               />
            ) : type === "password" ? (
               <>
                  <Controller
                     name={`${props.name}`}
                     control={control}
                     render={({ field: { value, onChange, ...field } }) => (
                        <StyledInput
                           {...field}
                           {...register(`${props.name}`)}
                           value={getValues(`${props.name}`)}
                           height={height}
                           type={!show ? "password" : "text"}
                           error={errorMessage}
                           style={{ paddingRight: "50px" }}
                           onChange={(e: any) => {
                              onChange(e.target.value);
                              props.onChange;
                           }}
                           {...props}
                        />
                     )}
                  />
                  <Popover
                     placement="bottomRight"
                     overlayClassName="popup-password"
                     content={!show ? t("hidePassword") : t("showPassword")}
                  >
                     <StyledIconInput className="icon-password" onClick={() => setShow(!show)}>
                        {!show ? <EyePwIcon /> : <EyeIcon />}
                     </StyledIconInput>
                  </Popover>
               </>
            ) : type === "copy" ? (
               <>
                  <Controller
                     name={`${props.name}`}
                     control={control}
                     render={({ field: { value, onChange, ...field } }) => (
                        <StyledInput
                           {...field}
                           {...register(`${props.name}`)}
                           value={getValues(`${props.name}`)}
                           height={height}
                           type="text"
                           error={errorMessage}
                           readOnly
                           style={{ paddingRight: "50px" }}
                           className="input-copy"
                           onChange={(e: any) => {
                              onChange(e.target.value);
                              props.onChange;
                           }}
                           {...props}
                        />
                     )}
                  />
                  <Popover
                     placement="bottomRight"
                     overlayClassName="popup-copy"
                     content={t(isCopy)}
                  >
                     <StyledIconInput
                        onClick={() => {
                           navigator.clipboard.writeText(getValues(`${props.name}`));
                           setIsCopy("Copied");
                        }}
                     >
                        {<ContentCopyIcon />}
                     </StyledIconInput>
                  </Popover>
               </>
            ) : type === "macAddress" ? (
               <>
                  {icons && <StyledIconDefault>{icons}</StyledIconDefault>}
                  <Controller
                     name={`${props.name}`}
                     control={control}
                     render={({ field: { value, onChange, ...field } }) => (
                        <StyledInput
                           {...field}
                           {...register(`${props.name}`)}
                           value={getValues(`${props.name}`)}
                           icons={icons}
                           height={height}
                           error={errorMessage}
                           onFocus={() => setIsShowSubLabel(true)}
                           onBlur={() => setIsShowSubLabel(false)}
                           on={subLabel}
                           onChange={(e: any) => {
                              onChange(maskCPF(e.target.value));
                              props.onChange;
                           }}
                           {...props}
                        />
                     )}
                  />

                  {subLabel && (
                     <SubLabel
                        className="sub-label"
                        icons={icons}
                        isShow={getValues(`${props.name}`) || isShowSubLabel}
                     >
                        {subLabel}
                     </SubLabel>
                  )}
               </>
            ) : type === "number" ? (
               <>
                  {icons && <StyledIconDefault>{icons}</StyledIconDefault>}
                  <Controller
                     name={`${props.name}`}
                     control={control}
                     render={({ field: { value, onChange, ...field } }) => (
                        <StyledInputNumber
                           {...field}
                           {...register(`${props.name}`)}
                           value={getValues(`${props.name}`)}
                           icons={icons}
                           height={height}
                           error={errorMessage}
                           onFocus={() => setIsShowSubLabel(true)}
                           onBlur={() => setIsShowSubLabel(false)}
                           on={subLabel}
                           onChange={(value: number) => {
                              onChange(value);
                              props.onChange;
                           }}
                           {...props}
                        />
                     )}
                  />

                  {subLabel && (
                     <SubLabel
                        className="sub-label"
                        icons={icons}
                        isShow={getValues(`${props.name}`) || isShowSubLabel}
                     >
                        {subLabel}
                     </SubLabel>
                  )}
               </>
            ) : type === "time" ? (
               <>
                  {icons && <StyledIconDefault>{icons}</StyledIconDefault>}
                  <Controller
                     name={`${props.name}`}
                     control={control}
                     render={({ field: { value, onChange, ...field } }) => (
                        <StyledInput
                           {...field}
                           {...register(`${props.name}`)}
                           value={getValues(`${props.name}`)}
                           pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$"
                           placeholder="HH:MM"
                           icons={icons}
                           height={height}
                           error={errorMessage}
                           onFocus={() => setIsShowSubLabel(true)}
                           onBlur={() => setIsShowSubLabel(false)}
                           on={subLabel}
                           onChange={({ target: { value } }) => {
                              onChange(timeCPF(value));
                              props.onChange;
                           }}
                           {...props}
                        />
                     )}
                  />

                  {subLabel && (
                     <SubLabel
                        className="sub-label"
                        icons={icons}
                        isShow={watch(`${props.name}`) || isShowSubLabel}
                     >
                        {subLabel}
                     </SubLabel>
                  )}
               </>
            ) : (
               <>
                  {icons && <StyledIconDefault>{icons}</StyledIconDefault>}
                  <Controller
                     name={`${props.name}`}
                     control={control}
                     render={({ field: { value, onChange, ...field } }) => (
                        <StyledInput
                           {...field}
                           {...register(`${props.name}`)}
                           value={getValues(`${props.name}`)}
                           icons={icons}
                           height={height}
                           error={errorMessage}
                           onFocus={() => setIsShowSubLabel(true)}
                           onBlur={() => setIsShowSubLabel(false)}
                           type={inputType}
                           on={subLabel}
                           onChange={(e: any) => {
                              onChange(e.target.value);
                              props.onChange;
                           }}
                           {...props}
                        />
                     )}
                  />

                  {subLabel && (
                     <SubLabel
                        className="sub-label"
                        icons={icons}
                        isShow={getValues(`${props.name}`) || isShowSubLabel}
                     >
                        {subLabel}
                     </SubLabel>
                  )}
               </>
            )}
         </ContainerInput>
         {errorMessage && <InputMessageStyled>{errorMessage}</InputMessageStyled>}
      </Container>
   );
};

export default Input;
