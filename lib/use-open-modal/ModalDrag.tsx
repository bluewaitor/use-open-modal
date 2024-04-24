import { PureComponent, ReactNode } from "react";
import { findDOMNode } from "react-dom";

interface OwnProps {
  clickable: boolean;
  title: ReactNode;
}

type Props = OwnProps;

class ModalDrag extends PureComponent<Props> {
  static defaultProps = {
    clickable: false,
  };

  private readonly position = {
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  };

  private modal: HTMLDivElement | null = null;
  private header: HTMLDivElement | null = null;

  componentDidMount(): void {
    const { clickable } = this.props;

    const modalWrap: Element | null = this.getParentNode(
      findDOMNode(this),
      (node) => {
        const className = node.getAttribute("class");

        return !!className && className.split(" ").includes("ant-modal-wrap");
      }
    );

    if (!modalWrap) {
      return;
    }

    this.modal = modalWrap.querySelector(".ant-modal");
    this.header = modalWrap.querySelector(".ant-modal .ant-modal-header");

    if (clickable) {
      (modalWrap as HTMLDivElement).style.pointerEvents = "none";

      if (this.modal) {
        this.modal.style.pointerEvents = "auto";
      }
    }

    if (this.header) {
      this.header.style.cursor = "move";
      this.header.addEventListener("mousedown", this.handleStart);
      document.removeEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("mouseup", this.handleMouseUp);
    }
  }

  componentWillUnmount() {
    if (this.header) {
      this.header.removeEventListener("mousedown", this.handleStart);
    }

    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("mousemove", this.handleMove);
  }

  getParentNode(
    node: Element | Text | null,
    when: (node: Element) => boolean
  ): Element | null {
    node = node as Element | null;
    if (!node) {
      return node;
    }

    const ELEMENT_NODE = 1;

    if (node.nodeType === ELEMENT_NODE && when(node)) {
      return node;
    }

    return this.getParentNode(node.parentNode as Element, when);
  }

  render() {
    return this.props.title;
  }

  protected handleStart = (event: MouseEvent) => {
    // 只允许左键，右键问题在于不选择conextmenu就不会触发mouseup事件
    if (event.button !== 0) {
      return;
    }

    document.addEventListener("mousemove", this.handleMove);
    this.position.startX = event.pageX - this.position.offsetX;
    this.position.startY = event.pageY - this.position.offsetY;
  };

  protected handleMove = (event: MouseEvent) => {
    if (this.modal) {
      const translateX = event.pageX - this.position.startX;
      const translateY = event.pageY - this.position.startY;
      this.modal.style.transform = `translate(${translateX}px, ${translateY}px)`;
      this.position.offsetX = translateX;
      this.position.offsetY = translateY;
    }
  };

  protected handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleMove);
  };
}

export default ModalDrag;
