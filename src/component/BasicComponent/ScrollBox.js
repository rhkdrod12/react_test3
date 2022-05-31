import React from "react";
import styled from "styled-components";
import useScroll from "../../Hook/useScroll";
import { StyleDiv } from "../StyleComp/StyleComp";
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
const useScrollBox = ({ rowData, rowComponent: RowComponent, rowParams, options: { itemHeight = 50, visibleCount = 5, offsetCnt = 1, scrollWidth = 10, identity = "@id" } = {} }) => {
  // 스크롤 이벤트 감지 훅 : 스크롤이 이동되면 현재의 스크롤 위치를 반환한다., ref는 스크롤를 감지할 영역
  const [scrollTop, ref] = useScroll(0);
  // 표기해야할 아이템 총개수
  const itemTotalCount = rowData.length;
  // 최대 높이(스크롤의 길이)
  const totalHeight = itemHeight * itemTotalCount;
  // 현재 스크롤에서 시작 idx
  const startIdx = Math.max(Math.floor(scrollTop / itemHeight), 0);
  // 현재 스크롤에서 마지막 idx
  const endIdx = startIdx + visibleCount + offsetCnt;
  // 화면 표현 높이
  const containerHeight = itemHeight * visibleCount;
  // 현재 표기해야할 스크롤 위치
  const offsetY = startIdx * itemHeight;

  return (
    <React.Fragment>
      <StyleOverflowDiv height={containerHeight} scrollWidth={scrollWidth} ref={ref}>
        <StyleScrollDiv height={totalHeight}>
          <StyleDiv inStyle={{ transform: `translateY(${offsetY}px)` }}>
            {rowData
              ? rowData
                  .filter((item, idx) => idx >= startIdx && idx < endIdx)
                  .map((data, idx) =>
                    RowComponent ? <RowComponent key={idx} identity={data[identity]} data={data} rowData={rowData} {...rowParams}></RowComponent> : <div key={idx} data-identity={data[identity]}></div>
                  )
              : null}
          </StyleDiv>
        </StyleScrollDiv>
      </StyleOverflowDiv>
    </React.Fragment>
  );
};

/* =================================================================================
 * style-components
 * =================================================================================*/

const StyleOverflowDiv = styled.div`
  overflow-y: auto;
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

/**
 * &::-webkit-scrollbar {
    width: ${({ scrollWidth }) => (!isNaN(scrollWidth) ? `${scrollWidth}px` : scrollWidth)};
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background: rgbA(240, 240, 240, 1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(210, 210, 210);
  }
 */
export default useScrollBox;
