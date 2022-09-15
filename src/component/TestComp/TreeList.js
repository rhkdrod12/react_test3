import React, { useEffect, useRef, useState } from "react";
import { useGetFetch } from "../../Hook/useFetch";
import { StyleDiv } from "../StyleComp/StyleComp";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { makeEvent } from "../../utils/commonUtils";
import { Paper } from "@mui/material";
import { Fade } from "../BasicComponent/Fade";

export class GraphConfig {
  /**
   *
   * @param {String} name graph의 이름을 나타내는 데이터 며칭
   * @param {Object} value graph의 데이터의 키(부모와 자식을 구분하는)를 나타내는 데이터 명칭
   * @param {Number} depth graph의 깊이를 나타내는 데이터 명칭
   * @param {*} parent graph의 상위를 나타내는 데이터 명칭
   * @param {*} child graph의 하위를 나타내는 데이터 명칭
   * @param {*} index graph의 index를 나타내는 데이터 명칭
   */
  constructor({ name, value, depth, parent, child, index } = {}) {
    this.name = name || "name";
    this.value = value || "value";
    this.depth = depth || "depth";
    this.parent = parent || "parent";
    this.child = child || "child";
    this.index = index || "rowIndex";
  }
}

const makeShowList = (value, list, arr, config) => {
  list.find((item) => item[config.value] == value);
};

/**
 * TreeList를 만드는 컴포넌트
 * @param {{graphConfig: GraphConfig}}
 * @returns
 */
export const GraphList = ({ list, itemEvent, selectedValue, depth = 0, graphConfig }) => {
  const showList = [selectedIndex];

  return (
    <Paper elevation={0} sx={{ padding: "10px", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}>
      <TreeListContainer treeList={list} depth={depth} itemEvent={itemEvent} selectedValue={selectedValue} config={graphConfig} />
    </Paper>
  );
};

const TreeListContainer = ({ treeList, parent, depth = 0, itemEvent, className = "", selectedValue, config }) => {
  const depthItem = treeList.filter((item) => item[config.depth] == depth && item[config.parent] == parent);

  return (
    <StyleDiv className={className} inStyle={{ paddingLeft: 15 }}>
      {depthItem && depthItem.length > 0 ? (
        depthItem.map((item, idx) => {
          return (
            <TreeListItem
              config={config}
              key={idx}
              className={className}
              name={item[config.name]}
              item={item}
              treeList={treeList}
              depth={item[config.depth]}
              itemEvent={itemEvent}
              selectedValue={selectedValue}
            />
          );
        })
      ) : (
        <div>데이터 없음</div>
      )}
    </StyleDiv>
  );
};

const TreeListItem = ({ name, item, treeList, depth = 0, itemEvent, selectedValue, config }) => {
  const [show, setShow] = useState(false);
  // console.log("render TreeListItem %o", item);
  const onClick = (event) => {
    setShow((val) => !val);
  };

  const event = makeEvent(itemEvent, { item });
  const child = treeList.find((child) => child[config.parent] && child[config.parent] == item[config.value]) ? (
    <Fade state={show} fadeIn="listFadeIn" fadeOut="listFadeOut">
      <TreeListContainer config={config} treeList={treeList} parent={item[config.value]} depth={depth + 1} itemEvent={itemEvent} selectedValue={selectedValue} />
    </Fade>
  ) : null;

  const background = selectedValue == item[config.value] ? "#dbedff" : "";

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

export default GraphList;
