'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin,
  Building,
  LandPlot,
  Hash,
  Tag,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !label.trim() ||
      !addressLine.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      toast.add({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await createAddress({
        label,
        addressLine,
        city,
        state,
        pincode,
      });

      toast.add({
        title: 'Address Saved',
        description: 'Your new address has been added successfully.',
      });

      // Clear fields
      setLabel('');
      setAddressLine('');
      setCity('');
      setState('');
      setPincode('');

      // Redirect if returnTo query parameter is provided
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push('/booking');
      }
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to save address. Please try again.',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Header */}
      <section className="border-b bg-card/40 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {returnTo && (
            <Link
              href={returnTo}
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className:
                  'mb-4 gap-1.5 text-xs text-muted-foreground hover:text-foreground',
              })}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Booking
            </Link>
          )}

          <h1 className="text-3xl font-extrabold tracking-tight">
            Add New Address
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Save a location where you want your service providers to visit.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="pt-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
          >
            {/* Label Field */}
            <div className="space-y-2">
              <label
                htmlFor="label"
                className="text-sm font-semibold text-foreground flex items-center gap-1.5"
              >
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>Address Label</span>
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Home, Office, Parent's House"
                required
                disabled={isSubmitting}
                className="h-11"
              />
            </div>

            {/* Address Line Field */}
            <div className="space-y-2">
              <label
                htmlFor="addressLine"
                className="text-sm font-semibold text-foreground flex items-center gap-1.5"
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Street / Flat / Area Details</span>
                <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="addressLine"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Flat No., House/Building Name, Street, Landmark"
                rows={3}
                required
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            {/* City & State Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>City</span>
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Siwan"
                  required
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <LandPlot className="h-4 w-4 text-muted-foreground" />
                  <span>State</span>
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Bihar"
                  required
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>
            </div>

            {/* Pincode Field */}
            <div className="space-y-2">
              <label
                htmlFor="pincode"
                className="text-sm font-semibold text-foreground flex items-center gap-1.5"
              >
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span>Pincode / Postal Code</span>
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="841226"
                maxLength={6}
                required
                disabled={isSubmitting}
                className="h-11"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full text-base font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Address...
                </>
              ) : (
                'Save Address'
              )}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
