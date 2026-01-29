import * as React from "react";

export const IconFinance: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { width = 24, height = 24, ...restProps } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M5 17L10 8L14 13L19 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 19H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

IconFinance.displayName = "IconFinance";
