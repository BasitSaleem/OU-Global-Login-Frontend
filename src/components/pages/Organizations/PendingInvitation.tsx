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
      <h2 className="text-lg sm:text-xl font-bold text-black mb-6">Pending Invitations</h2>

      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-sm transition-shadow"
          >
            {/* Left */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white text-xs sm:text-lg font-medium flex-shrink-0"
                style={{ backgroundColor: invitation.backgroundColor }}
              >
                {invitation.abbreviation}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold text-black truncate">
                  {invitation.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Invited by {invitation.invitedBy} • {invitation.product} • {invitation.timeAgo}
                </p>
              </div>
            </div>

            {/* Right (buttons) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#795CF5' }}
                  onClick={() => onAccept(invitation.id)}
                >
                  <Check className="w-4 h-4" />
                  <span className="text-xs sm:text-lg">Accept</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => onDecline(invitation.id)}
                >
                  <X className="w-4 h-4" />
                  <span className="text-xs sm:text-lg">Decline</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
