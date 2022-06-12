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
import { StyleDiv, StyleLi, StyleUl } from "./Component/StyleComp/StyleComp";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
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

  const itemList = [];

  for (let i = 0; i < 10; i++) {
    itemList.push({ code: `${i}`, codeName: `item${i}`, upperCode: "", depth: 0 });
  }
  for (let i = 10; i < 15; i++) {
    itemList.push({ code: `${i}`, codeName: `item${i}`, upperCode: "1", depth: 1 });
  }

  for (let i = 15; i < 20; i++) {
    itemList.push({ code: `${i}`, codeName: `item${i}`, upperCode: "0", depth: 1 });
  }

  return (
    <div>
      메인페이지
      <button onClick={onClick}>메뉴삽입!</button>
      <StyleDiv inStyle={{ padding: 10 }}>
        <StyleDiv inStyle={{ position: "relative" }}>
          <button style={{ padding: "0px 5px 0px 5px" }}>+</button>
          <CodeBox data={itemList} depth={0}></CodeBox>
        </StyleDiv>
      </StyleDiv>
    </div>
  );
};

const CodeBox = ({ data, depth: dataDepth = 0 }) => {
  console.log(data);
  console.log(data.filter((item) => item.depth == dataDepth));

  const list = data.filter((item) => item.depth == dataDepth);
  const refArr = useRef([]);
  const [childList, setChildList] = useState([]);
  const [react, setReact] = useState();

  const mouseOver = useCallback(
    (item, idx) => (event) => {
      console.log(event);
      console.log(item);
      console.log(idx);
      console.log(refArr.current[idx]);
      console.log(refArr.current[idx].getBoundingClientRect());
      const { top } = refArr.current[idx].getBoundingClientRect();
      setReact((item) => ({ top }));
      setChildList(data.filter((child) => child.upperCode == item.code && child.depth == item.depth + 1));
    },
    [data]
  );

  return (
    <React.Fragment>
      <StyleDiv
        inStyle={{
          padding: 1,
          position: "absolute",
          display: "flex",
          left: dataDepth == 0 ? 25 : "100%",
          top: 0,
        }}
      >
        <StyleDiv
          inStyle={{
            padding: 1,
            border: "1px solid #101010",
            boxShadow: "0 0 9px 2px rgb(0 0 0 / 20%)",
            borderRadius: "5px",
          }}
        >
          <StyleUl>
            {list.map((item, idx) => {
              return (
                <StyleLi ref={(el) => (refArr.current[idx] = el)} onClick={mouseOver(item, idx)} key={idx} style={{ padding: "5px 10px 5px 10px", position: "relative" }}>
                  <div>
                    {item.codeName} {">"}
                  </div>
                </StyleLi>
              );
            })}
          </StyleUl>
        </StyleDiv>
        {childList.length > 0 ? <CodeBox data={childList} depth={dataDepth + 1}></CodeBox> : null}
      </StyleDiv>
    </React.Fragment>
  );
};

const Test = () => {
  return <div>테스트</div>;
};

export default App;
