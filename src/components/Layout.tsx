import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = ({ children, glow }: { children: ReactNode; glow?: boolean }) => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {glow && <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[900px]" aria-hidden="true" />}
      <Header />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
