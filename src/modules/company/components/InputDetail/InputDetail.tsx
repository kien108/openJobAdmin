import React, { FC } from "react";
import { Container } from "./styles";

interface IProps {
   label: string;
   value: string | undefined;
}
const InputDetail: FC<IProps> = ({ label, value }) => {
   return (
      <Container>
         <span className="label">{label}</span>
         <span className="value">{value}</span>
      </Container>
   );
};

export default InputDetail;
