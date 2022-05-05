import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetFetch } from "../utils/commonUtils";
import menuStyle from "./Menu.module.css";

const Menu = () => {
  // customHook에서 state를 만들어서 반환시키기 때문에 state가 변화하면 이 화면도 자동적으로 갱신 될 것임
  const menus = useGetFetch("http://localhost:8080/menu/get", {
    param: { menuType: "HEADER" },
  });

  // const menuContentStyle = menuStyle["menu-content"];
  // const menuItemStyle = menuStyle["menu-item"];

  const { "menu-content": menuContentStyle, "menu-item": menuItemStyle } =
    menuStyle;

  return (
    <div className={menuContentStyle}>
      {Array.isArray(menus)
        ? menus.map((item, index) => {
            return (
              <MenuItem
                key={index}
                Number={index}
                name={item.name}
                url={item.url}
                className={menuItemStyle}
              ></MenuItem>
            );
          })
        : null}
    </div>
  );
};

const MenuItem = ({ name, Number, url, className }) => {
  // const navi = useNavigate();
  return (
    <div className={className}>
      <a onClick={() => console.log(`${url}로 이동`)}>{`${
        Number + 1
      }.${name}`}</a>
    </div>
  );
};

export default Menu;
