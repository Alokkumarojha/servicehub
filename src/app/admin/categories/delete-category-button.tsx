'use client';

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
  const [state, formAction, pending] = useActionState(
    deleteCategory,
    initialState
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!state.message) return;

    setOpen(false);

    toast.add({
      title: state.message,
    });
  }, [state]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <form action={formAction}>
            <input type="hidden" name="categoryId" value={categoryId} />

            <AlertDialogAction type="submit" disabled={pending}>
              {pending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
