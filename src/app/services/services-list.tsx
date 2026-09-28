'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Wrench } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ServicesListProps = {
  categories: Category[];
};

export default function ServicesList({ categories }: ServicesListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              Find verified local professionals for all your service needs.
            </p>

            <div className="relative mt-6 flex max-w-md items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />

              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">
                No services found matching &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Wrench className="h-5 w-5" />
                      </div>

                      <h2 className="text-xl font-bold tracking-tight">
                        {category.name}
                      </h2>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Find trusted {category.name.toLowerCase()} professionals
                      near you.
                    </p>
                  </div>

                  <div className="mt-6 pt-2">
                    <Link
                      href={`/providers?category=${category.slug}`}
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
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
