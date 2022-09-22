import { Button } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getFetch, useGetFetch } from "../Hook/useFetch";

const UserChat = () => {
  const [chatId, setChatId] = useState("");
  const messageSender = useChatEvent(chatId);
  //const [chatId] = useGetFetch("/chat/create", { stateType: "" });

  const onCreate = () => {
    getFetch("/chat/create", { stateType: "" })
      .then((response) => {
        setChatId(response);
      })
      .catch((error) => {
        setChatId("");
      });
  };

  useEffect(() => {
    return () => {
      console.log("이거 실행되나?");
      setChatId("");
    };
  }, []);

  console.log("UserChat render %o", messageSender?.message);
  return (
    <div style={{ display: "flex", margin: "0 auto", flexDirection: "column", justifyContent: "center", backgroundColor: "white", width: "50%", height: "100%" }}>
      {chatId ? (
        <div>채팅테스트 방ID: {chatId}</div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ConnectChat setChatId={setChatId}></ConnectChat>
          <Button onClick={onCreate} variant="contained" sx={{ alignItems: "center", height: "30px", marginLeft: "4px" }}>
            <span>방생성</span>
          </Button>
        </div>
      )}
      {messageSender ? (
        <React.Fragment>
          <MessageComp messageList={messageSender.message}></MessageComp>
          <SendMessageComp messageSender={messageSender}></SendMessageComp>
        </React.Fragment>
      ) : null}
    </div>
  );
};

const MessageComp = ({ messageList }) => {
  return (
    <div
      style={{
        height: "500px",
        overflow: "auto",
        padding: "5px 10px",
        margin: "10px 10px",
        boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
      }}
    >
      {messageList.length > 0 ? messageList.map((message, idx) => <div key={idx}>{message}</div>) : null}
    </div>
  );
};

const ConnectChat = ({ setChatId }) => {
  const [value, setMessage] = useState("");
  const [error, setError] = useState("");

  const onChange = (event) => {
    const value = event.target.value;
    setMessage(value);
    setError("");
  };

  const connect = () => {
    getFetch(`/chat/existChat/${value}`)
      .then((response) => {
        setChatId(value);
        setMessage("");
      })
      .catch((response) => {
        setError("존재하지 않는 ID입니다.");
        setMessage("");
      });
  };

  const onKeyUp = (event) => {
    if (event.keyCode == 13) {
      connect();
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      <input type="text" value={value} onChange={onChange} onKeyUp={onKeyUp} />
      {error ? <span style={{ color: "red" }}>{error}</span> : null}
      <Button onClick={connect} variant="contained" sx={{ float: "right", alignItems: "center", height: "30px", marginLeft: "4px" }}>
        <span>연결</span>
      </Button>
    </div>
  );
};

/**
 *
 * @param {{messageSender : MessageSender}} param0
 * @returns
 */
const SendMessageComp = ({ messageSender }) => {
  const [message, setMessage] = useState("");

  const onChange = (event) => {
    const value = event.target.value;
    setMessage(value);
  };

  const sendMessage = () => {
    messageSender.sendMessage(message);
    setMessage("");
  };

  const onKeyUp = (event) => {
    if (event.keyCode == 13) {
      sendMessage();
    }
  };

  return (
    <div>
      <input style={{ width: "80%" }} type="text" value={message} onChange={onChange} onKeyUp={onKeyUp} />
      <Button onClick={sendMessage} variant="contained" sx={{ float: "right", alignItems: "center", height: "30px", marginLeft: "4px" }}>
        <span>보내기</span>
      </Button>
    </div>
  );
};

/**
 * chat message를 보내기위한 hook
 * @returns {MessageSender}
 */
const useChatEvent = (chatId) => {
  const [message, setMessage] = useState([]);
  const [messageSender, setMessageSender] = useState();

  console.log("useChatEvent render");
  useEffect(() => {
    if (chatId) {
      const source = new EventSource(`http://localhost:8080/chat/beginChat/${chatId}`);
      source.onmessage = ({ data }) => {
        var jsonData = JSON.parse(data).body;

        if (jsonData !== "ping") {
          setMessage((data) => [...data, jsonData.result]);
        }
      };
      setMessageSender(new MessageSender(source, chatId, message));
    }
  }, [chatId]);

  if (messageSender) {
    messageSender.message = message;
  }

  return messageSender;
};

class MessageSender {
  /**
   *
   * @param {EventSource} source
   * @param {String} chatId
   * @param {useState} message
   */
  constructor(source, chatId, message) {
    this.source = source;
    this.chatId = chatId;
    this.message = message;
  }

  sendMessage = (message) => {
    getFetch(`/chat/send/${this.chatId}`, { message });
  };
}

export default UserChat;
