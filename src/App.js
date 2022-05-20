import { CssBaseline } from "@mui/material";
import DynamicProp from "./Component/DynamicProp";
import Header from "./Component/Header";
import MemoTest from "./Component/MemoTest";
import { InsertMenu } from "./Component/Menu";
import MuiHeader from "./Component/MuiComp/MuiHeader";
import MuiDataGrid from "./Component/MuiDataGrid";
// import MuiSelect from "./Component/MuiSelect";
import MyGrid, { TstGrid } from "./Component/MyGrid2";

function App() {
  return (
    <div>
      <MuiHeader></MuiHeader>
      {/* <Header></Header> */}
      {/* <InsertMenu></InsertMenu> */}

      {/* <MemoTest></MemoTest>
      <MuiSelect></MuiSelect> */}
      <MuiDataGrid></MuiDataGrid>
      <TstGrid></TstGrid>
      {/* <DynamicProp></DynamicProp> */}
    </div>
  );
}

export default App;
