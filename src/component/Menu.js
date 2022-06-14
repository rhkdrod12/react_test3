import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { getFetch, postFetch, useGetFetch } from "../Hook/useFetch";
import menuStyle from "../CssModule/Menu.module.css";
import { DepthMenu } from "./BasicComponent/DepthMenu";
import HeaderMenu from "./BasicComponent/CategoryMenu";
import CodeBox from "./BasicComponent/CodeBox/CodeBox";
import { Alert, AlertTitle, Box, Button, CircularProgress, Collapse, FormControl, IconButton, InputLabel, OutlinedInput, Paper, TextField } from "@mui/material";
import { green, red } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";

const { "menu-content": menuContentStyle, "menu-item": menuItemStyle } = menuStyle;

const Menu = ({ height }) => {
  // customHook에서 state를 만들어서 반환시키기 때문에 state가 변화하면 이 화면도 자동적으로 갱신 될 것임
  const [menus, setMenus] = useGetFetch("/menu/get", {
    param: { menuType: "HEADER" },
    callbackFunc: (data) => {
      console.log(data);
      data.forEach((item) => {
        const id = item.menuId;
        data.forEach((target) => {
          if (target.upperMenu && target.upperMenu == id) {
            item.childMenu.push(target);
          }
        });
      });
    },
  });

  useEffect(() => {
    console.log("SSE 실행");
    const source = new EventSource("http://localhost:8080/menu/sse");
    source.onmessage = ({ data }) => {
      var jsonData = JSON.parse(data);
      console.log(jsonData);
      if (jsonData.type === "HEADER")
        setMenus((item) => {
          item
            .filter((target) => target.menuId == jsonData.upperMenu)
            .forEach((target) => {
              target.childMenu.push(target);
            });
          return [...item, jsonData];
        });
    };
  }, []);

  const menuContentStyle = menuStyle["menu-content"];

  return (
    <div className={menuContentStyle}>
      {/* {Array.isArray(menus)
        ? menus.map((item, index) => {
            return <MenuItem key={index} Number={index} name={item.name} url={item.url} className={menuItemStyle}></MenuItem>;
          })
        : null} */}
      {/* {Array.isArray(menus) ? <DepthMenu menuList={menus} height={height}></DepthMenu> : null} */}
      {Array.isArray(menus) ? <DepthMenu menuList={menus} height={height}></DepthMenu> : null}
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

  // const menuDataSet = {
  //   menuId: { name: "메뉴 ID", show: false },
  //   type: { name: "메뉴 타입" },
  //   name: { name: "메뉴 이름" },
  //   url: { name: "메뉴 URL" },
  //   upperMenu: { name: "상위 메뉴" },
  //   menuDepth: { name: "메뉴 깊이" },
  //   menuOrder: { name: "정렬 순서" },
  // };

  const menuData = {
    menuId: "",
    type: "",
    category: "",
    name: "",
    url: "",
    upperMenu: "",
    menuDepth: "",
    menuOrder: "",
  };

  const [menuItem, setMenuItem] = useState(menuData);
  const { type, name, url, upperMenu, category, menuDepth, menuOrder } = menuItem;
  const { "item-Container": itemContainer, "menu-input-container": menuInputContainer, "item-Title": itemTitle, "item-Content": itemContent, "item-Name": itemName, "item-Box": itemBox } = menuStyle;

  const onChange = useCallback((val) => {
    console.log(val);
    // debugger;
    setMenuItem((item) => ({ ...item, [val.name]: val.value }));
  }, []);

  const onClick = (e) => {
    postFetch("/menu/insertSee", [menuItem]).then((data) => {
      console.log("실행 결과값:");
      console.log(data);
    });
  };

  const [state, setState] = useState("");
  const onSubmit = (isResult, data) => {
    setState(isResult);
  };

  console.log(menuItem);

  const [typeCode, setTYpeCode] = useState();

  useEffect(() => {
    getFetch("/Code/getType", { code: "MT000" }).then((data, res) => {
      console.log("실행 결과값:");
      console.log(data);
      setTYpeCode(data);
    });
  }, []);

  return (
    <Paper className={menuInputContainer}>
      <Paper elevation={0} className={itemTitle} sx={{ padding: "10px" }}>
        메뉴 삽입
      </Paper>
      <AlertComponent
        open={state != ""}
        state={state}
        message={{ success: "전송 성공", error: "전송 실패" }}
        closeCallback={(state) => {
          setState("");
        }}
      />
      {/* <div className={itemContainer}> */}
      <Paper elevation={2} sx={{ display: "flex", flexDirection: "column", padding: "10px" }}>
        <CodeBoxInput name="type" value={type} display={"label"} label="메뉴 타입" onChange={onChange} codeData={typeCode}></CodeBoxInput>
        <MenuInput name="name" value={name} label="메뉴 이름" onChange={onChange}></MenuInput>
        <MenuInput name="upperMenu" value={upperMenu} label="상위 메뉴" onChange={onChange}></MenuInput>
        <MenuInput name="category" value={category} label="메뉴 범주" onChange={onChange}></MenuInput>
        <MenuInput name="menuDepth" value={menuDepth} label="메뉴 깊이" onChange={onChange}></MenuInput>
        <MenuInput name="url" value={url} label="메뉴 URL" onChange={onChange}></MenuInput>
        <MenuInput name="menuOrder" value={menuOrder} label="메뉴 순서" onChange={onChange} allowChar={/^[0-9]*$/}></MenuInput>
      </Paper>

      <div style={{ marginTop: 20 }}>
        <SendPostButton name="메뉴 추가" url="/menu/insertSee" data={[menuItem]} callback={onSubmit}></SendPostButton>
      </div>
    </Paper>
  );
};

const AlertComponent = ({ children, open: Open, state: State, message, closeCallback }) => {
  const [open, setOpen] = useState(Open);
  const [state, setState] = useState(() => State);

  useEffect(() => setOpen(Open), [Open]);
  useEffect(() => setState(State), [State]);

  return (
    <React.Fragment>
      <Collapse in={open}>
        <Alert
          variant="filled"
          severity={state == "" ? "success" : state}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
                if (typeof closeCallback === "function") closeCallback(state);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message[state]}
        </Alert>
      </Collapse>

      {children}
    </React.Fragment>
  );
};

