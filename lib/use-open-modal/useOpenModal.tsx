import { Modal, ModalProps } from "antd";
import { cloneElement, useContext, useRef, useState } from "react";
import ModalDrag from "./ModalDrag";
import { UseOpenModalContext } from "./context";
import { UseOpenModalProps } from "./types";

type IOpen<ModalOptions extends any> = (
  openElement: React.ReactElement & UseOpenModalProps,
  modalOptions?: ModalOptions,
  additionalOptions?: {
    beforeClose?: () => Promise<void>;
    afterClose?: () => Promise<void>;
  }
) => Promise<any>;

type UseAntdOpenModal<ModalOptions = any> = () => {
  open: IOpen<ModalOptions>;
  closeAll: () => void;
  close: () => void;
};

const defaultOption = {};
const defaultBeforeClose = () => Promise.resolve();
const defaultAfterClose = () => Promise.resolve();

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
    {
      beforeClose = defaultBeforeClose,
      afterClose = defaultAfterClose,
    } = defaultOption
  ) => {
    return new Promise<any>((resolve, reject) => {
      const Element = () => {
        const [visible, setVisible] = useState(true);
        const draggable = modalOptions?.draggable;

        const close = () => {
          setVisible(false);
          afterClose();
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
            styles={{
              mask: {
                pointerEvents: !draggable ? "auto" : "none",
              },
              ...modalOptions?.styles,
            }}
            title={
              draggable ? (
                <ModalDrag title={modalOptions?.title} clickable={true} />
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
