import { CssBaseline } from "@mui/material";
import DynamicProp from "./Component/DynamicProp";
import Header from "./Component/Header";
import MemoTest from "./Component/MemoTest";
import Menu, { InsertMenu } from "./Component/Menu";
// import MuiHeader from "./Component/MuiComp/MuiHeader";
// import MuiDataGrid from "./Component/MuiDataGrid";
// import MuiSelect from "./Component/MuiSelect";
import MyGrid, { TstGrid } from "./Component/MyGrid2";
import { DepthMenu } from "./Component/TestComp/DepthMenu";
import "./CssModule/GlobalStyle.css";

function App() {
  return (
    <div>
      {/* <Menu></Menu> */}
      {/* <MuiHeader></MuiHeader> */}
      <Header></Header>
      <InsertMenu></InsertMenu>
      {/* <MemoTest></MemoTest>
      <MuiSelect></MuiSelect> */}
      {/* <MuiDataGrid></MuiDataGrid>
      <TstGrid></TstGrid> */}
      {/* <DynamicProp></DynamicProp> */}
    </div>
  );
}

export default App;
