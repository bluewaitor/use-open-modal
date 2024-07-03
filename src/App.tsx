import { Button } from "antd";
import { useCallback } from "react";
import { useOpenModal } from "../dist/main";
import "./App.css";

function App() {
  const { open } = useOpenModal();

  const openModal = useCallback(() => {
    open(
      <div>弹窗内容</div>,
      {
        title: "弹窗标题",
        draggable: true,
        mask: false,
      },
      {
        beforeClose: async () => {
          console.log("111");
        },
        afterClose: async () => {
          console.log("222");
        },
      }
    );
  }, []);

  return (
    <>
      <Button onClick={openModal}>打开弹窗</Button>
      <Button onClick={openModal}>打开弹窗</Button>
    </>
  );
}

export default App;
