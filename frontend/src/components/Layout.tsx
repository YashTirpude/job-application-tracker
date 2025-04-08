// src/components/Layout.tsx
import React from "react";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </>
  );
};

export default Layout;
