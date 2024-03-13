import { ElementType, useReducer } from "react";

let id = 0;
const getId = () => (id += 1);

type ReducerState = {
  [key: string]: ElementType;
};

type ReducerAction = {
  type: "add" | "remove" | "removeAll";
  payload?: ElementType | number;
  id?: number;
};

function reducer(state: ReducerState, action: ReducerAction) {
  const { type, payload, id } = action;

  switch (type) {
    case "add":
      if (id) {
        return {
          ...state,
          [id]: payload,
        };
      }
      return state;
    case "remove":
      if (typeof payload === "number") {
        const { [payload]: value, ...others } = state;
        return others;
      }
      return state;
    case "removeAll":
      return {};
  }
}

export const useOpenModalReducer = () => {
  const [state, dispatch] = useReducer(reducer, {});

  function add(element: ElementType) {
    const id = getId();

    dispatch({
      type: "add",
      payload: element,
      id,
    });

    return id;
  }

  function remove(id: number) {
    dispatch({
      type: "remove",
      payload: id,
    });
  }

  function removeAll() {
    dispatch({
      type: "removeAll",
    });
  }

  return {
    add,
    remove,
    removeAll,
    modals: state,
  };
};
