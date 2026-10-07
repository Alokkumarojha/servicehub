'use client';

import { useActionState, useEffect } from 'react';

import { toast } from '@/components/ui/toast';

import {
  toggleProviderVerification,
  type ProviderVerificationState,
} from './actions';

const initialState: ProviderVerificationState = {
  success: false,
  message: '',
};

type ProviderVerificationButtonProps = {
  providerId: string;
  isVerified: boolean;
};

export default function ProviderVerificationButton({
  providerId,
  isVerified,
}: ProviderVerificationButtonProps) {
  const [state, formAction, pending] = useActionState(
    toggleProviderVerification,
    initialState
  );

  useEffect(() => {
    if (!state.message) return;

    toast.add({
      title: state.message,
    });
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="providerId" value={providerId} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Updating...' : isVerified ? 'Unverify' : 'Verify'}
      </button>
    </form>
  );
}
