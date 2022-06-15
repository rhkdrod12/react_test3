import React, { useRef, useState } from "react";
import "./BottomNavibar.css";

const BottomNavibar = () => {
  const list = document.querySelectorAll(".navigation .list");
  function activeIndecator() {
    list.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
  }
  list.forEach((item) => item.addEventListener("click", activeIndecator));

  const [select, setSelect] = useState(0);

  const data = [
    { iconName: "home-outline", title: "Home" },
    { iconName: "person-outline", title: "Profile" },
    { iconName: "chatbubble-ellipses-outline", title: "Message" },
    { iconName: "camera-outline", title: "Photos" },
    { iconName: "settings-outline", title: "settings" },
  ];

  const onClick = (event, ref, idx) => {
    console.log(idx);
    setSelect(idx);
  };

  return (
    <div className="navigation">
      <ul>
        {data && data.length > 0 ? data.map((item, idx) => <IconBox key={idx} idx={idx} iconName={item.iconName} title={item.title} onClick={onClick} select={select}></IconBox>) : null}
        {/* <li className="list active">
          <a href="#">
            <span className="icon">
              <ion-icon name="home-outline"></ion-icon>
            </span>
            <span className="text">Home</span>
          </a>
        </li>
        <li className="list">
          <a href="#">
            <span className="icon">
              <ion-icon name="person-outline"></ion-icon>
            </span>
            <span className="text">Profile</span>
          </a>
        </li>
        <li className="list">
          <a href="#">
            <span className="icon">
              <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
            </span>
            <span className="text">Message</span>
          </a>
        </li>
        <li className="list">
          <a href="#">
            <span className="icon">
              <ion-icon name="camera-outline"></ion-icon>
            </span>
            <span className="text">Photos</span>
          </a>
        </li>
        <li className="list">
          <a href="#">
            <span className="icon">
              <ion-icon name="settings-outline"></ion-icon>
            </span>
            <span className="text">Setting</span>
          </a>
        </li> */}
        <div className="indicator" style={{ transform: `translateX(calc(70px * ${select}))` }}></div>
      </ul>
    </div>
  );
};

const IconBox = ({ iconName, title, idx, select, onClick }) => {
  const ref = useRef();
  return (
    <li ref={ref} className={`list ${select == idx ? "active" : ""}`} onClick={(event) => onClick(event, ref.current, idx)}>
      <a href="#">
        <span className="icon">
          <ion-icon name={iconName}></ion-icon>
        </span>
        <span className="text">{title}</span>
      </a>
    </li>
  );
};

export default BottomNavibar;
