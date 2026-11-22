import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call Novus Talent Company at ${site.phone.display} or visit us in Tampa, FL.`,
};

export default function ContactPage() {
  const { address, phone } = site;
  const mapQuery = encodeURIComponent(`${address.street}, ${address.city}, ${address.region} ${address.postal}`);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <h1 className="text-4xl font-bold leading-tight md:text-5xl">Contact us</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Looking for work or looking to hire? Call us and you&apos;ll talk to a real recruiter.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-sand p-6 md:p-8">
          <h2 className="text-xl font-bold">Call</h2>
          <p className="mt-2 text-2xl font-semibold">{phone.display}</p>
          <ButtonLink href={`tel:${phone.tel}`} className="mt-6 w-full sm:w-auto">
            Call now
          </ButtonLink>
        </div>
        <div className="rounded-lg bg-sand p-6 md:p-8">
          <h2 className="text-xl font-bold">Visit</h2>
          <address className="mt-2 text-lg not-italic">
            {address.street}
            <br />
            {address.city}, {address.region} {address.postal}
          </address>
          <ButtonLink
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            variant="outline"
            className="mt-6 w-full sm:w-auto"
          >
            Get directions
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
