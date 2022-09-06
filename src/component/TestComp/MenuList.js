import React from "react";
import { useGetFetch } from "../../Hook/useFetch";
import { StyleDiv } from "../StyleComp/StyleComp";

const MenuList = () => {
  const [menuList] = useGetFetch("/menu/getAllMenu");

  console.log(menuList);
  return (
    <StyleDiv inStyle={{ width: "450px", height: "800px", backgroundColor: "white", margin: 10 }}>
      <MenuListContainer menuList={menuList} />
    </StyleDiv>
  );
};

const MenuListContainer = ({ menuList }) => {
  return (
    <React.Fragment>
      {menuList && menuList.length > 0 ? (
        menuList.map((item, idx) => {
          return <div key={idx}>{item.codeName}</div>;
        })
      ) : (
        <div>데이터 없음</div>
      )}
    </React.Fragment>
  );
};

export default MenuList;
