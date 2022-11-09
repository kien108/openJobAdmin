import * as React from 'react';
import { SVGProps } from 'react';

const HistoryLogIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="#fff">
      <path d="M0 16.262c.077.453.134.909.235 1.355.714 3.158 3.412 5.709 6.607 6.238.491.082.993.132 1.49.135 2.446.014 4.89.013 7.336.004 3.822-.013 7.082-2.533 8.062-6.216a8.17 8.17 0 0 0 .27-2.107v-3.585c0-.607-.393-1.03-.947-1.024-.544.005-.926.423-.927 1.02v3.515c-.004 2.999-1.875 5.491-4.763 6.287a6.75 6.75 0 0 1-1.71.227c-2.437.024-4.874.016-7.311.008-3.252-.01-5.934-2.334-6.403-5.548a6.557 6.557 0 0 1-.06-.934 1570.7 1570.7 0 0 1-.002-7.287c.008-3.135 2.141-5.736 5.217-6.352.41-.082.837-.116 1.256-.118 2.438-.01 4.875-.009 7.312-.004 1.628.003 3.054.555 4.288 1.613.057.049.13.078.196.115l-.059.087h-1.255c-.172 0-.344-.005-.515.005-.464.028-.822.39-.864.865a.934.934 0 0 0 .717.969c.113.025.232.033.349.034 1.14.002 2.281.002 3.421.001.7 0 1.075-.374 1.075-1.067 0-1.117-.014-2.234.006-3.351.01-.574-.206-.96-.755-1.147h-.375c-.562.187-.792.582-.755 1.163.018.274.004.55.004.838-.049-.018-.064-.02-.076-.03a3.346 3.346 0 0 1-.128-.1 8.079 8.079 0 0 0-3.25-1.624C17.235.137 16.77.08 16.313 0H7.734c-.3.045-.6.086-.9.136C3.648.674.948 3.224.235 6.38c-.1.446-.157.902-.234 1.353v8.53Z" />
      <path d="m12.938 9.223-.001-2.67c-.001-.605-.395-1.027-.948-1.022-.543.006-.925.425-.926 1.021-.001 1.6-.004 3.2.004 4.801a.57.57 0 0 1-.19.446c-1.059 1.05-2.11 2.107-3.166 3.159-.247.247-.381.53-.317.884a.93.93 0 0 0 1.503.572c.073-.058.139-.126.205-.192 1.148-1.147 2.293-2.3 3.448-3.44.274-.272.4-.573.393-.96-.016-.866-.005-1.732-.005-2.599Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" transform="matrix(-1 0 0 1 24 0)" d="M0 0h24.001v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default HistoryLogIcon;
