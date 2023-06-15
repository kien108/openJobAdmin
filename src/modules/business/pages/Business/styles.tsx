import styled from "styled-components";

export const Container = styled.div``;

export const Content = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;

   margin-top: 24px;
   padding: 24px;
   box-shadow: 0 0 #000, 0 0 #000, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 0 10px -6px rgb(0 0 0 / 0.1);
   background: ${(props) => props.theme.secondaryText};
   border-radius: 10px;

   .section {
      color: #074abd;
      font-weight: 600;
      font-size: 20px;

      &-content {
         padding-left: 15px;
      }
   }

   .label {
      font-weight: 500;

      .required {
         color: red;
         margin-left: 2px;
         display: inline-block;
      }
   }

   .mt-2 {
      margin-top: 20px;
   }

   .btn-save {
      width: 140px;
      margin: 0 auto;
   }
`;
