import React from "react";
import styled from "styled-components";
import useScroll from "../Hook/useScroll";
/**
 * 가상 스크롤 컴포넌트
 * @param {children} 자식 컴포넌트 배열
 * @param {options}
 * options - 스크롤 옵션
 * 기본 열 높이 : itemHeight(defualt 50px)
 * 화면에 랜더링 개수 : visibleCount(defualt 5)
 * 미리 생성시킬 개수 : offsetCnt(defualt 1)
 * @returns
 */
const ScrollBox = ({ children, options: { itemHeight = 50, visibleCount = 5, offsetCnt = 1 } = {} }) => {
  const [scrollTop, ref] = useScroll();

  const itemCount = children.length;
  // 최대 높이(스크롤의 길이)
  const totalHeight = itemHeight * itemCount;
  // 시작 idx
  const startIdx = Math.max(Math.floor(scrollTop / itemHeight), 0);

  // 화면 표현 높이
  const containerHeight = itemHeight * visibleCount;

  // 마지막 idx
  const endIdx = startIdx + visibleCount + offsetCnt;
  // 현재 표기해야할 스크롤 위치
  const offsetY = startIdx * itemHeight;

  return (
    <StyleOverflowDiv height={containerHeight} ref={ref}>
      <StyleScrollDiv height={totalHeight}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>{children.filter((item, idx) => idx >= startIdx && idx < endIdx)}</div>
      </StyleScrollDiv>
    </StyleOverflowDiv>
  );
};

/*
 * =================================================================================
 * style-components
 * =================================================================================
 */
const StyleOverflowDiv = styled.div`
  overflow: auto;
  height: ${({ height }) => (!isNaN(height) ? `${height}px` : height)};
`;
const StyleScrollDiv = styled.div`
  display: grid;
  position: relative;
  grid-auto-flow: row;
  align-content: start;
  height: ${({ height }) => (height ? `${height}px` : "250px")};
`;
//==================================================================================

export default ScrollBox;
