import React from "react";

interface SelectIconProps {
  iconUrl: string;
}

export const SelectIcon: React.FC<SelectIconProps> = ({ iconUrl }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        padding: "0.375rem",
        marginRight: "0.375rem",
      }}
    >
      <img
        src={iconUrl}
        alt="Icon"
        style={{
          width: 24,
          height: 24,
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "1px",
          height: "86%", // Adjust this percentage to control border height
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      />
    </div>
  );
};
