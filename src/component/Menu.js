import React, { useEffect, useState } from "react";
import { postFetch, useGetFetch } from "../utils/commonUtils";
import menuStyle from "./Menu.module.css";

const Menu = () => {
  // customHook에서 state를 만들어서 반환시키기 때문에 state가 변화하면 이 화면도 자동적으로 갱신 될 것임
  const [menus, setMenus] = useGetFetch("/menu/get", {
    param: { menuType: "HEADER" },
  });

  useEffect(() => {
    console.log("여기여기");
    const source = new EventSource("https://localhost:8080/menu/sse");
    source.onmessage = ({ data }) => {
      var jsonData = JSON.parse(data);
      setMenus((item) => [...item, jsonData]);
    };
  }, []);

  // const menuContentStyle = menuStyle["menu-content"];
  // const menuItemStyle = menuStyle["menu-item"];

  const { "menu-content": menuContentStyle, "menu-item": menuItemStyle } = menuStyle;

  return (
    <div className={menuContentStyle}>
      {Array.isArray(menus)
        ? menus.map((item, index) => {
            return <MenuItem key={index} Number={index} name={item.name} url={item.url} className={menuItemStyle}></MenuItem>;
          })
        : null}
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
      <div>메뉴 삽입</div>
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

  const [menuItem, setMenuItem] = useState(menuData);
  const { type, name, url, upperMenu, menuDepth, menuOrder } = menuItem;
  const onChange = ({ target: { value, name } }) => {
    setMenuItem((item) => ({ ...item, [name]: value }));
  };
  const onClick = (e) => {
    console.log(e);
    debugger;

    postFetch("/menu/insertSee", [menuItem]).then((data) => {
      console.log(data);
    });
  };

  return (
    <div>
      <div>
        {/* 원래는 셀렉트 박스로 처리하는게 맞긴하다만은 일단 임시적으로 처리합시다. */}
        <span>메뉴 타입: </span>
        <input name="type" value={type} onChange={onChange}></input>
      </div>
      <div>
        <span>메뉴 이름: </span>
        <input name="name" value={name} onChange={onChange}></input>
      </div>
      <div>
        <span>메뉴 URL: </span>
        <input name="url" value={url} onChange={onChange}></input>
      </div>
      <div>
        <span>메뉴 순서: </span>
        <input name="menuOrder" value={menuOrder} onChange={onChange}></input>
      </div>
      <button className="" onClick={onClick}>
        클릭!
      </button>
    </div>
  );
};

export default Menu;
