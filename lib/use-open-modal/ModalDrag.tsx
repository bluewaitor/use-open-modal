import { useEffect, useRef, type ReactNode } from "react";

interface ModalDragProps {
  clickable: boolean;
  title: ReactNode;
}

const ModalDrag = ({ clickable = false, title }: ModalDragProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const position = useRef({
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    if (!titleRef.current) return;

    const findModalWrap = (node: Element | null): Element | null => {
      if (!node) return null;
      const className = node.getAttribute("class");
      if (className?.split(" ").includes("ant-modal-wrap")) {
        return node;
      }
      return findModalWrap(node.parentElement);
    };

    const modalWrap = findModalWrap(titleRef.current);
    if (!modalWrap) return;

    const modalElement = modalWrap.querySelector(
      ".ant-modal"
    ) as HTMLDivElement;
    const headerElement = modalWrap.querySelector(
      ".ant-modal .ant-modal-header"
    ) as HTMLDivElement;

    modalRef.current = modalElement;
    headerRef.current = headerElement;

    if (clickable) {
      (modalWrap as HTMLDivElement).style.pointerEvents = "none";
      if (modalElement) {
        modalElement.style.pointerEvents = "auto";
      }
    }

    if (headerElement) {
      headerElement.style.cursor = "move";
      headerElement.addEventListener("mousedown", handleStart);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (headerElement) {
        headerElement.removeEventListener("mousedown", handleStart);
      }
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMove);
    };
  }, [clickable]);

  const handleStart = (event: MouseEvent) => {
    if (event.button !== 0) return;
    document.addEventListener("mousemove", handleMove);
    position.current.startX = event.pageX - position.current.offsetX;
    position.current.startY = event.pageY - position.current.offsetY;
  };

  const handleMove = (event: MouseEvent) => {
    if (!modalRef.current) return;
    const translateX = event.pageX - position.current.startX;
    const translateY = event.pageY - position.current.startY;
    modalRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
    position.current.offsetX = translateX;
    position.current.offsetY = translateY;
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMove);
  };

  return <div ref={titleRef}>{title}</div>;
};

export default ModalDrag;
