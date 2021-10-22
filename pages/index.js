import Hero from "../page-sections/hero";
import TryIt from "../page-sections/try-it";
import HowItWorks from "../page-sections/how-it-works";
import TryRevocation from "../page-sections/try-revocation";

export default function Home() {
  return (
    <>
      <Hero />
      <TryIt />
      <HowItWorks />
      <TryRevocation />
    </>
  );
}
