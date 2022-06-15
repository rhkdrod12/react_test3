import { StyleDiv } from "../StyleComp/StyleComp";
import styled from "styled-components";
import React, { useCallback, useRef, useState } from "react";
import "./DepthMenu.css";
import { getRect } from "../../utils/commonUtils";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router";

export const DepthMenu = ({ menuList, height = 40 }) => {
  return (
    <MenuContainer inStyle={{ height }}>
      {menuList
        ? menuList
            .filter((item) => item.menuDepth == 0)
            .map((item, idx) => {
              return (
                <MenuButton key={idx} data={item} depth={0}>
                  <MainMenuBtn data={item} height={height}></MainMenuBtn>
                </MenuButton>
              );
            })
        : null}
    </MenuContainer>
  );
};

const MenuContainer = styled(StyleDiv)`
  display: inline-flex;
  position: relative;
  background: #5f8ae7;
`;

const MainMenuBtn = ({ data, isOpen, height = 40 }) => {
  return (
    <StyleDiv inStyle={{ height }} className={`main-menu-container ${isOpen ? "main-menu-over" : ""}`}>
      <div className={`main-menu-name`}>{data.name}</div>
      <div className={`main-menu-bar`} />
    </StyleDiv>
  );
};

const MenuButton = ({ children, data, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const subMenu = data.childMenu && data.childMenu.length > 0;

  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      console.log("%o 이동 ", data);
    },
    [isOpen]
  );
  const onMouseOver = useCallback((event) => !isOpen && setIsOpen(true), [isOpen]);
  const onMouseLeave = useCallback((event) => isOpen && setIsOpen(false), [isOpen]);

  /** default direction: ["right", "top"] */
  const depthDirection = {
    1: ["left", "bottom"],
  };

  return (
    <React.Fragment>
      <div ref={ref} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className="menu-content main-menu">
        {/* 자식에게 props 추가하여 전달! */}
        {React.cloneElement(children, { isOpen })}
        {isOpen && subMenu ? <SubMenuContent menuList={data.childMenu} upperRef={ref} depth={depth + 1} depthDirection={depthDirection} /> : null}
      </div>
    </React.Fragment>
  );
};

/*********************************************************************************************************************************/
const SubMenuContent = ({ menuList, upperRef, minWidth, depth = 0, depthDirection = {} }) => {
  const direction = depthDirection[depth] ? depthDirection[depth] : ["right", "top"];
  const { top, left, width } = getRect(upperRef, ...direction, { offsetY: 1 });
  return (
    <StyleDiv inStyle={{ top, left, minWidth: minWidth || width }} className={"sub-side-menu-container"}>
      {menuList
        .filter((menu) => menu.menuDepth == depth)
        .map((menu, menuIdx) => {
          return <SubMenuButton key={menuIdx} data={menu} depth={depth} depthDirection={depthDirection}></SubMenuButton>;
        })}
    </StyleDiv>
  );
};

const SubMenuButton = ({ data, depth, minWidth, depthDirection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const subMenu = data.childMenu && data.childMenu.length > 0;

  const navi = useNavigate();
  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      console.log(data.url + " 이동 ");
      console.log(ref);
      navi(data.url);
    },
    [isOpen]
  );
  const onMouseOver = useCallback((event) => !isOpen && setIsOpen((val) => !val), [isOpen]);
  const onMouseLeave = useCallback((event) => isOpen && setIsOpen(false), [isOpen]);

  return (
    <React.Fragment>
      <div ref={ref} className={`menu-content`} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        <div className={`menu-name sub-menu-name ${isOpen ? "menu-over" : ""}`}>
          <div>{data.name}</div>
          <ChevronRightIcon fontSize="small" color="disabled" sx={{ opacity: `${subMenu ? 1 : 0}` }} />
        </div>
        {isOpen && subMenu ? <SubMenuContent menuList={data.childMenu} upperRef={ref} minWidth={minWidth} depth={depth + 1} depthDirection={depthDirection} /> : null}
      </div>
    </React.Fragment>
  );
};

/*********************************************************************************************************************************/
