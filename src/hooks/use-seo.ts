import { useEffect } from "react";

type Seo = { title: string; description?: string; canonical?: string; noindex?: boolean; jsonLd?: object | object[] };

const setMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
};

export const useSeo = ({ title, description, canonical, noindex, jsonLd }: Seo) => {
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title;
    if (description) setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = "https://jkchisto.ru" + (canonical ?? window.location.pathname);

    const id = "page-jsonld";
    document.getElementById(id)?.remove();
    if (ld) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = id;
      s.text = ld;
      document.head.appendChild(s);
    }
  }, [title, description, canonical, noindex, ld]);
};