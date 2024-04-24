# Use Open Modal

## Usage

- 引入`UseOpenModalContextProvider`, 将 App 包裹

```jsx
import ReactDOM from "react-dom/client";
import { UseOpenModalContextProvider } from "use-open-modal";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UseOpenModalContextProvider>
    <App />
  </UseOpenModalContextProvider>
);

```

- 使用

```jsx
import { Button } from "antd";
import { useCallback } from "react";
import { useOpenModal } from "../dist/main";
import "./App.css";

function App() {
  const { open } = useOpenModal();

  const openModal = useCallback(() => {
    open(<div>弹窗内容</div>, {
      title: "弹窗标题",
      draggable: true, // 支持拖拽
    });
  }, []);

  return (
    <>
      <Button onClick={openModal}>打开弹窗</Button>
    </>
  );
}

export default App;
```
