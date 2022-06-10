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

  const data = [];

  let i;
  for (i = 0; i < 5; i++) {
    data.push({ codeName: `item${i}`, code: i, depth: 0, upperCode: "" });
  }

  for (i = 5; i < 10; i++) {
    data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 0 });
  }

  for (i = 10; i < 15; i++) {
    data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 1 });
  }
  for (i = 16; i < 20; i++) {
    data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 4 });
  }

  for (i = 21; i < 25; i++) {
    data.push({ codeName: `item${i}`, code: i, depth: 2, upperCode: 9 });
  }

  data.forEach((parent) => {
    parent.childCodes = data.filter((child) => parent.code === child.upperCode);
  });

  console.log(data);
  return (
    <div>
      메인페이지
      <button onClick={onClick}>메뉴삽입!</button>
      <hr style={{ paddingBottom: 10 }}></hr>
      <div>
        <CodeBox data={data} depth={0} />
      </div>
    </div>
  );
};

const CodeBox = ({ data, depth }) => {
  return (
    <div style={{ position: "relative" }}>
      <button style={{ display: "inline-block", width: 20 }}>+</button>
      <CodeBoxDepth data={data} depth={0} rect={{ left: 25, top: 77 }}></CodeBoxDepth>
    </div>
  );
};

const CodeBoxDepth = ({ data, depth = 0, rect = {} }) => {
  // 현재 depth의 표기 아이템
  const [depthData, setDepthData] = useState(data.filter((item) => item.depth === depth));
  const [child, setChild] = useState();
  const [childRect, setChildRect] = useState();

  const compRef = useRef();
  const itemRefs = useRef([]);

  const onClick = useCallback(
    (idx) => (event) => {
      setChild(depthData[idx].childCodes);
      setChildRect(() => {
        const itemRect = itemRefs.current[idx].getBoundingClientRect();
        const compRect = compRef.current.getBoundingClientRect();
        const winRect = { width: window.innerWidth, height: window.innerHeight };

        const top = compRect.top > itemRect.top ? compRect.top : itemRect.top;
        const left = compRect.left + compRect.width + 5;

        return { top, left };
      });
    },
    [data]
  );

  console.log(`depth: ${depth}`);
  console.log(child);
  console.log(childRect);
  console.log(compRef.current);

  useEffect(() => {
    return () => {
      console.log(depth + "파괴");
      setDepthData((item) => []);
      setChild((item) => []);
    };
  }, []);

  return (
    <div style={rect} className="code-box-depth">
      <div className="code-box-container" ref={compRef}>
        <ul className="code-box-scroll">
          {depthData.map((item, idx) => {
            return (
              <React.Fragment key={idx}>
                <li className="code-box-content" ref={(el) => (itemRefs.current[idx] = el)} onClick={onClick(idx)} style={{ position: "relative", padding: "10px" }}>
                  <div>{item.codeName}</div>
                  <div>{item.childCodes.length > 0 ? ">" : ""}</div>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
        {child && child.length > 0 ? <CodeBoxDepth data={child} depth={depth + 1} rect={childRect}></CodeBoxDepth> : ""}
      </div>
    </div>
  );
};

const Test = () => {
  return <div>테스트</div>;
};

export default App;
