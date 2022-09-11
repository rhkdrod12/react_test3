import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, Button, CircularProgress, Collapse, FormControl, IconButton, InputLabel, OutlinedInput, Paper } from "@mui/material";
import { green, red } from "@mui/material/colors";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import menuStyle from "../CssModule/Menu.module.css";
import { getFetch, postFetch, useGetFetch } from "../Hook/useFetch";
import CodeBox from "./BasicComponent/CodeBox/CodeBox";
import { DepthMenu } from "./BasicComponent/DepthMenu";
import { StyleDiv } from "./StyleComp/StyleComp";
import useDataReducer from "./TestComp/DataReducer";
import useListDataReducer, { ListDataAction } from "./TestComp/ListDataReducer";
import TreeList from "./TestComp/TreeList";

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
      if (jsonData.type === "MT001")
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

  return <div className={menuContentStyle}>{Array.isArray(menus) ? <DepthMenu menuList={menus} height={height}></DepthMenu> : null}</div>;
};

export const InsertMenu = () => {
  // 트리용 데이터 리스트 생성
  const treeAction = useListDataReducer();

  useEffect(() => {
    getFetch("/menu/getAllMenu").then((res) => {
      treeAction.setInit(res);
    });
    return () => {
      treeAction.setInit([]);
    };
  }, []);

  const itemList = treeAction.getRowAllData();
  const treemenuData = treeAction.getSelectedRowData();
  console.log("treemenuData : %o", treemenuData);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TempComp itemList={itemList} treeAction={treeAction}></TempComp>
        <InputBox menuData={treemenuData.data}></InputBox>
      </div>
    </div>
  );
};

/**
 * @param {{itemList: Object, treeAction: ListDataAction}}
 */
const TempComp = ({ itemList, treeAction }) => {
  const list = itemList.filter((item) => item.codeDepth == 0);
  const itemEvent = useMemo(
    () => ({
      onClick: (event, { item }) => {
        console.log("여기 클릭 %o", item);
        treeAction.setSelectedRowIndex(item.rowIndex);
      },
    }),
    [treeAction]
  );

  const addNewMenu = (event) => {
    const action = treeAction;
    /**
     * 자 목표는 선택된 데이터가 있으면 해당 데이터의 하위로 생성
     * 선택된게 없으면 최상위로 생성
     */
    const selectedData = action.getSelectedRowData();

    const newData = { ...selectedData, code: "", rowIndex: "", upperCode: selectedData.code, codeDepth: selectedData.codeDepth + 1, codeName: "신규작성", data: {}, childCodes: [] };
    newData.data = {
      ...selectedData.data,
      menuId: "",
      name: "신규작성",
      upperMenu: selectedData.code,
      menuDepth: selectedData.codeDepth,
      status: "create",
      menuOrder: selectedData.childCodes.length + 1,
    };

    selectedData.childCodes.push(newData);

    action.addRowData(newData, true);
  };

  return (
    <StyleDiv
      inStyle={{
        width: "450px",
        height: "800px",
        backgroundColor: "white",
        margin: 10,
        boxShadow: "0px 0px 1px 2px white",
        padding: "10px",
        display: "grid",
        gridTemplateRows: "70px 35px",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          padding: "10px",
          textShadow: "1px 1px 1px rgb(124, 121, 121)",
          fontSize: "28px",
          fontWeight: 700,
          boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
          marginBottom: "10px",
        }}
      >
        Header Menu 목록
      </Paper>
      <StyleDiv>
        <Button onClick={addNewMenu} variant="contained" sx={{ float: "right", alignItems: "center", height: "30px" }} startIcon={<AddOutlinedIcon />}>
          <span>새로 추가</span>
        </Button>
      </StyleDiv>
      <TreeList list={list} itemEvent={itemEvent}></TreeList>
    </StyleDiv>
  );
};

const MENU_DATA = {
  menuId: "",
  type: "",
  category: "",
  name: "",
  url: "",
  upperMenu: "",
  menuDepth: "",
  menuOrder: "",
};

