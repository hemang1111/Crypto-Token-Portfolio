import React from "react";

interface NoDataProps {
  message?: string;
  image?: string;
  height?: string;
  width?: string;
}

const NoData: React.FC<NoDataProps> = ({
  message = "No data found",
  image = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png", // default placeholder image
  height = "h-32",
  width = "w-32",
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 text-gray-400">
      <img src={image} alt="No data" className={`${height} ${width} mb-4 opacity-80`} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default NoData;
