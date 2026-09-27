'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';

import { toast } from '@/components/ui/toast';

import { updateCategory, type EditCategoryState } from '../../actions';

const initialState: EditCategoryState = {
  success: false,
  message: '',
};

type EditCategoryFormProps = {
  categoryId: string;
  name: string;
  slug: string;
};

export default function EditCategoryForm({
  categoryId,
  name,
  slug,
}: EditCategoryFormProps) {
  const [state, formAction, pending] = useActionState(
    updateCategory,
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
      className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm"
    >
      <input type="hidden" name="categoryId" value={categoryId} />

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Category Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          defaultValue={name}
          disabled={pending}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Current Slug</p>

        <p className="text-sm text-muted-foreground">{slug}</p>
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Saving...' : 'Save Changes'}
        </button>

        <Link
          href="/admin/categories"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
