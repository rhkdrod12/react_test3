import React from "react";
import Menu from "./Menu";
import HeaderStyle from "../CssModule/Menu.module.css";
import MenuIcon from "@mui/icons-material/Menu";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import styled from "styled-components";
import { StyleDiv, StyleHeader } from "./StyleComp/StyleComp";
import { useMediaQuery } from "react-responsive";

const Header = () => {
  const ss = { "border-radius": "100%", background: "white" };
  // useMediaQuery => 화면의 크기가 변동을 감지할 수 있는 훅
  // 재랜더링이 들어가기 때문에 안좋을 수도.. Media로 처리하는게 맞을지도..
  // 재랜더링이 들어가면 하위 화면에 통신하는 애들이 있으면.. 문제가 생길텐데.
  const isWidth = useMediaQuery({ minWidth: 1000 });
  const height = 40;

  return isWidth ? (
    <Headers inStyle={{ height }} className={HeaderStyle["header-wrap"]}>
      {/* 왼쪽 항목*/}
      <StyleDiv inStyle={{ padding: "0px 10px 0px 10px", width: 200, textAlign: "left", display: "flex" }}>
        <MenuListIcon></MenuListIcon>
        <StyleDiv className={HeaderStyle["header-title"]}>TEST</StyleDiv>
      </StyleDiv>
      {/* 메뉴항목 */}
      <Menu height={height}></Menu>
      {/* 오른쪽 항목 */}
      <StyleDiv inStyle={{ padding: "0px 10px 0px 10px", width: 100, display: "flex", justifyContent: "center" }}></StyleDiv>
    </Headers>
  ) : (
    <header className={HeaderStyle["header-wrap"]}>
      <MenuListIcon color="primary"></MenuListIcon>
      <StyleDiv inStyle={{ padding: "0px 10px 0px 10px", width: 200, textAlign: "left" }} className={HeaderStyle["header-title"]}>
        TEST
      </StyleDiv>
    </header>
  );
};

const Headers = styled(StyleHeader)``;

const MenuListIcon = () => {
  return (
    <StyleFocusDiv>
      <MenuIcon></MenuIcon>
    </StyleFocusDiv>
  );
};

/* hover시 사이즈 살짝 크게 */
const StyleFocusDiv = styled.button`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: fit-content;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  padding: 10px;
  position: relative;
  &:hover {
    cursor: pointer;
  }
  svg:hover {
    transform: scale(1.1);
  }
`;

export default Header;
