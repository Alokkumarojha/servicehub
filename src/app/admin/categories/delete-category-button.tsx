'use client';

import { unstable_rethrow } from 'next/navigation';

import { useActionState, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

import { deleteCategory } from './actions';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/toast';

const initialState = {
  success: false,
  message: '',
};

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
};

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (previousState: typeof initialState, formData: FormData) => {
      try {
        const result = await deleteCategory(previousState, formData);
        if (result.success) setOpen(false);
        return result;
      } catch (error) {
        unstable_rethrow(error);
        return { success: false, message: "Could not confirm deletion. Refresh the list before trying again." };
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
    <AlertDialog open={open} onOpenChange={(nextOpen) => { if (!pending) setOpen(nextOpen); }}>
      <AlertDialogTrigger
        render={<Button type="button" variant="destructive" size="sm" />}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete &quot;{categoryName}&quot;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {state.message && !state.success && <p role="alert" className="text-sm text-destructive">{state.message}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>

          <form action={formAction} aria-busy={pending}>
            <input type="hidden" name="categoryId" value={categoryId} />

            <AlertDialogAction type="submit" variant="destructive" disabled={pending}>
              {pending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
