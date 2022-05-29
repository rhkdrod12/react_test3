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
import React, { useCallback, useRef, useState } from "react";
import MenuGrid from "./Component/TestComp/MenuGrid";
import { StyleDiv } from "./Component/StyleComp/StyleComp";

function App() {
  return (
    <div>
      {/* <Menu></Menu> */}
      {/* <MuiHeader></MuiHeader> */}
      <Header></Header>
      <StyleDiv inStyle={{ display: "grid", "grid-template-columns": "30% 70%" }}>
        <InsertMenu></InsertMenu>
        <MenuGrid></MenuGrid>
      </StyleDiv>

      {/* <MemoTest></MemoTest>
      <MuiSelect></MuiSelect> */}
      {/* <MuiDataGrid></MuiDataGrid>
      <TstGrid></TstGrid> */}
      {/* <DynamicProp></DynamicProp> */}
      {/* <Ani></Ani> */}
    </div>
  );
}

// const Ani = () => {
//   const [show, setShow] = useState(false);
//   const [className, setClass] = useState("");
//   const ref = useRef();
//   const onMouseOver = () => {
//     setClass("on");
//     setShow((val) => true);
//     // setTimeout(() => setClass(""), 2000);
//   };

//   const onMouseLeave = () => {
//     console.log(ref);
//     setClass("off");
//     setShow((val) => false);
//     // setTimeout(() => setClass(""), 2000);
//   };

//   return (
//     <div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className="container">
//       <div className="name">여기 ㅇㅇ</div>
//       <div className={`bar ${show ? "on" : "off"}`} ref={ref}></div>
//     </div>
//   );
// };

export default App;
