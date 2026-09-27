'use client';

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
    toggleCategoryStatus,
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
      <input type="hidden" name="categoryId" value={categoryId} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Updating...' : isActive ? 'Deactivate' : 'Activate'}
      </button>
    </form>
  );
}
