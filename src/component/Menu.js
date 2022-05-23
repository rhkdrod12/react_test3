import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { postFetch, useGetFetch } from "../Hook/useFetch";
import menuStyle from "../CssModule/Menu.module.css";
import { DepthMenu } from "./TestComp/DepthMenu";

const { "menu-content": menuContentStyle, "menu-item": menuItemStyle } = menuStyle;

const Menu = () => {
  // customHook에서 state를 만들어서 반환시키기 때문에 state가 변화하면 이 화면도 자동적으로 갱신 될 것임
  const [menus, setMenus] = useGetFetch("/menu/get", {
    param: { menuType: "HEADER" },
  });

  useEffect(() => {
    console.log("SSE 실행");
    const source = new EventSource("http://localhost:8080/menu/sse");
    source.onmessage = ({ data }) => {
      var jsonData = JSON.parse(data);
      console.log(jsonData);
      if (jsonData.type === "HEADER")
        setMenus((item) => {
          return [...item, jsonData];
        });
    };
  }, []);

  // const menuContentStyle = menuStyle["menu-content"];
  // const menuItemStyle = menuStyle["menu-item"];

  return (
    <div className={menuContentStyle}>
      {/* {Array.isArray(menus)
        ? menus.map((item, index) => {
            return <MenuItem key={index} Number={index} name={item.name} url={item.url} className={menuItemStyle}></MenuItem>;
          })
        : null} */}
      {Array.isArray(menus) ? <DepthMenu menuList={menus}></DepthMenu> : null}
    </div>
  );
};

const MenuItem = ({ name, Number, url, className }) => {
  // const navi = useNavigate();
  return (
    <div className={className}>
      <a onClick={() => console.log(`${url}로 이동`)}>{`${Number + 1}.${name}`}</a>
    </div>
  );
};

export const InsertMenu = () => {
  return (
    <div>
      <div>
        <InputBox></InputBox>
      </div>
    </div>
  );
};

const InputBox = () => {
  const [value, setValue] = useState();
  // react는 기존의 값을 수정하는 형태보다는 새로운 값을 만들어서 넣어주는 방식으로 가야한다.
  // react는 불변성을 지켜야, 리액트 컴포넌트가 업데이트 되었는지를 감지할 수 있으며, 이에 따라
  // 리랜더링이 진행된다. 기존값을 바꾸는 형태로 하게 되면 업데이트를 감지하지 못할 수 있음.
  // 어차피 for문 한번 돌리는건 그렇게 시간이 오래걸리는 작업은 아니니..

  // const menuDataSet = {
  //   menuId: { name: "메뉴 ID", show: false },
  //   type: { name: "메뉴 타입" },
  //   name: { name: "메뉴 이름" },
  //   url: { name: "메뉴 URL" },
  //   upperMenu: { name: "상위 메뉴" },
  //   menuDepth: { name: "메뉴 깊이" },
  //   menuOrder: { name: "정렬 순서" },
  // };

  const menuData = {
    menuId: "",
    type: "",
    name: "",
    url: "",
    upperMenu: "",
    menuDepth: "",
    menuOrder: "",
  };

  const [menuItem, setMenuItem] = useState(menuData);
  const { type, name, url, upperMenu, menuDepth, menuOrder } = menuItem;
  const { "item-Container": itemContainer, "menu-input-container": menuInputContainer, "item-Title": itemTitle, "item-Content": itemContent, "item-Name": itemName, "item-Box": itemBox } = menuStyle;

  const onChange = useCallback(({ target: { value, name } }) => {
    setMenuItem((item) => ({ ...item, [name]: value }));
  }, []);

  const onClick = (e) => {
    postFetch("/menu/insertSee", [menuItem]).then((data) => {
      console.log("실행 결과값:");
      console.log(data);
    });
  };

  return (
    <div className={menuInputContainer}>
      <div className={itemTitle}>메뉴 삽입</div>

      <div className={itemContainer}>
        <MemoItem name="type" value={type} onChange={onChange}>
          메뉴 타입
        </MemoItem>
        <MemoItem name="name" value={name} onChange={onChange}>
          메뉴 이름
        </MemoItem>
        <MemoItem name="upperMenu" value={upperMenu} onChange={onChange}>
          상위 메뉴
        </MemoItem>
        <MemoItem name="menuDepth" value={menuDepth} onChange={onChange}>
          메뉴 깊이
        </MemoItem>
        <MemoItem name="url" value={url} onChange={onChange}>
          메뉴 URL
        </MemoItem>
        <MemoItem name="menuOrder" value={menuOrder} onChange={onChange}>
          메뉴 순서
        </MemoItem>
      </div>

      <button className="" onClick={onClick}>
        추가
      </button>
    </div>
  );
};

const Item = ({ children, name, value, onChange }) => {
  console.log(`render ${name}`);
  const { "item-Content": itemContent, "item-Name": itemName, "item-Box": itemBox } = menuStyle;

  return (
    <div className={itemContent}>
      <div className={itemName}>
        <div>{children}</div>
      </div>
      <div className={itemBox}>
        <input name={name} value={value} onChange={onChange}></input>
      </div>
    </div>
  );
};

const MemoItem = memo(Item);

export default Menu;
