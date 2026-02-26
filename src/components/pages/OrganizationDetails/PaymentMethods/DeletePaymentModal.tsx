import React from "react";
import { Modal } from "@/components/modals/GenericModal";
import { Button } from "@/components/ui";
import { Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  isDeleting = false,
  onClose,
  onDelete,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Title>Delete Payment Method</Modal.Title>

      <Modal.Header>
        Are you sure you want to delete this payment method?
      </Modal.Header>

      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={isDeleting}
          onClick={handleSubmit}
        >
          {isDeleting ? (
            <>
              <Loader2 className=" h-4 w-4 animate-spin" /> Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
