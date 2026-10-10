export default function Loading() {
  return (
    <main className="min-h-screen bg-background pb-16" aria-busy="true">
      <section className="border-b bg-card/40 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Book a Service</h1>
          <p role="status" className="mt-1.5 text-sm text-muted-foreground">Loading service details and saved addresses…</p>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6" aria-hidden="true">
        <div className="space-y-8 rounded-2xl border bg-card p-6 sm:p-8">
          <div className="h-16 rounded-lg bg-muted" />
          <div className="grid gap-6 sm:grid-cols-2"><div className="h-16 rounded-lg bg-muted" /><div className="h-16 rounded-lg bg-muted" /></div>
          <div className="h-36 rounded-lg bg-muted" />
          <div className="h-28 rounded-lg bg-muted" />
          <div className="h-12 rounded-lg bg-muted" />
        </div>
      </div>
    </main>
  );
}
