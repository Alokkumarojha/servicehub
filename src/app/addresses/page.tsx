'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { createAddress } from './actions';

export default function AddressesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const [label, setLabel] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const address = await createAddress({
        label,
        addressLine,
        city,
        state,
        pincode,
      });
      toast.add({
        title: 'Address Created',
        description: 'Your address has been created successfully.',
      });

      setLabel('');
      setAddressLine('');
      setCity('');
      setState('');
      setPincode('');

      console.log('Address created:', address);

      if (returnTo === '/booking') {
        router.push('/booking');
      }
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to create address.',
      });
      console.error(error);
    }
  }
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold">Add Address</h1>

          <p className="mt-2 text-muted-foreground">
            Add an address where you want to receive services.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border p-6"
          >
            <div>
              <label className="text-sm font-medium">Label</label>

              <input
                type="text"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Home"
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>

              <textarea
                value={addressLine}
                onChange={(event) => setAddressLine(event.target.value)}
                placeholder="Enter your complete address"
                rows={4}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">City</label>

                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Siwan"
                  className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium">State</label>

                <input
                  type="text"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  placeholder="Bihar"
                  className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Pincode</label>

              <input
                type="text"
                value={pincode}
                onChange={(event) => setPincode(event.target.value)}
                placeholder="841226"
                maxLength={6}
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button type="submit" className="w-full">
              Save Address
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
