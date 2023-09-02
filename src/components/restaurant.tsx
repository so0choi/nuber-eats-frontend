import React from "react";

interface IRestaurantProps {
  id: string;
  coverImage: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImage,
  name,
  categoryName,
}) => (
  <div className={`flex flex-col`}>
    <div
      className={`py-28 bg-cover bg-center mb-2`}
      style={{
        backgroundImage: `url(${coverImage})`,
      }}
    ></div>
    <h3 className={`text-xl font-medium`}>{name}</h3>
    <span
      className={`border-t mt-3 py-2 text-xs opacity-50 py-3 border-gray-300`}
    >
      {categoryName}
    </span>
  </div>
);
