import styled from "styled-components";

export const StyledHeader = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
`;

export const StyledContent = styled.div`
   padding: 24px;
   box-shadow: 0 0 #000, 0 0 #000, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 0 10px -6px rgb(0 0 0 / 0.1);
   background: ${(props) => props.theme.secondaryText};
   border-radius: 10px;
   margin-top: 24px;

   .settings__name {
      min-width: 130px;
   }
`;
