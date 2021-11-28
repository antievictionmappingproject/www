import PicoSanity from "picosanity";

export const client = new PicoSanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2021-11-28",
  useCdn: true,
});
