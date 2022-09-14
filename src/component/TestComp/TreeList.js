import React, { useEffect, useRef, useState } from "react";
import { useGetFetch } from "../../Hook/useFetch";
import { StyleDiv } from "../StyleComp/StyleComp";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { makeEvent } from "../../utils/commonUtils";
import { Paper } from "@mui/material";
import { Fade } from "../BasicComponent/Fade";

export /**
 * TreeList를 만드는 컴포넌트
 * @returns
 */
const TreeList = ({ list, itemEvent, selectedIndex, depth = 0 }) => {
  // console.log("render TreeList %o", list);

  return (
    <Paper elevation={0} sx={{ padding: "10px", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}>
      <TreeListContainer treeList={list} depth={depth} itemEvent={itemEvent} selectedIndex={selectedIndex} />
    </Paper>
  );
};

const TreeListContainer = ({ treeList, upperCode, depth = 0, itemEvent, className = "", selectedIndex }) => {
  const depthItem = treeList.filter((item) => item.codeDepth == depth && item.upperCode == upperCode);

  return (
    <StyleDiv className={className} inStyle={{ paddingLeft: 15 }}>
      {depthItem && depthItem.length > 0 ? (
        depthItem.map((item, idx) => {
          return <TreeListItem key={idx} lassName={className} name={item.codeName} item={item} treeList={treeList} depth={item.codeDepth} itemEvent={itemEvent} selectedIndex={selectedIndex} />;
        })
      ) : (
        <div>데이터 없음</div>
      )}
    </StyleDiv>
  );
};

const TreeListItem = ({ name, item, treeList, depth = 0, itemEvent, selectedIndex }) => {
  const [show, setShow] = useState(false);
  // console.log("render TreeListItem %o", item);
  const onClick = (event) => {
    setShow((val) => !val);
  };

  const event = makeEvent(itemEvent, { item });
  const child = treeList.find((child) => child.upperCode == item.code) ? (
    <Fade state={show} fadeIn="listFadeIn" fadeOut="listFadeOut">
      <TreeListContainer treeList={treeList} upperCode={item.code} depth={depth + 1} itemEvent={itemEvent} selectedIndex={selectedIndex} />
    </Fade>
  ) : null;

  const background = selectedIndex == item.rowIndex ? "#dbedff" : "";

  return (
    <React.Fragment>
      <StyleDiv inStyle={{ display: "grid", gridTemplateColumns: "25px minmax(100px, auto)", alignItems: "center", height: 30, background: background }}>
        {child ? <AddBoxIcon sx={{ padding: "2px", cursor: "pointer" }} onClick={onClick} /> : <ArrowRightIcon sx={{ padding: "2px" }} />}
        <span style={{ padding: "2px", cursor: "pointer" }} {...event}>
          {name}
        </span>
      </StyleDiv>
      {child}
    </React.Fragment>
  );
};

export default TreeList;
