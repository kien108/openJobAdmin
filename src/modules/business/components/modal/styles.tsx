import styled, { StyledComponent } from "styled-components";

export const StyledDeleteWorkFlow: StyledComponent<any, any> = styled.div`
   display: flex;
   margin-top: 20px;
   justify-content: center;
`;

export const StyledCreateWorkFlow: StyledComponent<any, any> = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;
   margin-top: 12px;

   .ant-select {
      font-size: 15px;

      &-item-empty {
         padding: 0;
      }
   }

   .ant-select-item-option-content {
      font-size: 15px;
   }
`;

export const StyledCreateAndEditEmail: StyledComponent<any, any> = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;
   margin-top: 12px;
`;

export const StyledDeleteEmail: StyledComponent<any, any> = styled(StyledDeleteWorkFlow)``;

export const GroupButton: StyledComponent<any, any> = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 20px;
   margin-top: 12px;
`;

export const StyledNotFound: StyledComponent<any, any> = styled.div`
   display: flex;
   align-items: center;
   padding: 10px 12px;
   height: 50px;
   font-weight: normal;
   font-size: 15px;
   color: rgba(0, 0, 0, 0.25);
`;

export const StyledExtendOption: StyledComponent<any, any> = styled<any>(StyledNotFound)`
   cursor: pointer;
   transition: background 0.2s ease;
   color: ${(props) => props.theme.textDefault};

   &:hover {
      background-color: ${(props) => props.theme.baseGray02};
   }
`;

export const StyledStateType: StyledComponent<any, any> = styled.div`
   display: flex;
   align-items: center;
   gap: 8px;

   .color {
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background-color: ${(props) => props.color};
   }
`;