const SendPostButton = ({ name, url, data, callback }) => {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(0);
  // const [failure, setFailure] = React.useState(false);

  const timer = React.useRef();

  const buttonSx = {
    width: "100%",
    ...(success == 1 && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
    ...(success == 2 && {
      bgcolor: red[500],
      "&:hover": {
        bgcolor: red[700],
      },
    }),
  };

  const successFuc = (data) => {
    console.log("실행 결과값:");
    console.log(data);
    setSuccess(1);
    setLoading(false);
    if (typeof callback === "function") callback("success", data);
  };

  const failureFuc = (err) => {
    setSuccess(2);
    setLoading(false);
    if (typeof callback === "function") callback("error", err);
  };

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(0);
      setLoading(true);

      postFetch(url, data)
        .then((data) => {
          successFuc(data);
        })
        .catch((err) => {
          failureFuc(err);
        });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <Button variant="contained" sx={buttonSx} disabled={loading} onClick={handleButtonClick}>
          {name}
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const CodeBoxInput = ({ label, name, value, setValue, onChange, codeData }) => {
  // 으흠~ 이런식으로 표현하면 되겠구만..
  const [code, setCode] = useState("");
  const event = {
    onDblclick: (data, index, depth) => {
      // setValue(data.codeName);
      console.log(data);
      setCode(data.codeName);
      onChange({ name, value: data.code });
    },
  };

  const option = {
    depthDirection: {
      0: { positionX: "RIGHT", positionY: "BOTTOM", offsetX: "", offsetY: "" },
    },
  };

  const codeBox = <CodeBox data={codeData} depth={0} event={event} option={option} />;

  return (
    <FormControl margin="dense" size="Normal" required>
      <InputLabel shrink htmlFor="component-outlined" sx={{ background: "white" }}>
        {label}
      </InputLabel>
      <OutlinedInput readOnly id="component-outlined" name={name} label={label} value={code} onChange={onChange} endAdornment={codeBox} />
    </FormControl>
  );
};

const MenuInput = ({ label, name, value, allowChar, onChange }) => {
  const eventObj = (event) => {
    let val = event.target.value;
    if (RegExp(allowChar).test(val)) {
      return onChange({ name: name, value: val }, event);
    } else {
      return null;
    }
  };

  return (
    <FormControl margin="dense" size="Normal" required>
      <InputLabel shrink htmlFor="component-outlined" sx={{ background: "white" }}>
        {label}
      </InputLabel>
      <OutlinedInput id="component-outlined" name={name} label={label} value={value} onChange={eventObj} />
    </FormControl>
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

export default Menu;
