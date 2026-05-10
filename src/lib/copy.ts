export const copy = {
  brand: "Prayer Wall",

  request: {
    heading: "What is your prayer request?",
    placeholder: "Share whatever is on your heart.",
    intro:
      "Please join us as we pray for our whole church, including you.",
    body: "“Prayer is the Christian’s greatest weapon.” - Billy Graham",
    verse:
      "“And they devoted themselves to the apostles’ teaching and the fellowship, to the breaking of bread and the prayers.”",
    verseRef: "Acts 2:42",
    cta: "Continue",
  },

  name: {
    heading: "What is your name?",
    placeholder: "First name is fine",
    body: "We would love to pray for you by name.",
    back: "Back",
    cta: "Submit",
  },

  thanks: {
    heading: (name: string) => `Thank you, ${name}.`,
    body: "Your request has been received. The church is praying with you.",
    verse: "“Pray continually.”",
    verseRef: "1 Thessalonians 5:17",
  },

  qr: {
    heading: "What is your prayer request?",
    intro:
      "Please join us as we pray for our whole church, including you.",
    body: "“Prayer is the Christian’s greatest weapon.” - Billy Graham",
    verse:
      "“And they devoted themselves to the apostles’ teaching and the fellowship, to the breaking of bread and the prayers.”",
    verseRef: "Acts 2:42",
    scan: "Scan to share a prayer request",
  },
};
