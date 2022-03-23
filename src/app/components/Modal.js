import React from 'react';
import {Modal as RBModal} from 'react-bootstrap';
import PropTypes from 'prop-types';

function Modal(props) {
  const {
    show = false,
    title,
    modalSize = 'sm',
    modalType = 'default',
    closeButton,
    onHide,
    modalFooter,
    children
  } = props;
  const dialogClassName = modalType ? `modal-${modalType}` : undefined;
  return (
    <RBModal
      backdrop
      bsSize={modalSize}
      show={show}
      onHide={onHide}
      dialogClassName={dialogClassName}
      enforceFocus={false}
    >
      <RBModal.Header closeButton={closeButton}>
        <RBModal.Title>
          {title}
        </RBModal.Title>
      </RBModal.Header>
      <RBModal.Body>
        {children}
      </RBModal.Body>
      {modalFooter && <Modal.Footer>{modalFooter}</Modal.Footer>}
    </RBModal>
  )
}

Modal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  modalSize: PropTypes.oneOf(['xs', 'xsmall', 'sm', 'small', 'medium', 'lg', 'large']),
  modalType: PropTypes.oneOf(['default', 'info', 'danger', 'warning', 'success', 'primary']),
  closeButton: PropTypes.bool,
  onHide: PropTypes.func,
  modalFooter: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.elementType,
  ]),
};

export default Modal;
