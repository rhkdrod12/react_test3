import { CssBaseline } from "@mui/material";
import DynamicProp from "./Component/DynamicProp";
import Header from "./Component/Header";
import MemoTest from "./Component/MemoTest";
import { InsertMenu } from "./Component/Menu";
import MuiDataGrid from "./Component/MuiDataGrid";
// import MuiSelect from "./Component/MuiSelect";
import MyGrid from "./Component/MyGrid";
import MuiHeader from "./MuiComp/MuiHeader";

function App() {
  return (
    <div>
      <MuiHeader></MuiHeader>
      {/* <Header></Header> */}
      {/* <InsertMenu></InsertMenu> */}

      {/* <MemoTest></MemoTest>
      <MuiSelect></MuiSelect> */}
      <MuiDataGrid></MuiDataGrid>
      <MyGrid style={{ width: "800px", margin: "20px" }}></MyGrid>
      {/* <DynamicProp></DynamicProp> */}
    </div>
  );
}

export default App;
