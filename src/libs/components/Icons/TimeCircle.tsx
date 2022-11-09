import * as React from 'react';

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Iconly/Light-Outline/Time Circle">
        <g id="Time Circle">
          <path
            id="Fill 1"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 3.5C7.313 3.5 3.5 7.313 3.5 12C3.5 16.687 7.313 20.5 12 20.5C16.687 20.5 20.5 16.687 20.5 12C20.5 7.313 16.687 3.5 12 3.5ZM12 22C6.486 22 2 17.514 2 12C2 6.486 6.486 2 12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22Z"
            fill="#130F26"
          />
          <path
            id="Fill 3"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.4311 15.6922C15.3001 15.6922 15.1681 15.6582 15.0471 15.5872L11.2771 13.3382C11.0511 13.2022 10.9111 12.9572 10.9111 12.6932V7.84521C10.9111 7.43121 11.2471 7.09521 11.6611 7.09521C12.0761 7.09521 12.4111 7.43121 12.4111 7.84521V12.2672L15.8161 14.2972C16.1711 14.5102 16.2881 14.9702 16.0761 15.3262C15.9351 15.5612 15.6861 15.6922 15.4311 15.6922Z"
            fill="#130F26"
          />
        </g>
      </g>
    </svg>
  );
}

const MemoSvgComponent = React.memo(SvgComponent);
export default MemoSvgComponent;
