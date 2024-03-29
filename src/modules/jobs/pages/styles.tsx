import { Modal, Table } from "../../../libs/components";

import styled, { StyledComponent } from "styled-components";

export const StyledFunctions: StyledComponent<any, any> = styled.div`
   display: flex;
   align-items: center;
   gap: 12px;
   justify-content: center;
`;

export const BtnFunction: StyledComponent<any, any> = styled.div`
   cursor: pointer;
   width: 44px;
   height: 44px;
   display: flex;
   align-items: center;
   justify-content: center;

   border-radius: 10px;
   transition: all 0.3s;

   svg {
      path {
         fill: ${(props) => props.theme.blue};
         transition: all 0.3s;
      }
   }

   .icon-password {
      path:first-child {
         fill: #fff;
      }
   }

   &:hover {
      background: ${(props) => props.theme.softBlue};
      svg {
         path {
            fill: ${(props) => props.theme.blueHover};
         }
      }
   }
`;

export const StyledModalDelete = styled(Modal)`
   .modal-confirm__title {
      margin-bottom: 20px;
      font-weight: 700;
   }

   .ant-btn {
      padding: 0 24px;
   }
`;

export const StyledModal = styled(Modal)`
   &.ant-modal {
      width: 42.5rem !important;

      .h1 {
         font-size: 28px;
         font-weight: 700;
      }

      .ant-modal-content {
         padding: 32px;
      }
   }
`;

export const ContainerTable = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;

   margin-top: 24px;
   padding: 24px;
   box-shadow: 0 0 #000, 0 0 #000, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 0 10px -6px rgb(0 0 0 / 0.1);
   background: ${(props) => props.theme.secondaryText};
   border-radius: 10px;
`;

export const StyledHeader: StyledComponent<any, any> = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;

   button.ant-btn.btn-close {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      width: 32px;
      height: 32px;
      background-color: #ebefff;
      border-radius: 50%;

      svg {
         display: block;
         right: unset;
         top: unset;
         width: 7px;
         height: 7px;
         vertical-align: middle;
         color: #526ed3;
      }

      &:hover {
         background-color: #dfe3f3;
         color: #6c86e2;
      }
   }
`;
