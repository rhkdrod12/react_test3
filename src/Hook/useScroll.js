import styled from "@emotion/styled";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { StyleDiv } from "../Component/StyleComp/StyleComp";
import { defaultCssValue } from "../utils/commonUtils";

const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef();
  const onScroll = useCallback(({ target: { scrollTop } }) => {
    setScrollTop(scrollTop);
  });

  useEffect(() => {
    const scrollContainer = ref.current;
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    setScrollTop(scrollContainer.scrollTop);
    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
    };
  }, []);

  return [scrollTop, ref];
};

/**
 * 스크롤(Y)를 생성하는데 필요한 파라미터 생성
 * @param {*} rowData
 * @param {*} param1
 * @returns
 */
export const useScrollYData = (rowData, { visibleCount = 5, itemHeight = 50, offsetCnt = 1 } = {}) => {
  const [ScrollData, setScrollData] = useState({});
  const ref = useRef();

  useEffect(() => {
    setScrollData((data) => {
      const scrollTop = ref.current.scrollTop;
      // 표기해야할 아이템 총개수
      const itemTotalCount = rowData ? rowData.length : 0;
      // 최대 높이(스크롤의 길이)
      const itemTotalHeight = itemHeight * itemTotalCount;
      // 화면 데이터 표현 높이
      const containerHeight = itemHeight * visibleCount; //+ headerHeight;
      // 아이템 한개당 스크롤에 차지하는 높이
      const scrollItemHeight = (itemTotalHeight - containerHeight) / (itemTotalCount - visibleCount);
      // 현재 스크롤에서 시작 idx
      const startIdx = Math.max(Math.floor(scrollTop / scrollItemHeight), 0) || 0;
      // 현재 스크롤에서 마지막 idx
      const endIdx = startIdx + visibleCount + offsetCnt;
      // 현재 표기해야할 스크롤 위치
      const offsetY = scrollTop;
      // 데이터 폼을 자연스럽게 이동시키기 위한
      const dataTranslateY = -scrollTop % scrollItemHeight;
      // 표현할 데이터
      const scrollRowData = rowData ? rowData.filter((item, idx) => idx >= startIdx && idx < endIdx) : null;
      // 스크롤 표기 여부
      const scrollDisplay = rowData.length > visibleCount;

      return { ...data, itemTotalHeight, scrollItemHeight, containerHeight, offsetY, dataTranslateY, scrollTop, startIdx, endIdx, rowData, scrollRowData, scrollDisplay };
    });
  }, [rowData]);

  const onScroll = useCallback(({ target: { scrollTop } }) => {
    // 이벤트 내에서는 state 정보를 가져오지 못하기 때문에 함수형인 setState를 사용해서
    // state값에 접근해야한다.
    setScrollData((data) => {
      // 현재 스크롤에서 시작 idx
      const startIdx = Math.max(Math.floor(scrollTop / data.scrollItemHeight), 0);
      // 현재 스크롤에서 마지막 idx
      const endIdx = startIdx + visibleCount + offsetCnt;
      // 현재 표기해야할 스크롤 위치
      const offsetY = scrollTop;
      // 데이터 폼을 자연스럽게 이동시키기 위한
      const dataTranslateY = -scrollTop % data.scrollItemHeight;
      // 표현할 데이터
      const scrollRowData = data.rowData ? data.rowData.filter((item, idx) => idx >= startIdx && idx < endIdx) : null;
      // 스크롤 표기 여부
      const scrollDisplay = data.rowData.length > visibleCount;

      return { ...data, offsetY, dataTranslateY, scrollTop, startIdx, endIdx, scrollRowData, scrollDisplay };
    });
  }, []);

  useEffect(() => {
    const scrollContainer = ref.current;
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  return [ScrollData, ref];
};

/**
 * 스크롤 파라미터를 주입받아 Y축 스크롤 생성
 */
export const ScrollVirtualYBox = memo(
  React.forwardRef(({ children, scrollData }, ref) => {
    return (
      <StyleDiv inStyle={{ position: "relative", overflow: "hidden", height: scrollData.containerHeight }}>
        <StyleDiv inStyle={{ paddingRight: 18, position: "relative" }}>{children}</StyleDiv>
        {/* Y축 가상 스크롤 */}
        <StyleOverflowDiv inStyle={{}} className="scroll-virtualY-container" height={scrollData.containerHeight} ref={ref}>
          <StyleScrollDiv height={scrollData.itemTotalHeight}>
            <StyleDiv style={{ transform: `translateY(${scrollData.offsetY}px)` }}></StyleDiv>
          </StyleScrollDiv>
        </StyleOverflowDiv>
      </StyleDiv>
    );
  })
);

/**
 * 스크롤 파라미터를 주입받아 Y축 스크롤 생성
 */
export const ScrollYBox = memo(
  React.forwardRef(({ children, scrollData }, ref) => {
    return (
      <StyleDiv inStyle={{ position: "relative", overflow: "hidden", height: scrollData.containerHeight }}>
        <StyleDiv inStyle={{ paddingRight: 18, position: "relative" }}></StyleDiv>
        {/* Y축 가상 스크롤 */}
        <StyleOverflowDiv inStyle={{}} className="scroll-virtualY-container" height={scrollData.containerHeight} ref={ref}>
          <StyleScrollDiv height={scrollData.itemTotalHeight}>
            <StyleDiv style={{ transform: `translateY(${scrollData.offsetY}px)` }}>{children}</StyleDiv>
          </StyleScrollDiv>
        </StyleOverflowDiv>
      </StyleDiv>
    );
  })
);

/*
 * =================================================================================
 * style-components
 * =================================================================================
 */
const StyleOverflowDiv = styled(StyleDiv)`
  position: absolute;
  width: 100%;
  top: 0px;
  right: 0px;
  z-index: 15;
  overflow-y: auto;
  height: ${({ height }) => defaultCssValue(height)};
`;
const StyleScrollDiv = styled.div`
  display: grid;
  position: relative;
  grid-auto-flow: row;
  align-content: start;
  height: ${({ height }) => defaultCssValue(height, "250px")};
`;
//==================================================================================

export const useDoubleClick = (oneFunc, doubleFunc) => {
  let clickCnt = 0;
  let timer;

  return (event) => {
    event.stopPropagation();
    clickCnt++;
    if (clickCnt == 1) {
      timer = setTimeout(() => {
        clickCnt = 0;
        oneFunc();
      }, 140);
    } else {
      clearTimeout(timer);
      clickCnt = 0;
      doubleFunc();
    }
  };
};

export default useScroll;
