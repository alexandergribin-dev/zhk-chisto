import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import NewsAndStats from "@/components/home/NewsAndStats";
import Collections from "@/components/home/Collections";
import HowWeCheck from "@/components/home/HowWeCheck";
import BotCta from "@/components/home/BotCta";
import { useSeo } from "@/hooks/use-seo";

const Index = () => {
  useSeo({
    title: "ЖК.Чисто — новостройки Москвы и МО с проверенной экологией",
    description: "Каталог новостроек Москвы и области с эко-оценкой A–D, розой ветров, надёжностью застройщика и реальной ценой без накруток агрегатора.",
  });
  return (
    <Layout glow>
      <Hero />
      <NewsAndStats />
      <Collections />
      <HowWeCheck />
      <BotCta />
    </Layout>
  );
};

export default Index;