// hook
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { StyleDiv } from "../../StyleComp/StyleComp";
import { getCommRefRect, getCompRect } from "../../../utils/commonUtils";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { createMutilContext, ContextProvider } from "../ContextProvider/ContextProvider";
import { useDoubleClick } from "../../../Hook/useScroll";
import { useMemo } from "react";
// css
import "./CodeBox.css";

const contextStore = createMutilContext(["event", "option"]);
const CodeBox = ({ data, depth, event, option = {} }) => {
  return (
    <React.Fragment>
      <ContextProvider ContextStore={contextStore} Data={{ event, option }}>
        <CodeBoxContainer data={data} depth={depth}></CodeBoxContainer>
      </ContextProvider>
    </React.Fragment>
  );
};

/**
 * [option]
 * 1. depthDirect [object]
 *  - depth에 따라 표기 위치 변경하기 위한 옵션
 *    key를 depth 깊이, value: {positionX: "RIGHT", positionY: "TOP"} 형태로 사용
 *
 *
 */

const CodeBoxContainer = memo(({ data, depth }) => {
  const ref = useRef();
  const compRef = useRef();
  const [isOpen, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const handlerCloseBox = (event) => {
    setOpen((open) => {
      if (open && (!compRef.current || !compRef.current.contains(event.target))) {
        setVisible(false);
      }
      return open;
    });
  };

  useEffect(() => {
    window.addEventListener("click", handlerCloseBox);
    return () => window.removeEventListener("click", handlerCloseBox);
  }, []);

  // 하위에서 종료 여부 확인할 용
  const onAnimationEnd = useCallback((event) => {
    if (event.animationName == "itemFadeOut") {
      setOpen(false);
    }
  }, []);

  // 클릭 이벤트
  const onClick = useCallback(
    (open) => (event) => {
      if (open == false) {
        setOpen(true);
        setVisible(true);
      } else {
        setVisible(false);
      }
    },
    []
  );

  const rectDirect = { positionX: "LEFT", positionY: "BOTTOM", offsetX: 5 };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <div ref={compRef} style={{ position: "relative", display: "inline-block", width: "fit-content", height: "fit-content" }}>
        {/* <button ref={ref} onClick={onClick(isOpen)} style={{ display: "inline-block", width: 20 }}> */}
        <LibraryAddIcon ref={ref} onClick={onClick(isOpen)} sx={{ transform: "scale(0.7)", color: "#3f3f3f", cursor: "pointer" }}></LibraryAddIcon>
        {/* </button> */}
        {isOpen ? (
          <CodeBoxWarpper data={data.filter((item) => item.codeDepth == depth)} depth={depth} ref={ref} rectDirect={rectDirect} visible={visible} animationEnd={onAnimationEnd}></CodeBoxWarpper>
        ) : null}
      </div>
    </div>
  );
});

const NotData = ({ rect }) => {
  return (
    <StyleDiv inStyle={{ zIndex: "10", ...rect }} className={`code-box-depth`}>
      <div className="code-box-container">데이터 없음</div>
    </StyleDiv>
  );
};

const CodeBoxWarpper = memo(
  React.forwardRef(({ data, depth, visible, animationEnd, rectDirect, parentRef }, ref) => {
    const { depthDirection } = useContext(contextStore["option"]);
    // 옵션에 걸려있으면 옵션 우선시
    rectDirect = depthDirection && depthDirection[depth] ? depthDirection[depth] : rectDirect;

    // ref 위치에서 현재 comp를 표기할 위치를 계산
    const rect = parentRef ? getCommRefRect(ref, parentRef, rectDirect) : getCompRect(ref, rectDirect);
    const pRef = useRef();
    const [selectIndex, setSelectIndex] = useState(-1);

    return data ? (
      <StyleDiv ref={pRef} inStyle={{ zIndex: `${depth + 5}`, ...rect }} className={`code-box-depth ${visible ? "on" : "off"}`} onAnimationEnd={animationEnd}>
        <div className="code-box-container">
          <ul className="code-box-scroll">
            {data.map((item, index) => {
              //하위 컴포넌트에 보낼 파라미터
              const param = {
                data: item,
                index,
                setSelectIndex,
                parentRef: pRef,
                show: index == selectIndex,
                depth,
              };
              return <CodeBoxContent key={index} {...param}></CodeBoxContent>;
            })}
          </ul>
        </div>
      </StyleDiv>
    ) : (
      <StyleDiv ref={pRef} inStyle={{ zIndex: `${depth + 5}`, ...rect }} className={`code-box-depth ${visible ? "on" : "off"}`} onAnimationEnd={animationEnd}>
        <StyleDiv inStyle={{ padding: "10px 20px 10px 20px" }} className="code-box-container">
          데이터 없음
        </StyleDiv>
      </StyleDiv>
    );
  })
);

const CodeBoxContent = ({ data, show, index, setSelectIndex, parentRef, depth }) => {
  const compRef = useRef();
  const [compVisible, setVisible] = useState(true);

  const event = useContext(contextStore["event"]);
  // 하위에서 종료 여부 확인할 용
  const onAnimationEnd = useCallback(
    (event) => {
      event.stopPropagation();
      if (event.animationName == "itemFadeOut") {
        setSelectIndex(-1);
      }
    },
    [data]
  );

  // 클릭 이벤트
  const onClick = useCallback(
    (open, index) => (event) => {
      event.stopPropagation();
      if (open == false) {
        setVisible(true);
        setSelectIndex(index);
      } else {
        setVisible(false);
      }
      click(open, index);
    },
    [data]
  );

  // 클릭, 더블 클릭 이벤트
  const onDoubleClick = useDoubleClick(
    () => click(show, index),
    () => {
      if (event.onDblclick) event.onDblclick(data, index, depth);
      // 화면 닫기
      window.document.body.click();
    }
  );

  // 더블 클릭
  const onDblclick = (e) => {
    console.log(e);
    if (event.onDblclick) event.onDblclick(data, index, depth);
    // 화면 닫기
    window.document.body.click();
  };

  const click = useCallback((open, index) => {
    if (open == false) {
      setVisible(true);
      setSelectIndex(index);
    } else {
      setVisible(false);
    }
  });

  // 생성 방향
  const rectDirect = { positionX: "RIGHT", positionY: "BOTTOM", offsetX: -25, offsetY: -8 };

  //하위 컴포넌트에 보낼 파라미터
  const param = {
    data: data.childCodes,
    ref: compRef,
    parentRef,
    rectDirect,
    visible: compVisible,
    animationEnd: onAnimationEnd,
    depth: depth + 1,
  };

  const rotate = show ? { transform: "rotate(90deg)" } : {};
  const isChild = data.childCodes && data.childCodes.length > 0;
  return (
    <li className="code-box-content" ref={compRef} onClick={onDoubleClick}>
      <div style={{ paddingRight: 20 }}>{data.codeName}</div>
      <ChevronRightIcon className="transition code-svg" fontSize="small" color="disabled" sx={{ opacity: `${isChild ? 1 : 0}`, ...rotate }} />
      {show && isChild ? <CodeBoxWarpper {...param}></CodeBoxWarpper> : null}
    </li>
  );
};

export default CodeBox;
