import * as React from "react";

export const IconPlus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
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
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

IconPlus.displayName = "IconPlus";
