import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import LogoIcon from './LogoIcon';
import { X, Home, User, Briefcase, Code, Layers, Bot, Globe, Mail, Rocket } from 'lucide-react';

const navItems = [
  { label: "About", href: "#about", icon: User },
  { label: "CoHost", href: "#cohost", icon: Rocket },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Skills", href: "#skills", icon: Code },
  { label: "Projects", href: "#projects", icon: Layers },
  { label: "AI Agents", href: "#ai-agents", icon: Bot },
  { label: "Web Apps", href: "#web-apps", icon: Globe },
  { label: "Contact", href: "#contact", icon: Mail },
];

const Navigation = () => {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.15 }
    );

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const sections = navItems.map((item) =>
        document.querySelector(item.href)
      );
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach((section, i) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          const offsetBottom = offsetTop + rect.height;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(navItems[i].href);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate mobile menu
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      // Animate menu sliding in from right
      gsap.fromTo(
        mobileMenuRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.4, ease: "power3.out" }
      );

      // Stagger animate menu items
      gsap.fromTo(
        menuItemsRef.current.filter(Boolean),
        { x: 50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.08, 
          delay: 0.2,
          ease: "back.out(1.5)" 
        }
      );
    }
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => setMobileMenuOpen(false)
      });
    } else {
      setMobileMenuOpen(false);
    }
  };

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    closeMobileMenu();
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-3 md:py-4 backdrop-blur-xl bg-background/80 border-b border-border/50"
            : "py-4 md:py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <LogoIcon className="w-8 h-8 md:w-10 md:h-10 text-foreground" />
          </a>

          {/* Nav links - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.href);
                }}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  activeSection === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
                    activeSection === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#contact");
            }}
            className="hidden lg:block px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            Get in Touch
          </a>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 relative z-50"
            aria-label="Open menu"
          >
            <span className="w-6 h-0.5 bg-foreground transition-all duration-300" />
            <span className="w-6 h-0.5 bg-foreground transition-all duration-300" />
            <span className="w-4 h-0.5 bg-foreground transition-all duration-300 self-end mr-2" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Slide-in Menu */}
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] z-50 lg:hidden bg-background/95 backdrop-blur-xl border-l border-border/30 shadow-2xl"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/20">
              <div className="flex items-center gap-2">
                <LogoIcon className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold">Menu</span>
              </div>
              <button 
                onClick={closeMobileMenu}
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col p-4 gap-1">
              {/* Home link */}
              <a
                ref={(el) => (menuItemsRef.current[0] = el)}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  closeMobileMenu();
                }}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <Home className="w-5 h-5" />
                </div>
                <span className="font-medium">Home</span>
              </a>

              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  ref={(el) => (menuItemsRef.current[index + 1] = el)}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.href);
                  }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    activeSection === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    activeSection === item.href 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.href && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="absolute bottom-8 left-4 right-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#contact");
                }}
                className="flex items-center justify-center gap-2 w-full py-4 text-base font-medium bg-primary text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Get in Touch
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;
