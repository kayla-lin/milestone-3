import { Typography } from "antd";
import React, { FC } from "react";
import { SmileOutlined } from "@ant-design/icons";

type FontSizeType = "sm" | "md" | "lg";

interface Props {
  size?: FontSizeType;
  color?: "white" | "black";
  hideText?: boolean;
}

const Logo: FC<Props> = ({ size, color, hideText }) => {
  // Theme

  let fontSize = "40px";
  let fontColor = "black";
  if (size) {
    switch (size) {
      case "sm":
        fontSize = "10px";
      case "lg":
        fontSize = "50px";
      case "md":
        fontSize = "20px";
    }
  }

  return (
    <Typography.Title
      style={{
        margin: 0,
        height: "auto",
        fontSize: size === "lg" ? "40px" : "20px",
        color: color ?? fontColor,
      }}
    >
      {!hideText && "Tracky"} <SmileOutlined />
    </Typography.Title>
  );
};

export default Logo;
