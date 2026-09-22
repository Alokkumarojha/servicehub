'use client';

import { useState } from 'react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

import {
  Zap,
  Wrench,
  Snowflake,
  Hammer,
  GraduationCap,
  Sparkles,
  Search,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const services = [
  {
    title: 'Electrician',
    slug: 'electrical',
    description: 'Electrical installation, repair and maintenance services.',
    icon: Zap,
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    title: 'Plumber',
    slug: 'plumbing',
    description: 'Plumbing repair, installation and maintenance services.',
    icon: Wrench,
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    title: 'AC Repair',
    slug: 'ac-repair',
    description: 'AC servicing, repair and installation services.',
    icon: Snowflake,
    color: 'text-cyan-500 bg-cyan-500/10',
  },
  {
    title: 'Carpenter',
    slug: 'carpenter',
    description: 'Furniture repair, installation and carpentry services.',
    icon: Hammer,
    color: 'text-orange-500 bg-orange-500/10',
  },
  {
    title: 'Tutor',
    slug: 'tutor',
    description: 'Find tutors for different subjects and learning needs.',
    icon: GraduationCap,
    color: 'text-purple-500 bg-purple-500/10',
  },
  {
    title: 'Cleaning',
    slug: 'cleaning',
    description: 'Professional home and office cleaning services.',
    icon: Sparkles,
    color: 'text-emerald-500 bg-emerald-500/10',
  },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Live Client-side filtering
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Hero / Header Section */}
      <section className="border-b bg-card/40 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Explore Services
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Find verified local professionals for all your home repair,
              maintenance, and learning needs.
            </p>

            {/* Search Box */}
            <div className="relative mt-6 flex max-w-md items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services (e.g. Electrician, AC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">
                No services found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.slug}
                    className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      {/* Icon & Title */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${service.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">
                          {service.title}
                        </h2>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-2">
                      <Link
                        href={`/providers?category=${service.slug}`}
                        className={buttonVariants({
                          className:
                            'w-full justify-between group-hover:bg-primary',
                        })}
                      >
                        <span>Find Providers</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
