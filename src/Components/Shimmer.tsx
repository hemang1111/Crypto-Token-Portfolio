import React from 'react';

interface ShimmerProps {
  width?: string;  // Tailwind width class, e.g., "w-64"
  height?: string; // Tailwind height class, e.g., "h-6"
}

const Shimmer: React.FC<ShimmerProps> = ({
//   width = 'w-100',   // default width
  height = 'h-5',   // default height
}) => {
  return <div className={`shimmer rounded-md ${height}`}></div>;
};

export default Shimmer;
