import { CssBaseline, FormControl, Input, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from "@mui/material";
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
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import MenuGrid from "./Component/TestComp/MenuGrid";
import { StyleDiv } from "./Component/StyleComp/StyleComp";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getCommRefRect, getCompRect, getItemRect, makeCssObject } from "./utils/commonUtils";
import styled, { css, keyframes } from "styled-components";
import { useMemo } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CodeBox from "./Component/BasicComponent/CodeBox/CodeBox";
import AccountCircle from "@mui/icons-material/AccountCircle";

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

  let data = [];

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
  // for (i = 25; i < 30; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 0, upperCode: "" });
  // }
  // for (i = 30; i < 35; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 26 });
  // }

  data.forEach((parent) => {
    parent.childCodes = data.filter((child) => parent.code === child.upperCode);
  });

  data = data.filter((child) => child.depth === 0);

  // console.log(data);
  return (
    <div>
      메인페이지
      <button onClick={onClick}>메뉴삽입!</button>
      <hr style={{ paddingBottom: 10 }}></hr>
      <div style={{ padding: 10 }}>
        <CodeBoxInput></CodeBoxInput>
      </div>
    </div>
  );
};

const CodeBoxInput = () => {
  const [value, setValue] = useState("");

  const event = {
    onDblclick: (data, index, depth) => {
      console.log("%o %s %s", data, index, depth);
      setValue(data.codeName);
    },
  };

  const param = value != null && value != "" ? { defaultValue: value } : { value: "sss" };
  const onChange = (event) => {
    setValue(value);
  };
  console.log("render input");
  return (
    <React.Fragment>
      <Paper>
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <CodeBox data={codeData()} depth={0} event={event} />
          <TextField
            InputProps={{
              readOnly: true,
            }}
            id="code"
            label="inputCode"
            placeholder="우측버튼을 클릭"
            variant="outlined"
            value={value}
            onChange={onChange}
            size="small"
          ></TextField>
        </div>
        <br></br>
        <FormControl variant="standard" margin="normal" required>
          <InputLabel shrink htmlFor="input-with-icon-adornment">
            주용도 코드
          </InputLabel>
          <Input required id="input-with-icon-adornment" value={value} onChange={onChange} endAdornment={<CodeBox data={codeData()} depth={0} event={event} />} />
        </FormControl>
        <br></br>
        <FormControl margin="normal">
          <InputLabel shrink htmlFor="component-outlined" sx={{ background: "white" }}>
            주용도 코드
          </InputLabel>
          <OutlinedInput shrink id="component-outlined" label="주용도 코드" value={value} onChange={onChange} endAdornment={<CodeBox data={codeData()} depth={0} event={event} />} />
        </FormControl>
      </Paper>
    </React.Fragment>
  );
};

const Test = ({ value: Value = "" }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(Value);
  }, [Value]);

  const onChange = (event) => {
    setValue(value);
  };

  return <TextField disabled id="code" label="aaa" variant="filled" value={value} onChange={onChange} size="small"></TextField>;
};

const codeData = () => {
  let data = [];

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
  // for (i = 25; i < 30; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 0, upperCode: "" });
  // }
  // for (i = 30; i < 35; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 26 });
  // }

  data.forEach((parent) => {
    parent.childCodes = data.filter((child) => parent.code === child.upperCode);
  });

  data = data.filter((child) => child.depth === 0);

  return data;
};
export default App;
