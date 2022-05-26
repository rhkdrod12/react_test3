import React from "react";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider";
import "./HeaderMenu.css";

/**
 * 일단 해당 메뉴 하위로 생성되게 하려면 띄우려는 곳의 DOM 안쪽에 배치해야함
 *
 *
 */
const headerContextStore = createMutilContext("menuList");
const HeaderMenu = ({ menuList }) => {
  const result = Array.isArray(menuList) ? menuList.filter((menu) => menu.menuDepth == 0) : [];
  return (
    <div className="header-menu-container">
      {result.map((menu, idx) => {
        return <HeaderMenuContent key={idx} menu={menu} menuList={menuList} />;
      })}
    </div>
  );
};

const HeaderMenuContent = ({ menu, menuList }) => {
  const child = menuList.filter((item) => item.upperMenu == menu.menuId);
  return (
    <div className="header-menu-content">
      <div className="header-menu-title">{menu.name}</div>
      <CategoryMenu menuList={child}></CategoryMenu>
    </div>
  );
};

const CategoryMenu = ({ menuList }) => {
  console.log("여기");
  console.log(menuList);

  if (!menuList || menuList.length == 0) return null;

  return (
    <div className="category-menu-container">
      <div className="category-menu-wrap">
        <div>자식</div>
      </div>
    </div>
  );
};

export default HeaderMenu;
