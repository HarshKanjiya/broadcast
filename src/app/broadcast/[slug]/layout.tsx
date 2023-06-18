import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

layout.displayName = "layout";
export default layout;
