import { Image } from "antd";
import React, { FC } from "react";

import fallBackImg from "../../../assets/img/no_image.jpg";
import { StyledImg } from "./styles";

interface IProps {
   url: string;
   width?: number;
   className?: string;
}

const GetImage: FC<IProps> = ({ url, width, className }) => {
   console.log({ url });
   return (
      <StyledImg
         className={className}
         width={width || 100}
         height={width || 100}
         src={url || fallBackImg}
      />
   );
};

export default GetImage;
