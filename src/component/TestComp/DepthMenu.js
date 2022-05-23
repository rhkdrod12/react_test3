import { StyleDiv } from "../StyleComp/StyleComp";
import styled from "styled-components";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider";
import menuStyle from "../../CssModule/Menu.module.css";
import "./DepthMenu.css";
import { getRect } from "../../utils/commonUtils";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export const DepthMenu = ({ menuList }) => {
  console.log("받은 메뉴!");
  console.log(menuList);
  return (
    <MenuContainer>
      {menuList
        ? menuList
            .filter((item) => item.menuDepth == 0)
            .map((item, idx) => {
              return <MenuButton key={idx} data={item} Top={45}></MenuButton>;
            })
        : null}
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  display: inline-block;
  position: relative;
  ${"" /* border: 1px solid rgba(224, 224, 224, 1); */}
  background: rgba(250, 250, 250, 1);
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  ${"" /* border-radius: 2px; */};
`;

const MenuContext = createMutilContext(["depth"]);
const MenuButton = ({ data, Top }) => {
  const [menuList, setMenuList] = useState();
  const ref = useRef();
  const onClick = (e) => {
    e.stopPropagation();
    console.log(data);
  };

  //useEffect를 사용하여 window에 event를 넣어 해당 이벤트를 취소 시킬 수 있는 이벤트를 만들 수 있다!!

  const [isOpen, setIsOpen] = useState(false);
  const [depth, setDepth] = useState(true);
  const subMenu = data.childMenu && data.childMenu.length > 0;

  // const handleClickOutside = useCallback(({ target }) => {
  //   if (isOpen && subMenu && !ref.current.contains(target)) {
  //     setIsOpen(false);
  //   } // -> 컴포넌트가 target을 포함하고 있지않으면 외부 이벤트로 판단하여 화면을 닫는 이벤트를 넣으면 됨
  // });
  const onMouseOver = useCallback((event) => {
    !isOpen && setIsOpen(!isOpen);
  }, []);

  const onMouseLeave = (target) => {
    isOpen && setIsOpen(false);
  };

  const subMenuList = isOpen && subMenu ? <DownSubMenuContainer menuList={data.childMenu} upperRef={ref} depth={1}></DownSubMenuContainer> : null;

  return (
    <React.Fragment>
      <ContextProvider ContextStore={MenuContext} Data={{ depth: [depth, setDepth] }}>
        <div ref={ref} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className="menu-container main-menu">
          <div className={`menu-name main-menu-name ${isOpen ? "main-menu-over" : null}`}>
            {data.name}
            <StyleDiv inStyle={{ marginTop: 5, width: "50%", height: 5, background: "black" }}></StyleDiv>
          </div>
          {subMenuList}
        </div>
      </ContextProvider>
    </React.Fragment>
  );
};

const DownSubMenuContainer = ({ menuList, upperRef, depth = 0 }) => {
  return (
    <StyleDiv inStyle={getRect(upperRef, "left", "bottom")} className="sub-down-menu-container">
      {menuList
        .filter((menu) => menu.menuDepth == depth)
        .map((menu, idx) => (
          <DownSubMenuButton key={idx} data={menu} depth={depth}></DownSubMenuButton>
        ))}
    </StyleDiv>
  );
};

const DownSubMenuButton = ({ data, idx, depth }) => {
  const ref = useRef();
  const onClick = (e) => {
    e.stopPropagation();
    console.log(data);
  };
  const [isOpen, setIsOpen] = useState(false);
  const subMenu = data.childMenu && data.childMenu.length > 0;

  const onMouseOver = useCallback((event) => {
    !isOpen && setIsOpen(!isOpen);
  }, []);

  const onMouseLeave = (target) => {
    isOpen && setIsOpen(false);
  };

  const subMenuList = isOpen && subMenu ? <SideSubMenuContainer menuList={data.childMenu} upperRef={ref} depth={depth + 1}></SideSubMenuContainer> : null;

  return (
    <React.Fragment>
      <div className={`menu-container`} ref={ref} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        <div className={`menu-name sub-menu-name ${isOpen ? "menu-over" : ""}`}>
          {data.name} {subMenu ? <ChevronRightIcon fontSize="small" color="disabled" /> : ""}
        </div>
        {subMenuList}
      </div>
    </React.Fragment>
  );
};

const SideSubMenuContainer = ({ menuList, upperRef, depth = 0 }) => {
  return (
    <StyleDiv inStyle={getRect(upperRef, "right", "top")} className={"sub-side-menu-container"}>
      {menuList
        .filter((menu) => menu.menuDepth == depth)
        .map((menu, menuIdx) => {
          return <SideSubMenuButton key={menuIdx} data={menu} depth={depth}></SideSubMenuButton>;
        })}
    </StyleDiv>
  );
};

const SideSubMenuButton = ({ data, depth }) => {
  const ref = useRef();
  const subMenu = data.childMenu && data.childMenu.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const onClick = (e) => {
    e.stopPropagation();
    console.log(data);
  };
  const onMouseOver = useCallback((event) => {
    !isOpen && setIsOpen(!isOpen);
  }, []);

  const onMouseLeave = (target) => {
    isOpen && setIsOpen(false);
  };

  const subMenuList = isOpen && subMenu ? <SideSubMenuContainer menuList={data.childMenu} upperRef={ref} depth={depth + 1}></SideSubMenuContainer> : null;

  return (
    <React.Fragment>
      <div className={`menu-container`} ref={ref} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        <div className={`menu-name sub-menu-name ${isOpen ? "menu-over" : ""}`}>
          {data.name} {subMenu ? <ChevronRightIcon fontSize="small" color="disabled" /> : ""}
        </div>
        {subMenuList}
      </div>
    </React.Fragment>
  );
};
