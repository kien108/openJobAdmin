import styled from "styled-components";
import loginBg from "../../assets/login-bg.svg";

export const ContainerLogin = styled.div`
   position: relative;
   display: block;
   height: 100vh;
   background: url(${loginBg}) no-repeat;
   background-size: cover;
   user-select: none;
`;
export const StyledForm = styled.form`
   padding: 20px 40px 40px 40px;
   background-color: rgb(255 255 255 / 1);
   border-radius: 10px;
   width: 450px;
   height: fit-content;
   margin: auto;
   position: absolute;
   top: 0px;
   right: 0px;
   bottom: 0px;
   left: 0px;
   box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2);
`;
export const StyledLogo = styled.img`
   margin-left: auto;
   margin-right: auto;
   width: 150px;
   height: auto;
   display: block;
   user-select: none;
`;
export const StyledGroupRemembers = styled.div`
   display: flex;
   align-items: center;
   margin-top: 20px;
`;
export const LabelRemember = styled.label`
   font-weight: 600;
   margin-left: 10px;
   color: ${(props) => props.theme.textDefault};
   font-size: 14px;
   cursor: pointer;
`;
export const Contact = styled.p`
   margin-top: 15px;

   a {
      font-weight: 600;
      color: ${(props) => props.theme.strongBlue};
   }
`;
export const StyledButton = styled.div`
   margin-top: 24px;
   button {
      margin: auto;
      width: 240px;
   }
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
