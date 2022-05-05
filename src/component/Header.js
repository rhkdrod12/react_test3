import React from "react";
import Menu from "./Menu";
import HeaderStyle from "./Menu.module.css";

const Header = () => {
  return (
    <header className={HeaderStyle["header-wrap"]}>
      <div className={HeaderStyle["header-title"]}>Header title</div>
      <Menu></Menu>
    </header>
  );
};

export default Header;
