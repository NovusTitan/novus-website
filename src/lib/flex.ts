// Novus Flex: the employer pricing model. All public pricing copy lives here so
// it's easy to review and change in one place.
// NOTE: the one-line descriptions of Flex 3 / Flex 6 / Weekly are a first draft;
// confirm the exact terms with Novus before relying on them.

export const flex = {
  name: "Novus Flex",
  feeRange: "12–25% of salary",
  activation: {
    title: "Activation fee",
    body: "One activation fee opens your search. It covers a group of roles opened together, so hiring three electricians doesn't mean three fees.",
  },
  options: [
    { name: "Flex 0", body: "One-time fee when your hire starts." },
    { name: "Flex 3", body: "The fee spread over your hire's first 3 months." },
    { name: "Flex 6", body: "The fee spread over your hire's first 6 months." },
    { name: "Weekly", body: "A weekly-payment agreement while your hire is on the job." },
  ],
};
