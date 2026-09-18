import Link from 'next/link';

import { Button } from '@/components/ui/button';

const providers = [
  {
    name: 'Rahul Kumar',
    service: 'Electrician',
    experience: '5 years',
    location: 'Siwan, Bihar',
  },
  {
    name: 'Amit Sharma',
    service: 'Plumber',
    experience: '7 years',
    location: 'Mairwa, Bihar',
  },
  {
    name: 'Ravi Kumar',
    service: 'AC Repair',
    experience: '4 years',
    location: 'Siwan, Bihar',
  },
  {
    name: 'Sanjay Singh',
    service: 'Carpenter',
    experience: '8 years',
    location: 'Mairwa, Bihar',
  },
  {
    name: 'Priya Singh',
    service: 'Tutor',
    experience: '6 years',
    location: 'Siwan, Bihar',
  },
  {
    name: 'Manoj Kumar',
    service: 'Cleaning',
    experience: '3 years',
    location: 'Mairwa, Bihar',
  },
];

export default function ProvidersPage() {
  return (
    <main>
      {/* Page Header */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-4xl font-bold">Find Providers</h1>

          <p className="mt-2 text-muted-foreground">
            Find trusted professionals for your service needs.
          </p>

          {/* Search */}
          <div className="mt-8 flex max-w-2xl gap-3">
            <input
              type="text"
              placeholder="Search providers or services..."
              className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <Button>Search</Button>
          </div>
        </div>
      </section>

      {/* Provider List */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="rounded-xl border p-6 transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-semibold">
                    {provider.name.charAt(0)}
                  </div>

                  <div>
                    <h2 className="font-semibold">{provider.name}</h2>

                    <p className="text-sm text-muted-foreground">
                      {provider.service}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Experience:</span>{' '}
                    {provider.experience}
                  </p>

                  <p>
                    <span className="font-medium">Location:</span>{' '}
                    {provider.location}
                  </p>
                </div>

                <Button
                  className="mt-6 w-full"
                  nativeButton={false}
                  render={<Link href="/providers/profile" />}
                >
                  View Profile
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
