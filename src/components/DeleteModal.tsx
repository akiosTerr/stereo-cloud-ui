import { useState } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1a1a1a;
  border-radius: 0.8rem;
  padding: 2rem;
  width: 90%;
  max-width: 420px;
  border: 1px solid #333;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  &:hover {
    border: 1px solid #fff;
    border-radius: 0.25rem;
  }
`;

const Message = styled.p`
  color: #ccc;
  margin: 0 0 1.5rem;
  line-height: 1.5;
`;

const VideoTitleHighlight = styled.span`
  color: #fff;
  font-weight: 600;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
  background-color: #2a2a2a;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    border-color: #777;
    background-color: #333;
  }
`;

const ConfirmDeleteButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #c00;
  background-color: #8b0000;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover:not(:disabled) {
    background-color: #a00;
    border-color: #f00;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export type DeleteModalVideo = {
  id: string;
  asset_id: string;
  title: string;
};

type DeleteModalProps = {
  isOpen: boolean;
  video: DeleteModalVideo | null;
  onClose: () => void;
  onConfirm: (id: string, asset_id: string) => Promise<void>;
  titleLabel?: string;
  confirmButtonLabel?: string;
  deletingLabel?: string;
};

const DeleteModal = ({
  isOpen,
  video,
  onClose,
  onConfirm,
  titleLabel = "Delete video",
  confirmButtonLabel = "Delete",
  deletingLabel = "Deleting…",
}: DeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!video) return;
    setIsDeleting(true);
    try {
      await onConfirm(video.id, video.asset_id);
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{titleLabel}</ModalTitle>
          <CloseButton type="button" onClick={onClose} disabled={isDeleting} aria-label="Close">
            ×
          </CloseButton>
        </ModalHeader>
        <Message>
          Are you sure you want to delete{" "}
          <VideoTitleHighlight>{video?.title ?? "this item"}</VideoTitleHighlight>? This cannot be undone.
        </Message>
        <ButtonRow>
          <CancelButton type="button" onClick={onClose} disabled={isDeleting}>
            Cancel
          </CancelButton>
          <ConfirmDeleteButton type="button" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? deletingLabel : confirmButtonLabel}
          </ConfirmDeleteButton>
        </ButtonRow>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteModal;
