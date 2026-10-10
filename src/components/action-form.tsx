'use client';

import { createContext, useContext, useId, useRef, useState, useTransition, type ComponentProps } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type FormFeedback = { message: string; fieldErrors?: Record<string, string> };
const FeedbackContext = createContext<{ feedback: FormFeedback; pending: boolean; id: string }>({ feedback: { message: '' }, pending: false, id: '' });

// Keep server-rendered fields and their values mounted when submission fails.
export function ActionForm({ action, fallbackAction, failureMessage, children, ...props }: Omit<ComponentProps<'form'>, 'action' | 'onSubmit'> & {
  action: (data: FormData) => Promise<FormFeedback>;
  fallbackAction: (data: FormData) => Promise<void>;
  failureMessage: string;
}) {
  const [feedback, setFeedback] = useState<FormFeedback>({ message: '' });
  const [pending, startTransition] = useTransition();
  const submitting = useRef(false);
  const id = useId();

  return (
    <FeedbackContext.Provider value={{ feedback, pending, id }}>
      <form {...props} action={fallbackAction} aria-busy={pending} onSubmit={(event) => {
        event.preventDefault();
        if (submitting.current) return;
        const data = new FormData(event.currentTarget);
        submitting.current = true;
        setFeedback({ message: '' });
        startTransition(async () => {
          try {
            setFeedback(await action(data));
          } catch (error) {
            unstable_rethrow(error);
            setFeedback({ message: failureMessage });
          } finally {
            submitting.current = false;
          }
        });
      }}>
        {feedback.message && (
          <div ref={(node) => { node?.focus(); }} tabIndex={-1} role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm focus-visible:outline-2 focus-visible:outline-ring">
            {feedback.message}
          </div>
        )}
        {children}
        <p role="status" className="sr-only">{pending ? 'Submitting. Please wait.' : ''}</p>
      </form>
    </FeedbackContext.Provider>
  );
}

export function FormInput(props: ComponentProps<typeof Input>) {
  const { feedback, pending, id } = useContext(FeedbackContext);
  const error = feedback.fieldErrors?.[props.name ?? ''];
  return <Input {...props} disabled={pending || props.disabled} aria-invalid={Boolean(error)} aria-describedby={[props['aria-describedby'], error ? `${id}-${props.name}-error` : ''].filter(Boolean).join(' ') || undefined} />;
}

export function FormSelect(props: ComponentProps<'select'>) {
  const { feedback, pending, id } = useContext(FeedbackContext);
  const error = feedback.fieldErrors?.[props.name ?? ''];
  return <select {...props} disabled={pending || props.disabled} aria-invalid={Boolean(error)} aria-describedby={[props['aria-describedby'], error ? `${id}-${props.name}-error` : ''].filter(Boolean).join(' ') || undefined} />;
}

export function FormTextarea(props: ComponentProps<typeof Textarea>) {
  const { pending } = useContext(FeedbackContext);
  return <Textarea {...props} disabled={pending || props.disabled} />;
}

export function FormRadio(props: ComponentProps<'input'>) {
  const { feedback, pending, id } = useContext(FeedbackContext);
  const error = feedback.fieldErrors?.[props.name ?? ''];
  return <input {...props} type="radio" disabled={pending || props.disabled} aria-describedby={error ? `${id}-${props.name}-error` : props['aria-describedby']} />;
}

export function FieldError({ name }: { name: string }) {
  const { feedback, id } = useContext(FeedbackContext);
  const error = feedback.fieldErrors?.[name];
  return error ? <p id={`${id}-${name}-error`} className="text-sm text-destructive">{error}</p> : null;
}

export function SubmitButton({ children, pendingLabel, ...props }: ComponentProps<typeof Button> & { pendingLabel: string }) {
  const { pending } = useContext(FeedbackContext);
  return <Button {...props} type="submit" disabled={pending || props.disabled}>{pending ? pendingLabel : children}</Button>;
}
