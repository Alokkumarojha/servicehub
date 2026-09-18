import Link from 'next/link';

import { Button } from '@/components/ui/button';

const services = [
  'Electrician',
  'Plumber',
  'AC Repair',
  'Carpenter',
  'Tutor',
  'Cleaning',
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find Trusted Local Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find skilled professionals for your everyday needs, all in one
            place.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="What service do you need?"
              className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <Button>Search Services</Button>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Popular Services</h2>

            <p className="mt-2 text-muted-foreground">
              Find the right professional for your needs.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service}
                href="/services"
                className="rounded-lg border p-6 transition-colors hover:bg-muted"
              >
                <h3 className="font-semibold">{service}</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Find trusted {service.toLowerCase()} professionals.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold">How ServiceHub Works</h2>

            <p className="mt-2 text-muted-foreground">
              Getting a service is simple.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">1</div>
              <h3 className="mt-3 font-semibold">Search</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Find the service you need.
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold">2</div>
              <h3 className="mt-3 font-semibold">Book</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a professional and request a service.
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <h3 className="mt-3 font-semibold">Get Service</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get your work done by the professional.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
