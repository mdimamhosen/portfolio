import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link as LinkIcon, Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const formElements = formRef.current?.querySelectorAll('.form-element');
      if (formElements) {
        gsap.fromTo(
          formElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div
      ref={sectionRef}
      className="section-container h-screen py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto content-overlay h-full flex items-center">
        <div className="w-full">
          <p className="text-mono mb-4 md:mb-6 opacity-40 text-xs sm:text-sm">09 / Contact</p>

          <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12">
            Let's Work Together
          </h2>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {[
                { icon: Mail, label: 'Email', value: 'mimam22.cse@bu.ac.bd' },
                { icon: Phone, label: 'Phone', value: '+8801799532172' },
                { icon: MapPin, label: 'Location', value: 'Barishal Sadar, Bangladesh' },
                {
                  icon: LinkIcon,
                  label: 'Upwork',
                  value: (
                    <a
                      href="https://www.upwork.com/freelancers/~01639e45e2f6ee7185"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
                    >
                      Md Imam H.
                    </a>
                  ),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4 form-element">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-foreground text-sm md:text-base">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="lg:col-span-3 space-y-4 md:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="form-element relative">
                  <Input
                    placeholder="Name"
                    className="bg-white/5 border-white/10 focus:border-white/30 h-10 md:h-12 transition-all duration-300 text-sm md:text-base"
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <div className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-500 ${focusedField === 'name' ? 'w-full' : 'w-0'}`} />
                </div>
                <div className="form-element relative">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-white/5 border-white/10 focus:border-white/30 h-10 md:h-12 transition-all duration-300 text-sm md:text-base"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <div className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-500 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                </div>
              </div>
              
              <div className="form-element relative">
                <Input
                  placeholder="Subject"
                  className="bg-white/5 border-white/10 focus:border-white/30 h-10 md:h-12 transition-all duration-300 text-sm md:text-base"
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                />
                <div className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-500 ${focusedField === 'subject' ? 'w-full' : 'w-0'}`} />
              </div>
              
              <div className="form-element relative">
                <Textarea
                  placeholder="Your message..."
                  rows={4}
                  className="bg-white/5 border-white/10 focus:border-white/30 resize-none transition-all duration-300 text-sm md:text-base"
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                />
                <div className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-500 ${focusedField === 'message' ? 'w-full' : 'w-0'}`} />
              </div>

              <Button
                type="submit"
                className="form-element btn-primary w-full group text-sm md:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  Send Message
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-xs md:text-sm text-muted-foreground/40">
              © 2024 Md. Imam Hosen. Crafted with precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
