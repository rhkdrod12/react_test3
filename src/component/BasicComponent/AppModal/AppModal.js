import React from "react";
import { createContext } from "react";


export const ModalsDispatchContext = createContext({
    open: () => {},
    close: () => {},
  });
  ​

export const ModalsStateContext = createContext([]);


const ModalsProvider = ({ children }) => {

  const [openedModals, setOpenedModals] = useState([]);
  ​
  // 
  const open = (Component, props) => {
    setOpenedModals((modals) => {
      return [...modals, { Component, props }];
    });
  };

  const close = (Component) => {
    setOpenedModals((modals) => {
      return modals.filter((modal) => {
        return modal.Component !== Component;
      });
    });
  };
​
  const dispatch = useMemo(() => ({ open, close }), []);

  return (
    <ModalsStateContext.Provider value={openedModals}>
      <ModalsDispatchContext.Provider value={dispatch}>
        {children}
      </ModalsDispatchContext.Provider>
    </ModalsStateContext.Provider>
  );
};

const AppModal = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(show);
  }, [show]);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
      <Box sx={{ width: 400 }}>
        <h2 id="parent-modal-title">Text in a modal</h2>
        <p id="parent-modal-description">{message}</p>
        <Button onClick={handleClose} variant="contained" sx={{ float: "right", alignItems: "center", height: "30px", marginLeft: "4px" }}>
          <span>닫기</span>
        </Button>
      </Box>
    </Modal>
  );
};

export default AppModal;
