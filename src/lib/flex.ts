// Novus Flex: the employer pricing model. All public pricing copy lives here so
// it's easy to review and change in one place.
//
// Source: Novus Flex client agreements (forms NF-0, NF-3, NF-6, rev. 11/2026).
// Keep this in sync with the agreements. If they change, update this file.
// Plans offered: Flex 0, Flex 3 and Flex 6 only (no weekly plan for now).

export const flex = {
  name: "Novus Flex",
  activation: {
    title: "$2,000 search activation",
    points: [
      "Opens up to three roles at once.",
      "Credited toward your placement fee when you hire.",
      "Qualified shortlist within 10 business days of your intake call, or your activation fee back.",
      "Pause a search and the fee carries over to a new search within 6 months.",
    ],
  },
  options: [
    {
      name: "Flex 0",
      fee: "18%",
      payment: "Paid once, when your hire starts",
      protection: "Free replacement search if the hire leaves within 90 days",
    },
    {
      name: "Flex 3",
      fee: "20%",
      payment: "3 equal monthly payments",
      protection: "If the hire leaves, payments stop and we run a replacement search at no fee",
    },
    {
      name: "Flex 6",
      fee: "22%",
      payment: "6 equal monthly payments, or pay off early for 20% in total",
      protection: "If the hire leaves, payments stop and we run a replacement search at no fee",
    },
  ],
  feeBasis: "Fees are a percentage of the hire's first-year base salary (not bonus, commission or benefits).",
  fineprint: [
    "$12,000 minimum placement fee on Flex 0, Flex 3 and Flex 6.",
    "Roles over $250,000 base salary are priced separately.",
    "Your signed agreement sets the final terms.",
  ],
};
