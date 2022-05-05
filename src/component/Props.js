const DynamicProps1 = ({ value = "" }) => {
  return <div>다이나믹1: {value}</div>;
};

const DynamicProps2 = ({ value = "" }) => {
  return <div>다이나믹2: {value}</div>;
};

const dynamic = {
  comp1: DynamicProps1,
  comp2: DynamicProps2,
};

const Props = () => {
  console.log(dynamic);
  const Test = dynamic["comp1"]; // 결국에는 무었이 되었든 컴파일러가 해석해준다는거구만..

  return (
    <div>
      <div>
        자식 컴포넌트를 호출할 때 부모에서는 자식에게 Propeties를 넘겨줄 수
        있는데 이를 보통 props라고 표기함 구조분해할당의 기본값과
        defaultProps랑의 차이점은?
      </div>
      <Test value="1"></Test>
      <PropsChild name="값 지정"></PropsChild>
      <PropsChild2>
        컴포넌트 사이에 적은 dom은 해당 컴포넌트에서 children을 통해 받아낼 수
        있다. props에 children의 객체명으로 넘어온다.
        <div>
          여기서 궁굼해지는 방법, 동적으로 컴포넌트를 호출할 수는 없나?? 아니면
          동적으로 생성할 수 없나? 동적으로 생성해야하는 경우도 있긴할텐데.
        </div>
      </PropsChild2>
    </div>
  );
};

const PropsChild = ({ name }) => {
  return <div>child : {name}</div>;
};

const PropsChild2 = (props) => {
  console.log(props);
  return <div>자식@ : {props.children}</div>;
};

PropsChild.defaultProps = {
  name: "홍길동",
};

export default Props;
