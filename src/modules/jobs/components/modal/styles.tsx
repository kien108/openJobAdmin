import styled from "styled-components";

export const StyledCreateAndEditMajor = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;
   margin-top: 20px;

   .avatar {
      margin: 30px 0;
   }

   font-size: 16px;

   label {
      font-size: 16px;
   }
`;

export const StyledEditPassword = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;
   margin-top: 20px;
`;

export const GroupButton = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 20px;
   margin-top: 12px;
`;

export const StyledNotFound = styled.div`
   display: flex;
   align-items: center;
   padding: 10px 12px;
   height: 50px;
   font-weight: normal;
   font-size: 15px;
   color: rgba(0, 0, 0, 0.25);
`;

export const StyledExtendOption = styled<any>(StyledNotFound)`
   cursor: pointer;
   transition: background 0.2s ease;
   color: ${(props) => props.theme.textDefault};

   &:hover {
      background-color: ${(props) => props.theme.baseGray02};
   }
`;
