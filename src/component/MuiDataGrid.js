import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "성",
    width: 150,
    // editable: true,
  },
  {
    field: "lastName",
    headerName: "이름",
    width: 150,
    // editable: true,
  },
  {
    field: "age",
    headerName: "나이",
    type: "number",
    width: 110,
    // editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },

  {
    field: "detail",
    headerName: "상세내용",
    description: "상세내용 팝업 호출",
    type: "button",
    sortable: false,
    width: 160,
    // valueGetter: (params) => `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];
// MuiDataGrid-cell:focus
const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 10, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const column2 = [{ field: "id", headerName: "ID", width: 90 }];

export default function DataGridDemo() {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        sx={{
          // boxShadow: 2,
          // border: 2,
          // borderColor: "primary.light",
          "& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:hover": {
            // color: "primary.main",
            outline: 0,
          },
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within": {
            outline: 0,
          },
        }}
        // getRowClassName={(params) => {
        //   console.log(params);
        //   return `super-app-theme--${params.row.status}`;
        // }}
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}
