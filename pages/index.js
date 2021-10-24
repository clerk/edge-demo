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
      <HeroSection />
      <TwoStrategiesSection />
      <StatelessDoneRightSection />
      <TryRenovationSection />
    </Layout>
  );
}
