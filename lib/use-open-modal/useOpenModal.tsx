import { Modal, ModalProps } from "antd";
import { cloneElement, useContext, useRef, useState } from "react";
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

type UseOpenModalType = UseAntdOpenModal<ModalProps>;

const useOpenModal: UseOpenModalType = () => {
  const { add, remove, removeAll } = useContext(UseOpenModalContext);

  const currentId = useRef<number>();

  const openModal: ReturnType<UseAntdOpenModal>["open"] = (
    openElement,
    modalOptions,
    { beforeClose = defaultBeforeClose } = defaultOption
  ) => {
    return new Promise<any>((resolve, reject) => {
      const Element = () => {
        const [visible, setVisible] = useState(true);

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
