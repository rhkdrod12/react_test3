import React, { memo, useCallback, useState } from "react";
import menuStyle from "./Menu.module.css";
const MemoTest = () => {
  return (
    <div>
      <InputBox></InputBox>
    </div>
  );
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

const InputBox = () => {
  const [menuItem, setMenuItem] = useState(menuData);

  const { type, name, url, upperMenu, menuDepth, menuOrder } = menuItem;

  // 어차피 이 함수는 다시 그려질 필요가 없음
  // 파라미터가 갱신할 필요가 없기 때문에 빈 배열을 넘겨서 다시 안만들어지도록 설정하면
  // memo에 의해 props가 갱신 되는 경우에만 해당 컴포넌트를 갱신하기 때문에
  // 입력한 컴포넌트와 요기 부모 컴포넌트만 갱신 될 것임

  // useCallback은 배열에 있는 값이 달라졌을 때 새롭게 함수를 만들어서 넘기는 구조
  const onChange = useCallback(({ target: { value, name } }) => {
    setMenuItem((item) => ({ ...item, [name]: value }));
  }, []);

  console.log("Render Inputbox");
  console.log(menuItem);
  return (
    <div className={menuStyle["item-Container"]}>
      <MemoItem name="type" value={type} onChange={onChange}>
        메뉴 타입
      </MemoItem>
      <MemoItem name="name" value={name} onChange={onChange}>
        메뉴 이름
      </MemoItem>
      <MemoItem name="url" value={url} onChange={onChange}>
        메뉴 URL
      </MemoItem>
      <MemoItem name="menuOrder" value={menuOrder} onChange={onChange}>
        메뉴 순서
      </MemoItem>
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

export default MemoTest;
