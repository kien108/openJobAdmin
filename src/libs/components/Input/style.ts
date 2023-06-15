import { Input, InputNumber, InputNumberProps, Slider as AntSlider } from "antd";
import styled, { css, StyledComponent } from "styled-components";

interface InputTextProps {
   error?: any;
   icons?: any;
   height?: string;
   on?: string;
   type?: string;
   placementicon?: string;
   check?: boolean;
}

export const Container = styled.div`
   .input-time {
      svg path {
         fill: #ccc;
      }
   }

   &:hover .input-time {
      cursor: text;

      svg path {
         transition: 0.3s linear all;
         fill: ${(props) => props.theme.textDefault};
      }
   }

   @media only screen and (max-width: 1364px) {
      label {
         font-size: 13px;
      }

      svg {
         width: 18px;
      }
   }
`;

export const ContainerInput = styled.div`
   position: relative;

   .ant-input-clear-icon {
      font-size: 13px;
   }

   &:hover {
      .icon-password {
         opacity: 1;
      }
   }
`;

export const Label = styled.label`
   font-size: 13px;
   font-weight: 600;
   margin-bottom: 4px;
   color: ${(props) => props.theme.textDefault};
   text-align: left;
   display: flex;

   .required-mark {
      color: red;
   }
`;

export const SubLabel = styled.label<{ isShow?: any; icons?: any; placementicon?: string }>`
   font-size: ${(props) => (props.isShow ? "13px" : "15px")};
   margin-bottom: 4px;
   color: ${(props) => (props.isShow ? props.theme.colorInput : "rgba(27, 31, 59, 0.65)")};
   text-align: left;
   display: flex;
   position: absolute;
   top: ${(props) => (props.isShow ? "25%" : "50%")};
   transform: translateY(-50%);
   left: ${(props) => (props.placementicon !== "right" && props.icons ? "48px" : "16px")};
   transition: all 0.3s;
   pointer-events: none;
   z-index: 1;
`;

export const defaultInput = css`
   border-radius: 10px;
   height: ${(props: InputTextProps) => (props.height ? props.height : "56px")};
   box-shadow: 0 2px 2px ${(props) => props.theme.boxShadowInput};
   color: ${(props) => props.theme.textDefault};
   background: ${(props) => props.theme.secondaryText};
   border: none;
   padding-left: ${(props: InputTextProps) =>
      props?.placementicon !== "right" && props.icons ? "48px" : "16px"};
   padding-right: ${(props: InputTextProps) =>
      props?.placementicon === "right" || props.type === "password" ? "48px" : "32px"};
   padding-top: ${(props: InputTextProps) => (props.on ? "25px" : "4px")};

   ${(props) =>
      props.on &&
      css`
         &::placeholder {
            font-size: 0px;
         }

         &:focus {
            &::placeholder {
               font-size: inherit;
            }
         }
      `}
   transition: all 0.2s ease-in-out;
   outline: 1px solid ${(props) => props.theme.borderInput};

   &:hover {
      box-shadow: 0 2px 5px ${(props) => props.theme.boxShadowInputHover};
      border-color: ${(props) => props.theme.borderInput};
   }

   &:focus-visible {
      border: none;
      outline: none;
      box-shadow: none;
   }

   &:focus {
      border: none;
      outline: 2px solid
         ${(props) => (props.error ? props.theme.accentActive : props.theme.strongBlue)};
      box-shadow: none;
   }

   &.input-copy {
      &:focus {
         border: none;
         outline: 2px solid
            ${(props) => (props.error ? props.theme.accentActive : props.theme.borderInput)};
         box-shadow: none;
      }
   }

   .ant-input-suffix {
      position: absolute;
      top: 50%;
      right: ${(props: InputTextProps) => (props?.placementicon === "right" ? "48px" : "16px")};
      transform: translateY(-50%);
   }
`;

export const StyledInput: StyledComponent<any, any> = styled(Input)<InputTextProps>`
   ${defaultInput}
`;

export const StyledInputNumber: StyledComponent<any, any> = styled(InputNumber)<
   InputNumberProps & InputTextProps
>`
   width: 100%;
   padding: 0;
   border: none;
   border-radius: 10px;

   &.ant-input-number-focused {
      border: none;
      box-shadow: none;
   }

   .ant-input-number-input-wrap {
      input {
         width: 100%;
         height: 100%;
         ${defaultInput}
         outline: ${(props) =>
            props.error
               ? "2px solid " + props.theme.accentActive
               : props.check
               ? "2px solid " + props.theme.strongBlue
               : "1px solid " + props.theme.borderInput};
         padding-top: ${(props: InputTextProps) => (props.on ? "18px" : "0px")};
      }
   }

   .ant-input-number-handler-wrap {
      display: none;
   }
`;

export const StyledInputTextarea: StyledComponent<any, any> = styled(
   Input.TextArea
)<InputTextProps>`
   ${defaultInput};
   padding-top: 16px;
   padding-bottom: 16px;
`;

export const StyledIconInput = styled.span`
   height: 1.5rem;
   width: 1.5rem;
   font-size: 16px;
   cursor: pointer;
   position: absolute;
   top: 50%;
   right: 16px;
   transform: translateY(-50%);
   opacity: 0.7;
   transition: all 0.2s ease-in-out;
   z-index: 2;
`;

export const StyledIconDefault = styled.span<InputTextProps>`
   z-index: 1;
   height: 1.5rem;
   width: 1.5rem;
   font-size: 16px;
   cursor: pointer;
   position: absolute;
   ${(props) => (props?.placementicon === "right" ? "right: 16px;" : "left: 16px;")}
   top: 50%;
   transform: translateY(-50%);
   transition: all 0.2s ease-in-out;
   z-index: 2;
`;

export const InputMessageStyled = styled.span`
   font-size: 13px;
   line-height: 20px;
   color: ${(props) => props.theme.red};
   display: inline-block;
   margin-top: 4px;
   width: 100% !important;
   text-align: left;
`;

export const Slider: StyledComponent<any, any> = styled(AntSlider)`
   &.ant-slider {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      height: unset;
      margin: unset;
      padding: 2px 0;
      width: calc(100% - 10px);
      left: 5px;

      &:hover {
         .ant-slider-rail {
            background-color: unset;
         }

         .ant-slider-track {
            background-color: ${(props) => props.theme.strongBlue};
         }
      }

      .ant-slider-rail {
         background-color: unset;
      }

      .ant-slider-track {
         height: 2px;
         background-color: ${(props) => props.theme.strongBlue};
      }

      .ant-slider-step {
         height: 2px;
      }

      .ant-slider-handle {
         background-color: ${(props) => props.theme.strongBlue};
         border: none;
         box-shadow: none;
         cursor: ew-resize;
      }

      & ~ .ant-input-number {
         input {
            &:focus {
               outline: 2px solid red;
            }
         }
      }
   }
`;
