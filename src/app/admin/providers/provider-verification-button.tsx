'use client';

import { unstable_rethrow } from 'next/navigation';

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
    async (previousState: typeof initialState, formData: FormData) => {
      try {
        const result = await toggleProviderVerification(previousState, formData);

        return result;
      } catch (error) {
        unstable_rethrow(error);
        return { success: false, message: "Could not confirm verification was updated. Refresh the page before trying again." };
      }
    },
    initialState
  );

  useEffect(() => {
    if (!state.message) return;

    toast.add({
      title: state.message,
      type: state.success ? 'success' : 'error',
    });
  }, [state]);

  return (
    <form action={formAction} aria-busy={pending}>
      <input type="hidden" name="providerId" value={providerId} />

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Updating...' : isVerified ? 'Unverify' : 'Verify'}
      </button>
      {state.message && !state.success && <p role="alert" className="mt-2 text-sm text-destructive">{state.message}</p>}
    </form>
  );
}
