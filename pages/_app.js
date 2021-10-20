import "tailwindcss/tailwind.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ClerkProvider, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider authVersion={2}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
