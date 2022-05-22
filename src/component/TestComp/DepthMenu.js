import { StyleDiv } from "../StyleComp/StyleComp";
import styled from "styled-components";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider";

export const DepthMenu = () => {
  const menuDataSet = {
    menuId: { name: "메뉴 ID", show: false },
    type: { name: "메뉴 타입" },
    name: { name: "메뉴 이름" },
    url: { name: "메뉴 URL" },
    upperMenu: { name: "상위 메뉴" },
    menuDepth: { name: "메뉴 깊이" },
    menuOrder: { name: "정렬 순서" },
  };

  const menuData = {
    menuId: "",
    type: "",
    name: "",
    url: "",
    upperMenu: "",
    menuDepth: "",
    menuOrder: "",
  };

  const menuList = [];

  for (let idx = 1; idx <= 5; idx++) {
    const data = {
      menuId: idx,
      type: "HEADER",
      name: `홍길동${idx}`,
      url: `/menu/Test${idx}`,
      upperMenu: "",
      menuDepth: `0`,
      menuOrder: idx,
      childMenu: [],
    };

    menuList.push(data);
  }

  for (let idx = 6; idx < 10; idx++) {
    const data = {
      menuId: idx,
      type: "HEADER",
      name: `Sub홍길동${idx}`,
      url: `/menu/Sub/Test${idx}`,
      upperMenu: 1,
      menuDepth: `1`,
      menuOrder: `${idx - 5}`,
      childMenu: [],
    };

    if (idx === 8) {
      for (let idx = 10; idx <= 12; idx++) {
        const sec = {
          menuId: idx,
          type: "HEADER",
          name: `홍길동${idx}`,
          url: `/menu/Test${idx}`,
          upperMenu: "",
          menuDepth: `2`,
          menuOrder: `${idx - 10}`,
          childMenu: [],
        };
        data.childMenu.push(sec);

        if (idx == 12) {
          for (let idx = 13; idx <= 15; idx++) {
            const eee = {
              menuId: idx,
              type: "HEADER",
              name: `홍길동${idx}`,
              url: `/menu/Test${idx}`,
              upperMenu: "",
              menuDepth: `3`,
              menuOrder: `${idx - 13}`,
              childMenu: [],
            };
            sec.childMenu.push(eee);
          }
        }
      }
    }

    menuList.forEach((item) => {
      if (item.menuId == data.upperMenu) {
        item.childMenu.push(data);
      }
    });
  }

  console.log(menuList);

  const inStyle = { display: "inline-block", position: "relative", height: 45, background: "rgba(250, 250, 250, 1)" };

  return (
    <MenuContainer>
      {menuList.map((item, idx) => {
        return <MenuButton key={idx} data={item} Top={45}></MenuButton>;
      })}
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  display: inline-block;
  position: relative;
  height: 45px;
  border: 1px solid rgba(224, 224, 224, 1);
  background: rgba(250, 250, 250, 1);
  border-radius: 2px;
`;

const MenuContext = createMutilContext(["depth"]);
const MenuButton = ({ data, Top }) => {
  const [menuList, setMenuList] = useState();
  const ref = useRef();
  const onClick = (e) => {
    e.stopPropagation();
    console.log(data);
  };

  //useEffect를 사용하여 window에 event를 넣어 해당 이벤트를 취소 시킬 수 있는 이벤트를 만들 수 있다!!

  const [isOpen, setIsOpen] = useState(false);
  const [depth, setDepth] = useState(true);
  const subMenu = data.childMenu && data.childMenu.length > 0;

  // const handleClickOutside = useCallback(({ target }) => {
  //   if (isOpen && subMenu && !ref.current.contains(target)) {
  //     setIsOpen(false);
  //   } // -> 컴포넌트가 target을 포함하고 있지않으면 외부 이벤트로 판단하여 화면을 닫는 이벤트를 넣으면 됨
  // });
  const onMouseOver = useCallback((event) => {
    if (!isOpen && subMenu) setIsOpen(!isOpen);
  }, []);

  const onMouseLeave = (target) => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <React.Fragment>
      <ContextProvider ContextStore={MenuContext} Data={{ depth: [depth, setDepth] }}>
        <StyleMenuButton onClick={onClick} onMouseOver={onMouseOver} ref={ref} onMouseLeave={onMouseLeave}>
          <StyleDiv>{data.name}</StyleDiv>
          {isOpen && subMenu ? <DownSubMenuContainer menuList={data.childMenu} parentRef={ref} offsetY={0}></DownSubMenuContainer> : null}
        </StyleMenuButton>
      </ContextProvider>
    </React.Fragment>
  );
};

const StyleMenuButton = styled.div`
  display: inline-flex;
  padding: 10px;
  cursor: pointer;
  position: relative;
`;

const DownSubMenuContainer = ({ menuList, parentRef, offsetY = 0 }) => {
  const clientTop = parentRef.current.clientTop;
  const clientHeight = parentRef.current.clientHeight;
  const offSetY = clientHeight - clientTop + offsetY;
  const maxWidth = window.screen.width;

  const clientLeft = parentRef.current.clientLeft;
  const clientWidth = parentRef.current.clientWidth;
  const offSetX = clientWidth - clientLeft;

  return (
    <StyleDiv inStyle={{ top: 0, left: 0, position: "absolute", background: "transparent" }}>
      <StyleDownSubMenuContainer Top={offSetY}>
        {menuList.map((menu, idx) => {
          return <DownSubMenuButton key={idx} data={menu} idx={menuList.length - idx}></DownSubMenuButton>;
        })}
      </StyleDownSubMenuContainer>
    </StyleDiv>
  );
};

const StyleDownSubMenuContainer = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  left: 0;
  top: ${({ Top }) => `${Top}px;`};
  border: 1px solid rgba(224, 224, 224, 1);
  box-shadow: 1px 1px 1px 1px rgba(224, 224, 224, 1);
  background: rgba(250, 250, 250, 1);
  border-radius: 2px;
  width: max-content;
`;

const DownSubMenuButton = ({ data, idx }) => {
  const ref = useRef();
  const onClick = (e) => {
    e.stopPropagation();
    console.log(data);
  };
  const [depth, setDepth] = useContext(MenuContext.depth);
  const [isOpen, setIsOpen] = useState(false);
  const isChild = data.childMenu && data.childMenu.length > 0;

  const onMouseOver = useCallback((event) => {
    if (!isOpen && isChild) {
      setIsOpen(!isOpen);
    }
  }, []);

  const onMouseLeave = (target) => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <React.Fragment>
      <StyleMenuButton onClick={onClick} onMouseOver={onMouseOver} ref={ref} onMouseLeave={onMouseLeave}>
        {data.name} {isChild ? ">" : ""}
        {isOpen && isChild ? <SideSubMenuContainer menuList={data.childMenu} parentRef={ref} offsetY={-2} idx={idx}></SideSubMenuContainer> : null}
      </StyleMenuButton>
    </React.Fragment>
  );
};

const SideSubMenuContainer = ({ menuList, parentRef, offsetY = 0, idx }) => {
  const clientLeft = parentRef.current.clientLeft;
  const clientWidth = parentRef.current.clientWidth;
  const offSet = clientWidth - clientLeft + offsetY;

  return (
    <StyleDiv inStyle={{ top: 0, left: 0, position: "absolute", background: "transparent", height: `${idx * 100}%`, width: `${clientWidth + 20}px` }}>
      <StyleSideSubMenuContainer Left={offSet}>
        {menuList.map((menu, menuIdx) => {
          return <SideSubMenuButton key={menuIdx} idx={menuList.length - menuIdx} data={menu}></SideSubMenuButton>;
        })}
      </StyleSideSubMenuContainer>
    </StyleDiv>
  );
};

const StyleSideSubMenuContainer = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  top: 0;
  border: 1px solid rgba(224, 224, 224, 1);
  box-shadow: 1px 1px 1px 1px rgba(224, 224, 224, 1);
  background: rgba(250, 250, 250, 1);
  border-radius: 2px;
  left: ${({ Left }) => `${Left}px;`};
`;

const SideSubMenuButton = ({ data, idx }) => {
  const [menuList, setMenuList] = useState();
  const ref = useRef();
  const isChild = data.childMenu && data.childMenu.length > 0;
  const [isOpen, setIsOpen] = useState(false);
  const [depth, setDepth] = useContext(MenuContext.depth);

  const onClick = (e) => {
    e.stopPropagation();
    console.log(data);
  };
  const onMouseOver = useCallback((event) => {
    if (!isOpen && isChild) {
      setIsOpen(!isOpen);
    }
  }, []);

  const onMouseLeave = (target) => {
    if (isOpen) setIsOpen(false);
  };

  console.log(`idx: ${idx}`);

  return (
    <React.Fragment>
      <StyleMenuButton onClick={onClick} onMouseOver={onMouseOver} ref={ref} onMouseLeave={onMouseLeave}>
        {data.name} {isChild ? ">" : ""}
        {isOpen && isChild ? <SideSubMenuContainer menuList={data.childMenu} parentRef={ref} offsetY={-2} idx={idx}></SideSubMenuContainer> : null}
      </StyleMenuButton>
    </React.Fragment>
  );
};
