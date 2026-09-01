"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Button, Dropdown, Input } from "@/components/ui";
import type { DropdownOption } from "@/components/ui";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";
import { useCreateInvitation } from "@/apiHooks.ts/invitation/invitation.api";
import { TEAM_INVITE_ENABLED } from "@/config/featureFlags";

const ROLE_OPTIONS: DropdownOption[] = [
  { value: "MEMBER", label: "Member" },
  { value: "ADMIN", label: "Admin" },
];

const ROLE_HELP: Record<string, string> = {
  MEMBER: "Can use the product. Cannot invite people or change billing.",
  ADMIN: "Can use the product and invite other people.",
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function TeamPage() {
  // Parked until GHL confirm the sub-account webhook behaviour.
  if (!TEAM_INVITE_ENABLED) notFound();
  return <TeamInvitePage />;
}

function TeamInvitePage() {
  const { orgId } = useParams();
  const { data: organization, isLoading } = useOrganizationDetails(
    orgId as string,
  );
  const createInvitation = useCreateInvitation();

  const [email, setEmail] = useState("");
  const [productId, setProductId] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [emailError, setEmailError] = useState("");
  const [productError, setProductError] = useState("");

  const products = useMemo(
    () => organization?.products ?? [],
    [organization?.products],
  );

  const productOptions: DropdownOption[] = useMemo(
    () =>
      products.map((product) => ({
        value: product.id,
        label: product.product_name || "Product",
      })),
    [products],
  );

  // With a single product there is nothing to choose — pick it for them.
  useEffect(() => {
    if (!productId && productOptions.length === 1) {
      setProductId(productOptions[0].value);
    }
  }, [productId, productOptions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const nextEmailError = !trimmedEmail
      ? "Enter an email address."
      : !isValidEmail(trimmedEmail)
        ? "That doesn't look like a valid email address."
        : "";
    const nextProductError = productId ? "" : "Choose a product.";

    setEmailError(nextEmailError);
    setProductError(nextProductError);
    if (nextEmailError || nextProductError) return;

    createInvitation.mutate(
      {
        email: trimmedEmail,
        orgId: orgId as string,
        productId,
        role: role as "ADMIN" | "MEMBER",
      },
      {
        onSuccess: () => {
          setEmail("");
          setRole("MEMBER");
          if (productOptions.length > 1) setProductId("");
        },
      },
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl py-2">
      <div className="mb-6">
        <h1 className="text-heading-2 font-semibold text-foreground">Team</h1>
        <p className="text-body-medium mt-1">
          Invite someone to join {organization?.name || "this organization"}.
          They&apos;ll get an email with a link to set up their account.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        {isLoading ? (
          <p className="text-body-medium py-6">Loading organization…</p>
        ) : products.length === 0 ? (
          <div className="py-6">
            <p className="text-body-medium">
              This organization has no products yet. Add a product before
              inviting people — an invite has to be tied to something they can
              use.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              isRequired
              placeholder="name@company.com"
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
            />

            {productOptions.length > 1 && (
              <Dropdown
                label="Product"
                isRequired
                options={productOptions}
                value={productId}
                error={productError}
                placeholder="Choose a product"
                onChange={(value) => {
                  setProductId(value);
                  if (productError) setProductError("");
                }}
              />
            )}

            <div>
              <Dropdown
                label="Role"
                isRequired
                options={ROLE_OPTIONS}
                value={role}
                onChange={setRole}
              />
              <p className="text-body-tiny mt-2">{ROLE_HELP[role]}</p>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                variant="primary"
                className="rounded-full px-6"
                isLoading={createInvitation.isPending}
                disabled={createInvitation.isPending}
              >
                Send invite
              </Button>
            </div>
          </form>
        )}
      </div>

      <p className="text-body-tiny mt-4">
        The invite link expires after 7 days. You can send it again if it runs
        out.
      </p>
    </div>
  );
}
