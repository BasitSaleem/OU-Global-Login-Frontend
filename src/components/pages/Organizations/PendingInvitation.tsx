'use client';
import { useAcceptInvitation, useDeclineInvitation } from '@/apiHooks.ts/invitation/invitation.api';
import { inviteData } from '@/apiHooks.ts/invitation/invitation.type';
import InviteConfirmationModal from '@/components/modals/InviteConfirmationModal';
import { Button } from '@/components/ui';
import { getColorFromId } from '@/utils/getRandomColors';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';

const formatTimeElapsed = (createdAt: string) => {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const hoursElapsed = Math.floor((now - created) / (1000 * 60 * 60));
  const daysElapsed = Math.floor(hoursElapsed / 24);

  if (daysElapsed >= 1) {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }

  if (hoursElapsed < 1) {
    const minutesElapsed = Math.floor((now - created) / (1000 * 60));
    return minutesElapsed <= 1 ? 'Just now' : `${minutesElapsed}m ago`;
  }

  return `${hoursElapsed}h ago`;
};

const formatExpiration = (expiresAt: string) => {
  const now = Date.now();
  const expires = new Date(expiresAt).getTime();
  const hoursRemaining = Math.floor((expires - now) / (1000 * 60 * 60));
  const daysRemaining = Math.floor(hoursRemaining / 24);

  if (hoursRemaining < 0) {
    return { text: 'Expired', className: 'text-red-600 font-medium' };
  }

  if (daysRemaining < 1) {
    if (hoursRemaining < 1) {
      const minutesRemaining = Math.floor((expires - now) / (1000 * 60));
      return {
        text: `Expires in ${minutesRemaining}m`,
        className: 'text-orange-600 font-medium'
      };
    }
    return {
      text: `Expires in ${hoursRemaining}h`,
      className: 'text-orange-600 font-medium'
    };
  }

  const date = new Date(expiresAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });

  return {
    text: `Expires ${formattedDate}`,
  };
};

const InvitationSkeleton = () => (
  <div className="bg-bg-secondary border rounded-lg p-2 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-skeleton flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="h-5 bg-skeleton rounded w-40 mb-2" />
        <div className="h-4 bg-skeleton rounded w-64" />
      </div>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="h-9 bg-skeleton rounded w-20" />
      <div className="h-9 bg-skeleton rounded w-20" />
    </div>
  </div>
);

export default function PendingInvitations({
  invitations,
  isLoading,
}: {
  invitations: inviteData[];
  isLoading: boolean;
}) {
  const { mutate: acceptInvitation, isPending: isAcceptPending } = useAcceptInvitation({
    onSuccess: () => setIsModalOpen(false)
  })
  const { mutate: declineInvitation, isPending: isDeclinePending } = useDeclineInvitation({
    onSuccess: () => setIsModalOpen(false)
  })
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState('');
  const [modalAction, setModalAction] = useState<'accept' | 'decline'>('decline');

  return (
    <div>
      <h2 className="text-heading-2 font-bold text-black mb-4">
        Pending Invitations
      </h2>

      <div className="space-y-3">
        {isLoading ? (
          <>
            <InvitationSkeleton />
            <InvitationSkeleton />
            <InvitationSkeleton />
          </>
        ) : invitations?.length === 0 ? (
          <div className="bg-bg-secondary border border-dashed rounded-lg p-8 text-center">
            <p className="text-gray-500 text-body-medium">No pending invitations</p>
          </div>
        ) : (
          invitations?.map((invitation) => {
            const expirationInfo = formatExpiration(invitation.expiresAt);

            return (
              <div
                key={invitation.id}
                className="bg-bg-secondary border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {/* Left */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-white flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: getColorFromId(invitation?.organization?.id) }}
                  >
                    {invitation?.organization?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-body-large-bold text-black truncate mb-1">
                      {invitation?.organization?.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-small">
                      <span className="text-gray-600">
                        Invited by <span className="font-medium">{invitation?.inviter?.first_name.charAt(0).toUpperCase() + invitation?.inviter?.first_name.slice(1)} {invitation?.inviter?.last_name.charAt(0).toUpperCase() + invitation?.inviter?.last_name.slice(1)}</span>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className=" flex items-center gap-1">
                        <Calendar size={14} className="flex-shrink-0" />
                        {formatTimeElapsed(invitation.createdAt)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className={`flex items-center gap-1 ${expirationInfo.className}`}>
                        <Clock size={14} className="flex-shrink-0" />
                        {expirationInfo.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-shrink-0">
                  <Button
                    isLoading={isAcceptPending}
                    onClick={() => {
                      setSelectedToken(invitation.token);
                      setModalAction('accept');
                      setIsModalOpen(true);
                    }}
                    leftIcon={<Check size={16} />}
                    variant="primary"
                    className="flex-1 sm:flex-initial"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedToken(invitation.token);
                      setModalAction('decline');
                      setIsModalOpen(true);
                    }}
                    isLoading={isDeclinePending}
                    leftIcon={<X size={16} />}
                    variant="ghost"
                    className="flex-1 sm:flex-initial hover:bg-red"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <InviteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (modalAction === 'accept') {
            acceptInvitation(selectedToken);
          } else {
            declineInvitation(selectedToken);
          }
        }}
        token={selectedToken}
        isPending={modalAction === 'accept' ? isAcceptPending : isDeclinePending}
        title={
          modalAction === 'accept'
            ? "Accept Invitation?"
            : "Decline Invitation?"
        }
        description={
          modalAction === 'accept'
            ? "Are you sure you want to accept this invitation?"
            : "Are you sure you want to decline this invitation?"
        }
        confirmText={modalAction === 'accept' ? "Accept" : "Decline"}
        confirmVariant={modalAction === 'accept' ? "primary" : "destructive"}
      />
    </div>
  );
}
