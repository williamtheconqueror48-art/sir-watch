import HomeClient from "./home-client";

/**
 * SIR-WATCH home — server shell rendering the live client views.
 * All data arrives at runtime from /api/* (Neon). No static demo content.
 */
export default function Home() {
  return <HomeClient />;
}
