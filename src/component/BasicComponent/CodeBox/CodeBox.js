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

const contextStore = createMutilContext(["event"]);
const CodeBox = ({ data, depth, event }) => {
  console.log(event);
  return (
    <ContextProvider ContextStore={contextStore} Data={{ event }}>
      <CodeBoxContainer data={data} depth={depth}></CodeBoxContainer>
    </ContextProvider>
  );
};

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

  const rectDirect = { positionX: "LEFT", positionY: "BOTTOM" };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <div ref={compRef} style={{ position: "relative", display: "inline-block", width: "fit-content", height: "fit-content" }}>
        {/* <button ref={ref} onClick={onClick(isOpen)} style={{ display: "inline-block", width: 20 }}> */}
        <LibraryAddIcon ref={ref} onClick={onClick(isOpen)} sx={{ transform: "scale(0.7)", color: "#3f3f3f", cursor: "pointer" }}></LibraryAddIcon>
        {/* </button> */}
        {isOpen && data && data.length > 0 ? <CodeBoxWarpper data={data} depth={depth} ref={ref} rectDirect={rectDirect} visible={visible} animationEnd={onAnimationEnd}></CodeBoxWarpper> : null}
      </div>
    </div>
  );
});

const CodeBoxWarpper = memo(
  React.forwardRef(({ data, depth, visible, animationEnd, rectDirect, parentRef }, ref) => {
    // ref 위치에서 현재 comp를 표기할 위치를 계산
    const rect = parentRef ? getCommRefRect(ref, parentRef, rectDirect, { offsetX: -25, offsetY: -8 }) : getCompRect(ref, rectDirect, { offsetX: 5 });
    const pRef = useRef();
    const [selectIndex, setSelectIndex] = useState(-1);

    // console.log(`render CodeBoxContainer ${visible} ${data[0].depth} %o %o`, rect, data);
    return (
      data && (
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
      )
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
  const rectDirect = { positionX: "RIGHT", positionY: "BOTTOM" };

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

  return (
    <li className="code-box-content" ref={compRef} onClick={onDoubleClick}>
      <div style={{ paddingRight: 20 }}>{data.codeName}</div>
      <ChevronRightIcon className="transition code-svg" fontSize="small" color="disabled" sx={{ opacity: `${data.childCodes.length ? 1 : 0}`, ...rotate }} />
      {show && data.childCodes && data.childCodes.length > 0 ? <CodeBoxWarpper {...param}></CodeBoxWarpper> : null}
    </li>
  );
};

export default CodeBox;
