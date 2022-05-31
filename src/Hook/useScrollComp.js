import React from "react";

const useScrollComp = ({ RowData, options: { itemHeight = 50, visibleCount = 5, offsetCnt = 1, scrollWidth = 10, identity = "@id" } = {} }) => {
  // 스크롤 이벤트 감지 훅 : 스크롤이 이동되면 현재의 스크롤 위치를 반환한다., ref는 스크롤를 감지할 영역
  const [scrollTop, ref] = useScroll(0);
  // 표기해야할 아이템 총개수
  const itemTotalCount = rowData.length;
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

  const comp = (
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

export default useScrollComp;
