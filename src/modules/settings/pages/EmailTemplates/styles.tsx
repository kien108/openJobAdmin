import { Modal } from "../../../../libs/components";
import styled, { StyledComponent } from "styled-components";

export const StyledModal = styled(Modal)`
   &.ant-modal {
      width: 800px;

      .ant-typography {
         font-size: 28px;
         font-weight: 700;
      }

      .ant-modal-content {
         padding: 32px;
      }

      .ant-modal-body {
         h1.ant-typography {
            color: ${(props) => props.theme.textDefault};
            font-size: 36px;
            line-height: 40px;
            margin-bottom: 14px;
         }
      }
   }
`;
