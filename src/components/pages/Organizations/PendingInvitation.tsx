'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

type Invitation = {
  id: string;
  name: string;
  abbreviation: string;
  backgroundColor: string;
  invitedBy: string;
  product: string;
  timeAgo: string;
};

export default function PendingInvitations({
  invitations,
  onAccept,
  onDecline,
}: {
  invitations: Invitation[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void; // you can open DeclineModal in parent
}) {
  return (
    <div>
      <h2 className="text-heading-2 font-bold text-black mb-4">Pending Invitations</h2>

      <div className="space-y-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-white border border-gray-200 rounded p-2 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:shadow-sm transition-shadow"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-white text-body-small font-medium flex-shrink-0"
                style={{ backgroundColor: invitation.backgroundColor }}
              >
                {invitation.abbreviation}
              </div>
              <div className="min-w-0">
                <h3 className="text-body-medium-bold text-black truncate">
                  {invitation.name}
                </h3>
                <p className="text-body-small text-gray-500 pt-2">
                  Invited by {invitation.invitedBy} • {invitation.product} • {invitation.timeAgo}
                </p>
              </div>
            </div>

            {/* Right (buttons) */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer text-white rounded hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#795CF5' }}
                  onClick={() => onAccept(invitation.id)}
                >
                  <Check className="w-3 h-3" />
                  <span className="text-body-small">Accept</span>
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => onDecline(invitation.id)}
                >
                  <X className="w-3 h-3" />
                  <span className="text-body-small">Decline</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
