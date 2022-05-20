import React from "react";
import styled from "styled-components";
import useScroll from "../../Hook/useScroll";
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
const ScrollBox = ({ children, options: { itemHeight = 50, visibleCount = 5, offsetCnt = 1, scrollWidth = 10 } = {} }) => {
  // 스크롤 이벤트 감지 훅 : 스크롤이 이동되면 현재의 스크롤 위치를 반환한다., ref는 스크롤를 감지할 영역
  const [scrollTop, ref] = useScroll();
  // 표기해야할 아이템 총개수
  const itemTotalCount = children.length;
  // 최대 높이(스크롤의 길이)
  const totalHeight = itemHeight * itemTotalCount;
  // 시작 idx
  const startIdx = Math.max(Math.floor(scrollTop / itemHeight), 0);
  // 화면 표현 높이
  const containerHeight = itemHeight * visibleCount;
  // 마지막 idx
  const endIdx = startIdx + visibleCount + offsetCnt;
  // 현재 표기해야할 스크롤 위치
  const offsetY = startIdx * itemHeight;

  return (
    // 스크롤이 표기될 영역
    <StyleOverflowDiv height={containerHeight} scrollWidth={scrollWidth} ref={ref}>
      {/* 가상의 영역 (총 데이터가 표기해야할 높이를 계산하여 가지고 있는 영역) */}
      <StyleScrollDiv height={totalHeight}>
        {/* 
          List 출력 영역 
          앞의 데이터를 filter하고 하는게 더 좋긴 하겠지만 큰 차이는 아닐꺼라 생각하기 때문에 문제는 없을 듯
        */}
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
  overflow-y: auto;
  height: ${({ height }) => (!isNaN(height) ? `${height}px` : height)};
  &::-webkit-scrollbar {
    width: ${({ scrollWidth }) => (!isNaN(scrollWidth) ? `${scrollWidth}px` : scrollWidth)};
    height: 10px;
  }
  ${"" /* 스크롤바 배경 */}
  &::-webkit-scrollbar-track {
    background: rgbA(240, 240, 240, 1);
    ${"" /* border-radius: 10px; */}
  }
  ${"" /* 스크롤바 */}
  &::-webkit-scrollbar-thumb {
    background: rgb(210, 210, 210);
    ${"" /* border-radius: 10px; */}
  }
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
