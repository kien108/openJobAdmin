import styled from "styled-components";

export const BtnFunction = styled.div`
   cursor: pointer;
   width: 44px;
   height: 44px;
   display: flex;
   align-items: center;
   justify-content: center;
   color: black;
   transform: translateX(-10px);

   border-radius: 10px;
   transition: all 0.3s;

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

export const Container = styled.div`
   max-width: 600px;
   margin: 0 auto;
   padding: 24px 15px;
   display: flex;
   flex-direction: column;

   gap: 10px;

   .title {
      color: rgb(45, 45, 45);
      font-weight: 700;
      font-size: 28px;
      margin-bottom: 10px;
   }

   .item {
      display: flex;
      align-items: center;
      gap: 100px;
      margin-bottom: 8px;
      .label {
         font-weight: 700;
         font-size: 18px;
         min-width: 100px;
      }
      .value {
         font-weight: 400;
         font-size: 18px;
      }
   }
   .btn-save {
      width: fit-content;
      margin-top: 20px;
   }
`;

export const GroupButton = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 20px;
   margin-top: 30px;
`;
