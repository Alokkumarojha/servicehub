import { Button } from '@/components/ui/button';

export default function BookingPage() {
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold">Book a Service</h1>

          <p className="mt-2 text-muted-foreground">
            Provide the details below to request a service.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="space-y-8 rounded-xl border p-6">
            {/* Service */}
            <div>
              <label className="text-sm font-medium">Service</label>

              <input
                type="text"
                defaultValue="Electrical Repair"
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Provider */}
            <div>
              <label className="text-sm font-medium">Provider</label>

              <input
                type="text"
                defaultValue="Rahul Kumar"
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium">Preferred Date</label>

              <input
                type="date"
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Time */}
            <div>
              <label className="text-sm font-medium">Preferred Time</label>

              <input
                type="time"
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium">Service Address</label>

              <textarea
                placeholder="Enter your complete address"
                rows={4}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium">Additional Notes</label>

              <textarea
                placeholder="Describe your problem or requirements..."
                rows={4}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button className="w-full">Request Service</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
