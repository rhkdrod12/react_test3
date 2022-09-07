import React, { useEffect, useState } from "react";
import { useGetFetch } from "../../Hook/useFetch";
import { StyleDiv } from "../StyleComp/StyleComp";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { makeEvent } from "../../utils/commonUtils";
import { Paper } from "@mui/material";

export /**
 * TreeList를 만드는 컴포넌트
 * @returns
 */
const TreeList = ({ list, itemEvent }) => {
  console.log("render TreeList");
  return (
    <Paper elevation={0} sx={{ padding: "10px", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}>
      <TreeListContainer treeList={list} depth={0} itemEvent={itemEvent} />
    </Paper>
  );
};

const TreeListContainer = ({ treeList, depth = 0, itemEvent, className = "" }) => {
  return (
    <React.Fragment>
      {treeList && treeList.length > 0 ? (
        treeList.map((item, idx) => {
          const hasChild = item.childCodes && item.childCodes.length > 0;
          const childItem = hasChild ? <TreeListContainer className={"list-fade-in"} treeList={item.childCodes} depth={depth + 1} itemEvent={itemEvent} /> : null;
          return <TreeListItem key={idx} className={className} name={item.codeName} item={item} hasChild={hasChild} depth={item.codeDepth} child={childItem} itemEvent={itemEvent} />;
        })
      ) : (
        <div>데이터 없음</div>
      )}
    </React.Fragment>
  );
};

const TreeListItem = ({ name, item, hasChild = false, child, depth = 0, itemEvent, className }) => {
  const [show, setShow] = useState(false);
  const onClick = () => {
    setShow((item) => !item);
  };

  useEffect(() => {
    return () => {
      console.log("컴포넌트 사라짐 ");
      setShow(false);
    };
  }, []);

  const event = makeEvent(itemEvent, { item });

  return (
    <React.Fragment>
      <StyleDiv className={className} inStyle={{ display: "grid", gridTemplateColumns: "25px minmax(100px, auto)", alignItems: "center", paddingLeft: depth * 15, height: 30 }}>
        {hasChild ? <AddBoxIcon sx={{ padding: "2px", cursor: "pointer" }} onClick={onClick} /> : <ArrowRightIcon sx={{ padding: "2px" }} />}
        <span style={{ padding: "2px", cursor: "pointer" }} {...event}>
          {name}
        </span>
      </StyleDiv>
      {show && child}
    </React.Fragment>
  );
};

export default TreeList;
