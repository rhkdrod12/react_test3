import React, { memo, useCallback, useState } from "react";
import Select from "react-select";
import menuStyle from "../CssModule/Menu.module.css";
import selectStyle from "./Select.module.css";
import styled from "styled-components";
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
  // 그치만 이걸 확실히 이해하는데에는 도움이 되지유

  // useCallback은 useMemo에 함수를 감쌓아서 만든 훅으로써 그냥 단순하게 편하게 쓰기 위해서 만들어진 놈 임
  // useMemo와 동일한 기능용

  const onChange = useCallback(({ target: { value, name } }) => {
    setMenuItem((item) => ({ ...item, [name]: value }));
  }, []);

  return (
    <div className={menuStyle["item-Container"]}>
      <MyComponent></MyComponent>
      <Select2></Select2>
      <MemoItem name="type" value={type} type="select" onChange={onChange}>
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

const Item = memo(({ children, name, value, onChange, type = "input" }) => {
  console.log(`render ${name}`);
  const { "item-Content": itemContent, "item-Name": itemName, "item-Box": itemBox } = menuStyle;

  const selectOption = [
    { label: "HEADER", value: "HEADER", name: "메인타이틀" },
    { label: "SUBHEADER", value: "SUBHEADER", name: "서브타이틀" },
  ];

  const input = <input name={name} value={value} onChange={onChange}></input>;
  // const select = (
  //   <select>
  //     {selectOption.map((item) => (
  //       <option value={item.value} key={item.key}>
  //         {item.name}
  //       </option>
  //     ))}
  //   </select>
  // );

  const select = <Select options={selectOption}></Select>;

  const comp = { input: input, select: select };

  return (
    <div className={itemContent}>
      <div className={itemName}>
        <div>{children}</div>
      </div>
      <div className={itemBox}>{comp[type]}</div>
    </div>
  );
});

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const MyComponent = () => <Select options={options} />;

const MemoItem = Item;

const Select2 = ({ options }) => {
  return (
    <div className={selectStyle.SelectContainer}>
      <div>
        <input placeholder="Select..."></input>
      </div>
      <div className={selectStyle.IndicatorsContainer}>
        <Svg>
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </Svg>
      </div>
    </div>
  );
};

const Svg = styled.svg`
  display: inline-block;
  fill: currentColor;
  line-height: 1;
  stroke: currentColor;
  stroke-width: 0;
`;

const SelectContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
`;

export default MemoTest;
