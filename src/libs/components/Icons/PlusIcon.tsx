import * as React from "react";

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
   return (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <g clipPath="url(#clip0_3_7213)">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white" />
         </g>
         <defs>
            <clipPath id="clip0_3_7213">
               <rect width="24" height="24" fill="white" />
            </clipPath>
         </defs>
      </svg>
   );
}

const MemoSvgComponent = React.memo(SvgComponent);
export default MemoSvgComponent;
