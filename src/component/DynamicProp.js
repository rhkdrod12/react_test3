import React from "react";

const DynamicProp = () => {
  const data = { item1: "1번아이템", item2: "2번아이템" };

  return (
    <div>
      <TestComp {...data} item3="호로롱"></TestComp>
    </div>
  );
};

const TestComp = ({ item1, item2, item3 }) => {
  console.log(item1, item2, item3);
  return <div>여기는 자식 </div>;
};

export default DynamicProp;
