import BookingScheduler from "@/components/services/BookingScheduler";
import { Calendar } from "lucide-react";

export const metadata = {
  title: "Book Digital Services | Gilded Sharma",
  description: "Schedule a consultation with Kundan Kumar Sharma for Web Development, Mobile Apps, or Digital Marketing.",
};

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>1-on-1 Consultation</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Let&apos;s Build Your Next <span className="text-amber-400">Digital Product</span>
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          Book a discovery session for custom React/Next.js websites, mobile applications, or targeted digital marketing strategies.
        </p>
      </div>

      <BookingScheduler />
    </section>
  );
};