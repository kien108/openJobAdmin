import { Select, Typography } from "antd";
import styled, { css, StyledComponent } from "styled-components";

export const Container = styled.div<{
   isError?: boolean | undefined;
   modeType?: boolean;
   isMuntitlePlaceholder?: boolean;
}>`
   position: relative;

   .ant-select-disabled {
      .ant-select-selector {
         color: rgba(0, 0, 0, 0.8) !important;
      }
   }

   .ant-select-status-error.ant-select:not(.ant-select-disabled):not(.ant-select-customize-input)
      .ant-select-selector {
      border-color: ${(props) => props.theme.accentActive} !important;
      border-width: 2px !important;
   }

   .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
      border-color: rgb(229, 231, 235);
      cursor: pointer;
   }

   .ant-select-selector {
      .ant-select-selection-overflow {
         overflow: ${(props) =>
            props.modeType && props.isMuntitlePlaceholder ? "hidden" : "unset"} !important;
      }
   }

   @media only screen and (max-width: 1364px) {
      .ant-select-selection-placeholder {
         font-size: 13px;
      }
   }
`;

export const StyledSelect: any = styled(Select)<{ item?: string; mode?: string; error: boolean }>`
   z-index: 0;
   width: 100%;

   .ant-select-selector,
   input {
      border-radius: 10px !important;

      &.ant-select-selection-search-input {
         border: none !important;
      }
   }

   .ant-select-selector {
      min-height: 56px;
      padding-top: 5px;
      padding-bottom: 5px;

      .ant-select-selection-search {
         ${(props) =>
            !props.mode &&
            css`
               display: flex;
               align-items: center;
            `}
      }

      ::after {
         content: "";
         margin: 0;
      }
   }

   span {
      text-align: left;
   }

   .ant-select-selector {
      box-shadow: 0 2px 2px #0000001a;

      &:hover {
         border-color: ${(props) => props.theme.deepGray} !important;
         box-shadow: 0 2px 5px #00000029 !important;
      }

      &:focus,
      &:focus-within {
         border: 2px solid
            ${(props) => (props.error ? props.theme.accentActive : props.theme.strongBlue)} !important;
         box-shadow: none !important;
      }

      .dnone {
         display: none !important;
      }
   }

   .ant-select:not(.ant-select-customize-input) .ant-select-selector {
      transition: none;
   }

   .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
      .ant-select-selector {
      border: none;
      outline: 2px solid #000;
      box-shadow: none !important;
   }

   .ant-select-arrow {
      font-size: 18px;
      cursor: pointer;

      &:hover {
         border: 2px solid ${(props) => props.theme.strongBlue} !important;
      }
   }

   .ant-select-clear {
      background-color: transparent;
      margin-top: -8px !important;
      font-size: 13px;
      margin-left: 24px;
      right: 26px !important;

      svg {
         margin-left: 16px;
      }
   }

   .ant-select-selector:focus-within ~ .ant-select-arrow {
      transition: transform 400ms ease !important;
      transform: rotate(-180deg) !important;
   }

   .anticon-close-circle {
      transform: translateX(-30px);
   }

   .ant-select-selection-item {
      padding-left: 6px !important;
      margin-top: ${(props) => props.item !== "true" && "20px !important"};
      margin-left: ${(props) => props.mode && "8px !important"};
   }

   .ant-select-selection-item {
      p {
         margin-top: ${(props) => !props.mode && "14px !important"};
      }

      ${(props) =>
         !props.mode &&
         css`
            display: flex;
            align-items: center;
         `};
   }

   .ant-select-selection-placeholder {
      padding-left: 6px !important;
      margin-top: ${(props) => (!props.mode ? "22px" : "0px")};
      margin-top: ${(props) => props.item === "true" && "0px !important"};
      ${(props) =>
         props.item === "true" &&
         !props.mode &&
         css`
            display: flex;
            justify-content: start;
            align-items: center;
         `}
   }

   .ant-select-selection-search > .ant-select-selection-search-input {
      margin-left: 6px !important;
      padding-top: ${(props) => props.item !== "true" && "20px !important"};
      margin-top: ${(props) => props.item === "true" && props.mode && "-4px !important"};
      height: 100% !important;
      border-radius: unset !important;

      ::placeholder {
         font-size: 14px;
         color: #bfbfbf;
         font-weight: 400;
         font-variant: tabular-nums;
         line-height: 1.5715;
         list-style: none;
         font-feature-settings: "tnum";
      }
   }
`;

export const StyledLabelSelect: StyledComponent<any, any> = styled(Typography)<{
   ismovetext: string;
}>`
   z-index: 999;
   position: absolute;
   color: ${(props) => props.theme.strongGray};
   text-align: left !important;
   ${(props) =>
      props.ismovetext === "true"
         ? css`
              transform: translateY(18px);
              font-size: 15px !important;
           `
         : css`
              transform: translateY(8px);
              font-size: 13px !important;
           `};

   padding-left: 18px;
   transition: all 0.3s;
   pointer-events: none;
`;

export const StyledTitleSelect = styled.label`
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

export const InputMessageStyle = styled.span<{
   error: boolean | undefined;
}>`
   text-align: left;
   font-size: 13px;
   color: ${(props) => props.theme.red};
   display: ${(props) => (props.error ? "inline-block" : "none")};
   margin-top: 5px;
   width: 100% !important;
`;
