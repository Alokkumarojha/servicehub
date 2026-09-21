import Link from 'next/link';

import { Button } from '@/components/ui/button';

const services = [
  {
    title: 'Electrician',
    slug: 'electrical',
    description: 'Electrical installation, repair and maintenance services.',
  },
  {
    title: 'Plumber',
    slug: 'plumbing',
    description: 'Plumbing repair, installation and maintenance services.',
  },
  {
    title: 'AC Repair',
    slug: 'ac-repair',
    description: 'AC servicing, repair and installation services.',
  },
  {
    title: 'Carpenter',
    slug: 'carpenter',
    description: 'Furniture repair, installation and carpentry services.',
  },
  {
    title: 'Tutor',
    slug: 'tutor',
    description: 'Find tutors for different subjects and learning needs.',
  },
  {
    title: 'Cleaning',
    slug: 'cleaning',
    description: 'Professional home and office cleaning services.',
  },
];

export default function ServicesPage() {
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-4xl font-bold">Services</h1>

          <p className="mt-2 text-muted-foreground">
            Find the right professional service for your needs.
          </p>

          <div className="mt-8 flex max-w-2xl gap-3">
            <input
              type="text"
              placeholder="Search services..."
              className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <Button>Search</Button>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="rounded-xl border p-6 transition-colors hover:bg-muted"
              >
                <h2 className="text-xl font-semibold">{service.title}</h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {service.description}
                </p>

                <Button
                  className="mt-6"
                  nativeButton={false}
                  render={<Link href={`/providers?category=${service.slug}`} />}
                >
                  Find Providers
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