const InputBox = memo(({ menuData }) => {
  const dataAciton = useDataReducer(menuData, MENU_DATA);
  const menuItem = dataAciton.getAllData();
  const { type, name, url, upperMenu, category, menuDepth, menuOrder } = menuItem;

  const [typeCodeList, setTypeCode] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [state, setState] = useState();

  useEffect(() => {
    getFetch("/Code/getType", { code: "MT000" }).then((data, res) => {
      setTypeCode(data);
    });

    return () => {
      setTypeCode([]);
      setMenuList([]);
    };
  }, []);

  useEffect(() => {
    console.log("메뉴 아이템 %o", menuItem);
    if (menuItem?.type) {
      getFetch("/menu/get3", { menuType: menuItem.type }).then((data, res) => {
        console.log("메뉴 실행 결과값: %o", data);
        setMenuList(data);
      });
    }
  }, [menuItem]);

  const newMenu = () => {
    dataAciton.setInit(MENU_DATA);
  };
  const onChange = useCallback((val) => {
    dataAciton.setData(val);
  }, []);

  return (
    <Paper className={menuStyle["menu-input-container"]}>
      <Paper elevation={0} className={menuStyle["item-Title"]} sx={{ padding: "10px" }}>
        메뉴 삽입
      </Paper>
      {/* <AlertComponent
        open={state != ""}
        state={state}
        message={{ success: "전송 성공", error: "전송 실패" }}
        closeCallback={(state) => {
          setState("");
        }}
      /> */}
      <form>
        <Paper elevation={2} sx={{ display: "flex", flexDirection: "column", padding: "10px" }}>
          <CodeBoxInput name="type" value={type} display={"label"} label="메뉴 타입" onChange={onChange} codeData={typeCodeList}></CodeBoxInput>
          <MenuInput name="name" value={name} label="메뉴 이름" onChange={onChange}></MenuInput>
          <CodeBoxInput
            name="upperMenu"
            value={upperMenu}
            display={"label"}
            label="상위 메뉴"
            onChange={onChange}
            codeData={menuList}
            // beforeChange={beforeChange}
          ></CodeBoxInput>
          <MenuInput name="category" value={category} label="메뉴 범주" onChange={onChange}></MenuInput>
          <MenuInput name="menuDepth" value={menuDepth} label="메뉴 깊이" onChange={onChange}></MenuInput>
          <MenuInput name="url" value={url} label="메뉴 URL" onChange={onChange}></MenuInput>
          <MenuInput name="menuOrder" value={menuOrder} label="메뉴 순서" onChange={onChange} allowChar={/^[0-9]*$/}></MenuInput>
        </Paper>

        <div style={{ marginTop: 20 }}>
          <SendPostButton name={menuItem.menuId ? "메뉴 변경" : "메뉴 생성"} url="/menu/insertSee" data={[menuItem]} callback={"onSubmit"}></SendPostButton>
        </div>
      </form>
    </Paper>
  );
});

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

const CodeBoxInput = ({ label, name, value, setValue, onChange, codeData, beforeChange }) => {
  // 으흠~ 이런식으로 표현하면 되겠구만..
  const [code, setCode] = useState("");
  const event = {
    onDblclick: (data, index, depth) => {
      // setValue(data.codeName);
      console.log(data);
      setCode(data.codeName);
      beforeChange?.(data);
      onChange({ [name]: data.code });
    },
  };

  useEffect(() => {
    const findResult = codeData?.find((item) => item.code == value);
    setCode(findResult?.codeName ?? "");
  }, [value]);

  const option = {
    depthDirection: {
      0: { positionX: "RIGHT", positionY: "BOTTOM", offsetX: "", offsetY: "" },
    },
  };

  const codeDepth = codeData?.[0]?.codeDepth ?? 0;

  const codeBox = <CodeBox data={codeData} depth={codeDepth} event={event} option={option} />;

  return (
    <FormControl margin="dense" size="Normal" required>
      <InputLabel htmlFor="component-outlined" sx={{ background: "white" }}>
        {label}
      </InputLabel>
      <OutlinedInput readOnly id="component-outlined" name={name} label={label} value={code} onChange={onChange} endAdornment={codeBox} />
    </FormControl>
  );
};

const MenuInput = ({ label, name, value = "", allowChar, onChange }) => {
  const eventObj = (event) => {
    let val = event.target.value;
    if (RegExp(allowChar).test(val)) {
      return onChange({ [name]: val }, event);
    } else {
      return null;
    }
  };

  return (
    <FormControl margin="dense" size="Normal" required>
      <InputLabel htmlFor="component-outlined" sx={{ background: "white" }}>
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
