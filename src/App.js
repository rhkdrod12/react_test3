import { FormControl, Input, InputLabel, OutlinedInput, Paper, TextField } from "@mui/material";
import Header from "./Component/Header";
import { InsertMenu } from "./Component/Menu";
// import MuiHeader from "./Component/MuiComp/MuiHeader";
// import MuiDataGrid from "./Component/MuiDataGrid";
// import MuiSelect from "./Component/MuiSelect";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CodeBox from "./Component/BasicComponent/CodeBox/CodeBox";
import { StyleDiv } from "./Component/StyleComp/StyleComp";
import BottomNavibar from "./Component/TestComp/BottomNavibar";
import MenuGrid from "./Component/TestComp/MenuGrid";
import "./CssModule/GlobalStyle.css";

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
      <Route path="/menu/*">
        <Route path="insertMenu" element={<InsertMenu />}></Route>
      </Route>
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
    navi("/menu/insertMenu");
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
      {/* <div style={{ padding: 10 }}>
        <CodeBoxInput></CodeBoxInput>
      </div> */}
      <div style={{ width: 420 }}>
        <div>
          <InsertMenu></InsertMenu>
        </div>
        <div style={{ height: "110px", display: "flex", alignItems: "flex-end", margin: "0 10px" }}>
          <BottomNavibar></BottomNavibar>
        </div>
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

  // 그래도 나름 열심히 만들었음!
  const option = {
    depthDirection: {
      0: { positionX: "RIGHT", positionY: "BOTTOM", offsetX: "", offsetY: "" },
    },
  };

  const codeBox = <CodeBox data={codeData()} depth={0} event={event} option={option} />;

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
          <InputLabel htmlFor="input-with-icon-adornment">코드</InputLabel>
          <Input required id="input-with-icon-adornment" value={value} onChange={onChange} endAdornment={<CodeBox data={codeData()} depth={0} event={event} />} />
        </FormControl>
        <br></br>
        <FormControl margin="normal" size="small" required>
          <InputLabel htmlFor="component-outlined" sx={{ background: "white" }}>
            코드
          </InputLabel>
          <OutlinedInput readOnly id="component-outlined" label="코드" value={value} onChange={onChange} endAdornment={codeBox} />
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
  for (i = 0; i < 20; i++) {
    data.push({ codeName: `메뉴${i}`, code: i, depth: 0, upperCode: "" });
  }

  // for (i = 0; i < 5; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 0, upperCode: "" });
  // }

  // for (i = 5; i < 10; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 0 });
  // }

  // for (i = 10; i < 15; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 1 });
  // }
  // for (i = 16; i < 20; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 4 });
  // }

  // for (i = 21; i < 25; i++) {
  //   data.push({ codeName: `item${i}`, code: i, depth: 2, upperCode: 9 });
  // }
  // // for (i = 25; i < 30; i++) {
  // //   data.push({ codeName: `item${i}`, code: i, depth: 0, upperCode: "" });
  // // }
  // // for (i = 30; i < 35; i++) {
  // //   data.push({ codeName: `item${i}`, code: i, depth: 1, upperCode: 26 });
  // // }

  data.forEach((parent) => {
    parent.childCodes = data.filter((child) => parent.code === child.upperCode);
  });

  data = data.filter((child) => child.depth === 0);

  return data;
};
export default App;
