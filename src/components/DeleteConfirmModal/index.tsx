import { useState, useEffect, useRef } from 'react';

const ESC_KEY = 'Escape'

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const DeleteConfirmModal = ({ title, message, onConfirm, onClose, isOpen }: ConfirmModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalContainerRef = useRef<HTMLDivElement>(null)
  const cancelBtnRef = useRef<HTMLButtonElement>(null)
  const confirmBtnRef = useRef<HTMLButtonElement>(null)

  const [bodyCurrentPosition] = useState(window.scrollY)

  // close modal when clicking outside modal
  const outSideModalClickHandler = (event: Event) => {
    if (modalRef.current && !(modalRef.current as HTMLDivElement).contains(event.target as HTMLDivElement)) {
      handleClose()
    }
  }

  // close modal when pressing ESCAPE
  const EscKeydownHandler = (event: KeyboardEvent) => {
    if (event.key === ESC_KEY) {
      handleClose()
    }
  }

  const modalRef = useRef(null)
  useEffect(() => {
    document.addEventListener('mousedown', outSideModalClickHandler)
    document.addEventListener('keydown', EscKeydownHandler)
    return () => {
      document.removeEventListener('keydown', EscKeydownHandler)
      document.removeEventListener('mousedown', outSideModalClickHandler)
    }
  })

  // set focus to cancel button and prevent the modal from closing
  useEffect(() => {
    setTimeout(() => {
      cancelBtnRef.current?.focus()
    }, 150)

    document.body.style.position = 'fixed';
    document.body.style.top = `-${bodyCurrentPosition}px`;
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, bodyCurrentPosition)
    }
  }, [])

  useEffect(() => {
    if (modalContainerRef.current) {
      modalContainerRef.current.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) /* shift + tab */ {
            if (document.activeElement === cancelBtnRef.current) {
              confirmBtnRef.current?.focus();
              e.preventDefault();
            }
          } else /* tab */ {
            if (document.activeElement === confirmBtnRef.current) {
              cancelBtnRef.current?.focus();
              e.preventDefault();
            }
          }
        }
      })
    }

  }, [modalRef])


  const handleClose = () => {
    setIsModalOpen(false);
    onClose()
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    onConfirm();
  };

  useEffect(() => {
    setIsModalOpen(isOpen)
  }, [isOpen])

  return (
    <div
      ref={modalContainerRef}
      role="dialog"
      className={`modal-container${isModalOpen ? '' : ' hidden'}`}
    >
      <div className="modal" ref={modalRef}>
        <h1 className="title">{title}</h1>
        <p className="content">{message}</p>
        <div className="action">
          <button aria-label="cancel button" ref={cancelBtnRef} className="cancel-btn" onClick={handleClose}>NO, CANCEL</button>
          <button aria-label="delete confirm button" ref={confirmBtnRef} className="delete-confirm-btn" onClick={handleConfirm}> YES, DELETE</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal