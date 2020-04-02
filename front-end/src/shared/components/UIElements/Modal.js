import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import BackDrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = props => {
  // content is the content rendered in the modal
  // className={`modal ${props.className}`} this allows multiple classNames to be used allowing reusability
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          // prettier-ignore
          props.onSubmit ? props.onSubmit : (event => event.preventDefault())
        }
      >
        <div className={`modal_content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = props => {
  return (
    <React.Fragment>
      {props.show && <BackDrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        mountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
