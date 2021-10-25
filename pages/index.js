import Head from 'next/head';
import {
  HeroSection,
  Layout,
  StatelessDoneRightSection,
  TryRenovationSection,
  TwoStrategiesSection,
} from 'components';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Authentication at the edge | Clerk x Next.js</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <HeroSection />
      <TwoStrategiesSection />
      <StatelessDoneRightSection />
      <TryRenovationSection />
    </Layout>
  );
}
