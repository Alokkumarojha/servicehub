'use client';

import { unstable_rethrow } from 'next/navigation';

import { useActionState, useEffect } from 'react';

import { toast } from '@/components/ui/toast';

import { toggleCategoryStatus, type CategoryFormState } from './actions';

const initialState: CategoryFormState = {
  success: false,
  message: '',
};

type CategoryStatusButtonProps = {
  categoryId: string;
  isActive: boolean;
};

export default function CategoryStatusButton({
  categoryId,
  isActive,
}: CategoryStatusButtonProps) {
  const [state, formAction, pending] = useActionState(
    async (previousState: typeof initialState, formData: FormData) => {
      try {
        const result = await toggleCategoryStatus(previousState, formData);

        return result;
      } catch (error) {
        unstable_rethrow(error);
        return { success: false, message: "Could not confirm the status change. Refresh the page before trying again." };
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
      <input type="hidden" name="categoryId" value={categoryId} />

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Updating...' : isActive ? 'Deactivate' : 'Activate'}
      </button>
      {state.message && !state.success && <p role="alert" className="mt-2 text-sm text-destructive">{state.message}</p>}
    </form>
  );
}
