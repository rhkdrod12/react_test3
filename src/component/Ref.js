import { useRef, useState } from "react";

const Ref = () => {
  const arr = [1, 2, 3, 4];
  const [data, setData] = useState(arr);

  // 이렇게 배열로 넣게되면  다중 참조가 가능한 배열 형태로 넘겨줌

  const onClick = ({ target }) => {
    console.log(target);
    debugger;
  };

  return (
    <div>
      <div>
        Ref 한 개는 얼마든지 사용가능하지만, 여러 리스트 형태의 dom이 있는
        경우에 각각 ref를 부여해야한다고 생각한다면 끔찍하지 않을 까유? 근데
        그럴빠에는 그냥 컴포넌트 하나 만들어서 쓰는게 더 낫겠네-ㅅ-;;
      </div>

      {data.map((item, index) => {
        return <RefChild key={index} value={item}></RefChild>;
      })}
    </div>
  );
};

const RefChild = ({ value }) => {
  const ref = useRef();
  const [data, setData] = useState(value);
  return (
    <div>
      이렇게 쓰는게 맞지.. {data}
      <input
        ref={ref}
        value={data}
        onChange={({ target }) => {
          setData(target.value);
        }}
        onKeyUp={({ keyCode }) => {
          if (keyCode === 13) {
            setData((value) => value + value);
          }
        }}
      ></input>
      <button
        onClick={() => {
          setData((value) => value + value);
          ref.current.focus();
        }}
      >
        클릭!
      </button>
    </div>
  );
};

export default Ref;
