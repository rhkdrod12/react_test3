import React, { useState } from "react";
import "./BottomNavibar.css";

const BottomNavibar = () => {
  const list = document.querySelectorAll(".navigation .list");
  function activeIndecator() {
    list.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
  }
  list.forEach((item) => item.addEventListener("click", activeIndecator));

  const [select, setSelect] = useState();

  return (
    <div className="navigation">
      <ul>
        <li className="list active">
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
        </li>
        <div className="indicator"></div>
      </ul>
    </div>
  );
};

export default BottomNavibar;
