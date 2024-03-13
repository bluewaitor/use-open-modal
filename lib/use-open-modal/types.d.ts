export type UseOpenModalProps = {
  onSuccess?: (result?: any) => void;
  onError?: (error?: any) => void;
  onCancel?: () => void;
};

export type ModalActions = {
  add: (element: ElementType) => number;
  remove: (id: number) => void;
  removeAll: () => void;
};
