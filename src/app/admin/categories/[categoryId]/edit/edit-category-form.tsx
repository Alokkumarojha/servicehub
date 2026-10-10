'use client';

import { unstable_rethrow } from 'next/navigation';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';

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
  const [nameValue, setName] = useState(name);
  const [state, formAction, pending] = useActionState(
    async (previousState: typeof initialState, formData: FormData) => {
      try {
        const result = await updateCategory(previousState, formData);

        return result;
      } catch (error) {
        unstable_rethrow(error);
        return { success: false, message: "Could not save the category. Your changes are still here; please try again." };
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
    <form
      action={formAction}
      aria-busy={pending}
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
          value={nameValue}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(state.message && !state.success)}
          aria-describedby={state.message && !state.success ? "category-feedback" : undefined}
          disabled={pending}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Current Slug</p>

        <p className="text-sm text-muted-foreground">{slug}</p>
      </div>

      {state.message && !state.success && (
        <p id="category-feedback" role="alert" className="text-sm text-destructive">{state.message}</p>
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
