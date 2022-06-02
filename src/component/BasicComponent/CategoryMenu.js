import styled from "@emotion/styled";
import React, { useCallback, useState, useTransition } from "react";
import { ContextProvider, createMutilContext } from "./ContextProvider";
import { StyleDiv, StyleLi, StyleUl } from "../StyleComp/StyleComp";
import "./HeaderMenu.css";
import { useNavigate } from "react-router-dom";

/**
 * 일단 해당 메뉴 하위로 생성되게 하려면 띄우려는 곳의 DOM 안쪽에 배치해야함
 */
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
  const navi = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const onMouseOver = useCallback((event) => !isOpen && setIsOpen((val) => !val), [isOpen]);
  const onMouseLeave = useCallback((event) => isOpen && setIsOpen(false), [isOpen]);
  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      console.log(menu);
      navi(menu.url);
    },
    [isOpen]
  );

  return (
    <StyleDiv inStyle={{ height: 50 }} className="header-menu-content" onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <div onClick={onClick} className="header-menu-title">
        {menu.name}
      </div>
      {isOpen ? <CategoryMenuContainer menuList={child}></CategoryMenuContainer> : null}
    </StyleDiv>
  );
};

const CategoryMenuContainer = ({ menuList }) => {
  if (!menuList || menuList.length == 0) return null;

  // 카테고리별로 분류
  const categoryMap = menuList
    .sort((a1, a2) => a1.menuOrder - a2.menuOrder)
    .reduce((acc, cur, idx) => {
      console.log();
      if (acc[cur.category]) {
        acc[cur.category].push(cur);
      } else {
        acc[cur.category] = [cur];
      }
      return acc;
    }, {});

  const categoryKey = Object.keys(categoryMap);
  return (
    <div className="category-menu-container fade-in">
      <StyleDiv inStyle={{ gridTemplateColumns: `${categoryKey.length > 1 ? "minmax(150px, auto) minmax(150px, auto)" : "minmax(150px, auto)"}` }} className="category-menu-wrap">
        {categoryKey.map((key, idx) => (
          <CategoryContent key={idx} category={key} data={categoryMap[key]}></CategoryContent>
        ))}
      </StyleDiv>
    </div>
  );
};

const CategoryContent = ({ category, data }) => {
  const navi = useNavigate();

  return (
    <div className="category-item-wrap">
      <div className="category-item-title">
        {category}
        <hr></hr>
      </div>
      <StyleUl className="category-item-content" inStyle={{ width: "fit-content" }}>
        {data.map((item, idx) => {
          const onClick = (event) => {
            event.stopPropagation();
            console.log(item);
            navi(item.url);
          };

          return (
            <StyleLi className="category-item-name" inStyle={{ listStyle: "none", cursor: "pointer" }} key={idx} onClick={onClick}>
              {item.name}
            </StyleLi>
          );
        })}
      </StyleUl>
    </div>
  );
};

export default HeaderMenu;
