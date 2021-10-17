import "tailwindcss/tailwind.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider authVersion={2}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
