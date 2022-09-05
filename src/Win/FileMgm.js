import React, { useCallback, useState } from "react";
import RadioComp from "../Component/BasicComponent/RadioComp";
import { StyleDiv } from "../Component/StyleComp/StyleComp";
import { FileDownload } from "./FileDownload";
import { FileUpload } from "./Fileupload";
const FileMgm = () => {
  const [select, setSelect] = useState("0");
  const onChange = useCallback((orgVal, newVal) => {
    setSelect(newVal);
  });

  const data = [
    { id: "fileDownload", value: 0, name: "파일다운로드", checked: true },
    { id: "fileUpload", value: 1, name: "파일업로드" },
  ];

  return (
    <StyleDiv inStyle={{ color: "white" }}>
      <h2>테스트 페이지 입니다.</h2>
      <hr style={{ margin: "10px 0px" }}></hr>
      <RadioComp name="file" data={data} onChange={onChange} />
      {select == "0" ? <FileDownload /> : <FileUpload />}
    </StyleDiv>
  );
};

export default FileMgm;
