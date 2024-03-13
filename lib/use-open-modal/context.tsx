import { createContext, memo } from "react";
import { useOpenModalReducer } from "./store";
import { ModalActions } from "./types";

type IUseOpenModalContext = ModalActions;

export const UseOpenModalContext = createContext({} as IUseOpenModalContext);

const InnerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { modals, add, remove, removeAll } = useOpenModalReducer();

  return (
    <UseOpenModalContext.Provider value={{ add, remove, removeAll }}>
      {children}
      {Object.entries(modals).map(([key, value]) => {
        const Component = value;
        return <Component key={key} />;
      })}
    </UseOpenModalContext.Provider>
  );
};

export const UseOpenModalContextProvider = memo(InnerContextProvider);
