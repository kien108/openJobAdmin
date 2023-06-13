import React from "react";
import FileSaver from "file-saver";
import { DownloadFileIcon } from "../Icons";
import { UploadFile } from "antd/es/upload/interface";
import { StyledDownload } from "./styles";

interface Props {
   file?: any;
}

const Download = ({ file }: Props) => {
   return (
      <StyledDownload
         onClick={() => {
            console.log({ file });
            if (file.originFileObj) {
               // FileSaver.saveAs(file.originFileObj as unknown as File, file.url);
            } else {
               // FileSaver.saveAs("temp" as unknown as File, file.url);
            }
         }}
      >
         <DownloadFileIcon />
      </StyledDownload>
   );
};

export default React.memo(Download);
