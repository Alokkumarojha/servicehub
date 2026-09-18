import Link from 'next/link';

import { Button } from '@/components/ui/button';

const provider = {
  name: 'Rahul Kumar',
  service: 'Electrician',
  experience: '5 years',
  location: 'Siwan, Bihar',
  bio: 'Experienced electrician providing reliable electrical installation, repair and maintenance services.',
};

const services = [
  'Electrical Repair',
  'Fan Installation',
  'Switch & Socket Repair',
  'Wiring',
];

export default function ProviderProfilePage() {
  return (
    <main>
      {/* Profile Header */}
      <section className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-muted text-3xl font-bold">
              {provider.name.charAt(0)}
            </div>

            <div>
              <h1 className="text-3xl font-bold">{provider.name}</h1>

              <p className="mt-1 text-lg text-muted-foreground">
                {provider.service}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{provider.experience} experience</span>
                <span>{provider.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details */}
      <section>
        <div className="mx-auto grid max-w-4xl gap-8 px-4 py-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold">About</h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              {provider.bio}
            </p>

            <h2 className="mt-10 text-2xl font-bold">Services Offered</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <div key={service} className="rounded-lg border p-4">
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Card */}
          <div className="h-fit rounded-xl border p-6">
            <h2 className="text-xl font-semibold">Need this service?</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Request a service from this provider.
            </p>

            <Button
              className="mt-6 w-full"
              nativeButton={false}
              render={<Link href="/booking" />}
            >
              Book Service
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
