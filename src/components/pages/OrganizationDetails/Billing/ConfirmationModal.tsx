import { Modal } from "@/components/modals/GenericModal";
import { Button } from "@/components/ui";

export function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText,
  onConfirm,
  isDestructive,
}: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="whitespace-pre-wrap mt-2">{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} className="h-10! py-0!">
          Cancel
        </Button>
        <Button
          variant={isDestructive ? "destructive" : "primary"}
          onClick={onConfirm}
          className="h-10! py-0!"
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
