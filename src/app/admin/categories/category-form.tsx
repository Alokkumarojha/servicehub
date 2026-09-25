'use client';

import { useActionState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/toast';

import { createCategory, type CategoryFormState } from './actions';

const initialState: CategoryFormState = {
  success: false,
  message: '',
};

export default function CategoryForm() {
  const [state, formAction, pending] = useActionState(
    createCategory,
    initialState
  );
  useEffect(() => {
    if (!state.message) return;

    toast.add({
      title: state.message,
    });
  }, [state]);

  return (
    <form
      action={formAction}
      className="mb-6 rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Category name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Home Cleaning"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />

          {pending ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      {state.message && (
        <p
          className={`mt-3 text-sm ${
            state.success ? 'text-green-600' : 'text-destructive'
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
