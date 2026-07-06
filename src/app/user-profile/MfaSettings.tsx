"use client";

import { useState } from "react";
import {
  useGenerateMfa,
  useVerifyEnableMfa,
  useDisableMfa,
} from "@/apiHooks.ts/auth/auth.api";
import { Button, Input } from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setProfile } from "@/redux/slices/auth.slice";
import { Modal } from "@/components/modals/GenericModal";
import { toast } from "@/hooks/useToast";

export function MfaSettings() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  // MFA states
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [mfaQrCode, setMfaQrCode] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRecoveryCodes, setMfaRecoveryCodes] = useState<string[]>([]);

  const { mutate: generateMfa, isPending: isGeneratingMfa } = useGenerateMfa();
  const { mutate: verifyEnableMfa, isPending: isVerifyingMfa } =
    useVerifyEnableMfa();
  const { mutate: disableMfa, isPending: isDisablingMfa } = useDisableMfa();

  return (
    <>
      <div className="flex-1 border rounded-lg w-full bg-bg-secondary shadow-sm">
        <div className="flex items-center justify-between p-5 border-b">
          <h1 className="text-heading-1 font-bold text-black">
            Two-Factor Authentication (2FA)
          </h1>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Add an extra layer of security to your account by enabling
            two-factor authentication.
          </p>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-text">
              Status:{" "}
              <span
                className={
                  user?.mfa_enabled ? "text-green-500" : "text-gray-500"
                }
              >
                {user?.mfa_enabled ? "Enabled" : "Disabled"}
              </span>
            </span>

            {!user?.mfa_enabled ? (
              <Button
                onClick={() => {
                  generateMfa(undefined, {
                    onSuccess: (res: any) => {
                      setMfaQrCode(res.data.qrCode);
                      setMfaSecret(res.data.secret);
                      setShowMfaModal(true);
                    },
                  });
                }}
                disabled={isGeneratingMfa}
                className="bg-primary text-white font-bold px-4 py-2 rounded"
              >
                {isGeneratingMfa ? "Generating..." : "Enable 2FA"}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowDisableModal(true);
                  }}
                  disabled={isDisablingMfa}
                  className="bg-red-500 text-white font-bold px-4 py-2 rounded border border-red-500"
                >
                  {isDisablingMfa ? "Disabling..." : "Disable 2FA"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showMfaModal}
        onClose={() => {
          setShowMfaModal(false);
          setMfaCode("");
        }}
        size="md"
      >
        <Modal.Header>
          <Modal.Title>Set up 2FA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mfaRecoveryCodes.length > 0 ? (
            <div>
              <p className="mb-4 text-sm text-text">
                2FA is now enabled. Please save these recovery codes in a safe
                place. You will need them if you lose access to your
                authenticator app.
              </p>
              <div className="bg-gray-100 p-4 rounded grid grid-cols-2 gap-2 mb-4 font-mono text-sm">
                {mfaRecoveryCodes.map((code) => (
                  <div key={code} className="text-black">
                    {code}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={() => {
                    const text = mfaRecoveryCodes.join("\n");
                    navigator.clipboard.writeText(text);
                    toast.success(
                      "Codes copied",
                      "Recovery codes copied to clipboard",
                    );
                  }}
                  className="flex-1 border py-2 rounded text-sm hover:bg-gray-50 text-text"
                >
                  Copy Codes
                </Button>
                <Button
                  onClick={() => {
                    const text = mfaRecoveryCodes.join("\n");
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "recovery-codes.txt";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    toast.success(
                      "Codes downloaded!",
                      "Recovery code downloaded successfully",
                    );
                  }}
                  className="flex-1 border py-2 rounded text-sm hover:bg-gray-50 text-text"
                >
                  Download .txt
                </Button>
              </div>
              <Button
                onClick={() => setShowMfaModal(false)}
                className="w-full bg-primary text-white py-2 rounded"
              >
                Done
              </Button>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm text-text">
                1. Scan this QR code with your authenticator app (e.g. Google
                Authenticator).
              </p>
              <div className="flex justify-center mb-4">
                {mfaQrCode && (
                  <img
                    src={mfaQrCode}
                    alt="QR Code"
                    className="w-48 h-48 border rounded"
                  />
                )}
              </div>
              {/* <p className="text-center text-xs text-gray-500 mb-4 font-mono">{mfaSecret}</p> */}

              <p className="mb-2 text-sm text-text">
                2. Enter the 6-digit code generated by the app to verify.
              </p>
              <Input
                type="text"
                value={mfaCode}
                onChange={(e: any) => setMfaCode(e.target.value)}
                placeholder="000000"
                className="mb-4"
              />

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setShowMfaModal(false);
                    setMfaCode("");
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    verifyEnableMfa(
                      { code: mfaCode },
                      {
                        onSuccess: (res: any) => {
                          setMfaRecoveryCodes(res.data.recoveryCodes);
                          if (user) {
                            dispatch(
                              setProfile({ ...user, mfa_enabled: true }),
                            );
                          }
                        },
                      },
                    );
                  }}
                  disabled={isVerifyingMfa || !mfaCode}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  {isVerifyingMfa ? "Verifying..." : "Verify & Enable"}
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        isOpen={showDisableModal}
        onClose={() => {
          setShowDisableModal(false);
          setMfaCode("");
        }}
        size="md"
      >
        <Modal.Header>
          <Modal.Title>Disable 2FA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2 text-sm text-text">
            Enter the 6-digit code from your authenticator app (or one of your
            8-character recovery codes) to confirm you want to disable 2FA.
          </p>
          <Input
            type="text"
            value={mfaCode}
            onChange={(e: any) => setMfaCode(e.target.value)}
            placeholder="000000 or a1b2c3d4"
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setShowDisableModal(false);
                setMfaCode("");
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                disableMfa(
                  { code: mfaCode },
                  {
                    onSuccess: () => {
                      setMfaCode("");
                      setShowDisableModal(false);
                      if (user) {
                        dispatch(setProfile({ ...user, mfa_enabled: false }));
                      }
                    },
                  },
                );
              }}
              disabled={isDisablingMfa || !mfaCode}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              {isDisablingMfa ? "Disabling..." : "Disable 2FA"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
