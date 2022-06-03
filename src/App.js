import { CssBaseline } from "@mui/material";
import DynamicProp from "./Component/DynamicProp";
import Header from "./Component/Header";
import MemoTest from "./Component/MemoTest";
import Menu, { InsertMenu } from "./Component/Menu";
// import MuiHeader from "./Component/MuiComp/MuiHeader";
// import MuiDataGrid from "./Component/MuiDataGrid";
// import MuiSelect from "./Component/MuiSelect";
import MyGrid, { TstGrid } from "./Component/MyGrid2";
import { DepthMenu } from "./Component/BasicComponent/DepthMenu";
import "./CssModule/GlobalStyle.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MenuGrid from "./Component/TestComp/MenuGrid";
import { StyleDiv } from "./Component/StyleComp/StyleComp";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Transition />
    </BrowserRouter>
  );
}

const Transition = () => {
  return (
    <TransitionRouter>
      <Route path="/" element={<Main />}></Route>
      <Route path="/insertMenu" element={<InsertMenu />}></Route>
      <Route path="/test/*" element={<TestNavi />}></Route>
      <Route path="*" element={<UnKnownPage />}></Route>
    </TransitionRouter>
  );
};

const TransitionRouter = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <div
      className={`${transitionStage}`}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setTransistionStage("fadeIn");
          setDisplayLocation(location);
        }
      }}
    >
      <Routes location={displayLocation}>{children}</Routes>
    </div>
  );
};

const TestNavi = () => {
  return (
    <TransitionRouter>
      <Route path="" element={<MenuGrid />}></Route>
      <Route path="test1" element={<Test />}></Route>
    </TransitionRouter>
  );
};

const UnKnownPage = () => {
  return (
    <StyleDiv inStyle={{ display: "flex", "justify-content": "center " }}>
      <StyleDiv inStyle={{ margin: 30, display: "inline-block", fontSize: "40px" }}>Not Found Page</StyleDiv>
    </StyleDiv>
  );
};

const Main = () => {
  const navi = useNavigate();

  const onClick = () => {
    navi("/insertMenu");
  };

  return (
    <div>
      메인페이지
      <button onClick={onClick}>메뉴삽입!</button>
    </div>
  );
};

const Test = () => {
  return <div>테스트</div>;
};

export default App;
