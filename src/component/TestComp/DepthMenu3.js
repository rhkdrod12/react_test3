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
  return (
    <MenuContainer>
      {menuList
        ? menuList
            .filter((item) => item.menuDepth == 0)
            .map((item, idx) => {
              return <MenuButton key={idx} data={item} depth={0}></MenuButton>;
            })
        : null}
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  display: inline-block;
  position: relative;
  background: rgba(250, 250, 250, 1);
  border-bottom: 1px solid rgba(224, 224, 224, 1);
`;

const MenuButton = ({ data, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const subMenu = data.childMenu && data.childMenu.length > 0;

  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      console.log(data);
    },
    [isOpen]
  );
  const onMouseOver = useCallback((event) => !isOpen && setIsOpen((val) => !val), [isOpen]);
  const onMouseLeave = useCallback((event) => isOpen && setIsOpen(false), [isOpen]);

  const subMenuList = isOpen && subMenu ? <DownSubMenuContainer menuList={data.childMenu} upperRef={ref} depth={depth + 1}></DownSubMenuContainer> : null;

  return (
    <React.Fragment>
      <div ref={ref} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className="menu-container main-menu">
        <div className={`menu-name main-menu-name ${isOpen ? "main-menu-over" : null}`}>
          {data.name}
          {/* <StyleDiv inStyle={{ marginTop: 5, width: "50%", height: 5, background: `${isOpen ? "white" : "black"}` }}></StyleDiv> */}
        </div>
        {subMenuList}
      </div>
    </React.Fragment>
  );
};

const DownSubMenuContainer = ({ menuList, upperRef, depth = 0 }) => {
  const { top, left, width } = getRect(upperRef, "left", "bottom");
  return (
    <StyleDiv inStyle={{ top: top, left: left, minWidth: width }} className="sub-down-menu-container">
      {menuList
        .filter((menu) => menu.menuDepth == depth)
        .map((menu, idx) => (
          <DownSubMenuButton key={idx} data={menu} depth={depth}></DownSubMenuButton>
        ))}
    </StyleDiv>
  );
};

const DownSubMenuButton = ({ data, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const subMenu = data.childMenu && data.childMenu.length > 0;

  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      console.log(data);
      console.log(ref);
    },
    [isOpen]
  );
  const onMouseOver = useCallback((event) => !isOpen && setIsOpen((val) => !val), [isOpen]);
  const onMouseLeave = useCallback((event) => isOpen && setIsOpen(false), [isOpen]);

  const subMenuList = isOpen && subMenu ? <SideSubMenuContainer menuList={data.childMenu} upperRef={ref} depth={depth + 1}></SideSubMenuContainer> : null;

  return (
    <React.Fragment>
      <div ref={ref} className={`menu-content`} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        <div className={`menu-name sub-menu-name ${isOpen ? "menu-over" : ""}`}>
          <div>{data.name}</div>
          <ChevronRightIcon fontSize="small" color="disabled" sx={{ opacity: `${subMenu ? 1 : 0}` }} />
        </div>
        {subMenuList}
      </div>
    </React.Fragment>
  );
};

const SideSubMenuContainer = ({ menuList, upperRef, depth = 0 }) => {
  const { top, left, width } = getRect(upperRef, "right", "top", { offsetY: 1 });
  return (
    <StyleDiv inStyle={{ top, left, minWidth: width }} className={"sub-side-menu-container"}>
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
    console.log(ref);
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
      <div ref={ref} className={`menu-content`} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        <div className={`menu-name sub-menu-name ${isOpen ? "menu-over" : ""}`}>
          <div>{data.name}</div>
          <ChevronRightIcon fontSize="small" color="disabled" sx={{ opacity: `${subMenu ? 1 : 0}` }} />
        </div>
        {subMenuList}
      </div>
    </React.Fragment>
  );
};

/*********************************************************************************************************************************/
const SubMenuButton = ({ data, depth, minWidth, direction = ["right", "top"] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const subMenu = data.childMenu && data.childMenu.length > 0;

  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      console.log(data);
      console.log(ref);
    },
    [isOpen]
  );
  const onMouseOver = useCallback((event) => !isOpen && setIsOpen((val) => !val), [isOpen]);
  const onMouseLeave = useCallback((event) => isOpen && setIsOpen(false), [isOpen]);

  const subMenuList = isOpen && subMenu ? <SubMenuContainer menuList={data.childMenu} upperRef={ref} minWidth={minWidth} depth={depth + 1} direction={direction}></SubMenuContainer> : null;

  return (
    <React.Fragment>
      <div ref={ref} className={`menu-container`} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        <div className={`menu-name sub-menu-name ${isOpen ? "menu-over" : ""}`}>
          {data.name} {subMenu ? <ChevronRightIcon fontSize="small" color="disabled" /> : ""}
        </div>
        {subMenuList}
      </div>
    </React.Fragment>
  );
};

const SubMenuContainer = ({ menuList, upperRef, minWidth, depth = 0, direction = ["right", "top"] }) => {
  const { top, left, width } = getRect(upperRef, ...direction);
  return (
    <StyleDiv inStyle={{ top, left, minWidth: minWidth || width }} className={"sub-side-menu-container"}>
      {menuList
        .filter((menu) => menu.menuDepth == depth)
        .map((menu, menuIdx) => {
          return <SubMenuContent key={menuIdx} data={menu} depth={depth}></SubMenuContent>;
        })}
    </StyleDiv>
  );
};

const SubMenuContent = ({ data, depth }) => {
  const ref = useRef();
  const subMenu = data.childMenu && data.childMenu.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const onClick = (e) => {
    e.stopPropagation();
    console.log(data);
    console.log(ref);
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
      <div ref={ref} className={`menu-container`} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        <div className={`menu-name sub-menu-name ${isOpen ? "menu-over" : ""}`}>
          {data.name} {subMenu ? <ChevronRightIcon fontSize="small" color="disabled" /> : ""}
        </div>
        {subMenuList}
      </div>
    </React.Fragment>
  );
};
/*********************************************************************************************************************************/
