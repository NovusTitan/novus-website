// Novus Transition (outplacement). Public copy for /outplacement.
// Source: Novus Transition Outplacement Services Agreement (form NT-1, rev. 11/2026).
// Keep this in sync with the agreement.

export const transition = {
  name: "Novus Transition",
  packages: [
    {
      name: "Field",
      price: "$750",
      length: "60 days",
      includes: ["Résumé", "Job-search workshop", "Introductions to Novus clients that are hiring"],
    },
    {
      name: "Professional",
      price: "$2,000",
      length: "90 days",
      includes: ["Everything in Field", "One-on-one coaching", "Interview preparation", "LinkedIn profile"],
    },
    {
      name: "Leadership",
      price: "$5,000",
      length: "6 months",
      includes: ["Everything in Professional", "A dedicated coach", "Unlimited sessions", "Target-company search plan"],
    },
  ],
  steps: [
    {
      title: "Tell us who and which package",
      body: "Choose a package for each person. You only pay for the people who enroll.",
    },
    {
      title: "They enroll",
      body: "Each person enrolls within 30 days of your notice. Their support starts the day they enroll.",
    },
    {
      title: "We help them land",
      body: "We coach them and introduce them to Novus clients that are hiring. You get updates on enrollment and who has landed.",
    },
  ],
  credit:
    "If Novus places someone with one of our hiring clients during their service period, we credit you 50% of their package fee toward any Novus invoice in the next 12 months.",
  promises: [
    "Each person decides whether to pursue any role we introduce.",
    "We share a person's new employer with you only with their consent.",
    "We won't use anything from this work to recruit your current employees.",
  ],
  fineprint: [
    "Prices are per person. Billed monthly for that month's enrollments.",
    "No one can guarantee a new job by a certain date, and we don't.",
    "Your signed agreement sets the final terms.",
  ],
};
