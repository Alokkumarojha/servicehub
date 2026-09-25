import { redirect } from 'next/navigation';
import { BriefcaseBusiness } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import { createProviderProfile } from './actions';

export default async function ProviderOnboardingPage() {
  const user = await getCurrentUser();

  const existingProvider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  // Already provider hai to onboarding dobara nahi dikhayenge.
  if (existingProvider) {
    redirect('/providers/services');
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <section className="border-b bg-card/40 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Become a Provider
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Create your provider profile and start offering services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <form
            action={createProviderProfile}
            className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-semibold">
                About Your Work
              </label>

              <Textarea
                id="bio"
                name="bio"
                rows={5}
                placeholder="Tell customers about your skills and the services you provide..."
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="text-sm font-semibold">
                Experience (Years)
              </label>

              <Input
                id="experience"
                name="experience"
                type="number"
                min="0"
                max="60"
                placeholder="Example: 5"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Create Provider Profile
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
