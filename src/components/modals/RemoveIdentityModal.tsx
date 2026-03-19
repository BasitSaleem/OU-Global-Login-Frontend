import React from 'react'
import { Modal } from './GenericModal'
import { Button } from '../ui'

const RemoveIdentityModal = ({ showDeleteModal, setShowDeleteModal, identityToDelete, handleRemoveIdentity, isRemoving }: any) => {
    console.log(identityToDelete, "/////");

    return (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md" ariaLabel="Remove Connected Account">
            <Modal.Title className="mt-4 mb-4">
                Remove Connected Account?
            </Modal.Title>
            <Modal.Body>
                <p className="text-text leading-relaxed">
                    You are about to remove your <span className="font-bold capitalize text-text">{identityToDelete?.provider}</span> account "<span className="text-primary font-medium">{identityToDelete?.email}</span>".
                    You will no longer be able to use this method to sign in.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isRemoving}
                    >
                        Keep Account
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleRemoveIdentity}
                        isLoading={isRemoving}
                    >
                        Remove
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default RemoveIdentityModal