import { Modal, ModalProps } from "antd";
import { cloneElement, useContext, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { UseOpenModalContext } from "./context";
import { UseOpenModalProps } from "./types";

type IOpen<ModalOptions extends any> = (
  openElement: React.ReactElement & UseOpenModalProps,
  modalOptions?: ModalOptions,
  additionalOptions?: {
    beforeClose?: () => Promise<void>;
  }
) => Promise<any>;

type UseAntdOpenModal<ModalOptions = any> = () => {
  open: IOpen<ModalOptions>;
  closeAll: () => void;
  close: () => void;
};

const defaultOption = {};
const defaultBeforeClose = () => Promise.resolve();

type UseOpenModalType = UseAntdOpenModal<
  ModalProps & {
    draggable?: boolean;
  }
>;

const useOpenModal: UseOpenModalType = () => {
  const { add, remove, removeAll } = useContext(UseOpenModalContext);

  const currentId = useRef<number>();

  const openModal: ReturnType<UseOpenModalType>["open"] = (
    openElement,
    modalOptions,
    { beforeClose = defaultBeforeClose } = defaultOption
  ) => {
    return new Promise<any>((resolve, reject) => {
      const Element = () => {
        const [visible, setVisible] = useState(true);
        const [disabled, setDisabled] = useState(true);
        const [bounds, setBounds] = useState({
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
        });
        const draggleRef = useRef<HTMLDivElement>(null);
        const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
          const { clientWidth, clientHeight } = window.document.documentElement;
          const targetRect = draggleRef.current?.getBoundingClientRect();
          if (!targetRect) {
            return;
          }
          setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
          });
        };

        const draggable = modalOptions?.draggable;

        const close = () => {
          setVisible(false);
        };

        const destroy = () => {
          remove(id);
        };

        return (
          <Modal
            footer={null}
            maskClosable={false}
            {...modalOptions}
            open={visible}
            destroyOnClose={true}
            onCancel={() => {
              beforeClose().then(() => {
                close();
              });
            }}
            afterClose={destroy}
            modalRender={(modal) => {
              return draggable ? (
                <Draggable
                  disabled={disabled}
                  bounds={bounds}
                  nodeRef={draggleRef}
                  onStart={(event, uiData) => onStart(event, uiData)}
                >
                  <div ref={draggleRef}>{modal}</div>
                </Draggable>
              ) : (
                modal
              );
            }}
            wrapProps={{
              style: {
                pointerEvents: "none",
              },
            }}
            title={
              draggable ? (
                <div
                  style={{
                    width: "100%",
                    cursor: "move",
                  }}
                  onMouseOver={() => {
                    if (disabled) {
                      setDisabled(false);
                    }
                  }}
                  onMouseOut={() => {
                    setDisabled(true);
                  }}
                  // fix eslintjsx-a11y/mouse-events-have-key-events
                  // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                  onFocus={() => {}}
                  onBlur={() => {}}
                  // end
                >
                  {modalOptions?.title}
                </div>
              ) : (
                modalOptions?.title
              )
            }
          >
            {cloneElement(openElement, {
              ...openElement.props,
              onSuccess: (result: any) => {
                close();
                resolve(result);
              },
              onError: (error: any) => {
                close();
                reject(error);
              },
              onCancel: () => {
                close();
              },
            })}
          </Modal>
        );
      };

      const id = add(Element);

      currentId.current = id;
    });
  };

  return {
    open: openModal,
    closeAll: removeAll,
    close: () => {
      remove(currentId.current || 0);
    },
  };
};

export { useOpenModal };
