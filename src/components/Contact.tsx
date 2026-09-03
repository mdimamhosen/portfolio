import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Send,
  Loader2,
} from "lucide-react";
import { getUserDetails } from "@/utils/userDetails";
import { sendEmail } from "@/lib/email";
import { sendVisitorEvent } from "@/utils/visitorInfo";
import { toast } from "sonner";

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [headingRef.current, subtitleRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const formElements = formRef.current?.querySelectorAll(".form-element");
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
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const userDetails = getUserDetails();

    try {
      await sendEmail({
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        user_details: userDetails,
        to_email: "mimam22.cse@bu.ac.bd", // Fallback/default if template logic requires it
      });

      // Link voluntarily provided contact info to the visitor session
      try {
        await sendVisitorEvent({ name, email });
      } catch (trackError) {
        console.warn("Could not attach contact to visitor session", trackError);
      }

      toast.success("Message sent successfully!", {
        description: "Thank you for reaching out. I will back to you soon.",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.", {
        description: "Please try again or use the email link directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "mimam22.cse@bu.ac.bd",
      href: `mailto:mimam22.cse@bu.ac.bd?body=${encodeURIComponent(getUserDetails())}`,
    },
    {
      icon: Phone,
      label: "Phone / WhatsApp",
      value: "+8801733570761",
      href: `https://wa.me/8801733570761?text=${encodeURIComponent(getUserDetails())}`,
    },
    { icon: MapPin, label: "Location", value: "Barishal Sadar, Bangladesh" },
    {
      icon: LinkIcon,
      label: "Upwork",
      value: "Md Imam H.",
      href: "https://www.upwork.com/freelancers/~01639e45e2f6ee7185",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="section-container h-screen py-12   px-1 sm:px-2 relative overflow-hidden"
    >
      <div className="max-w-none mx-auto content-overlay h-full flex items-center">
        <div className="w-full">
          <p className="text-mono mb-2 opacity-40 text-xs sm:text-sm">
            09 / Contact
          </p>

          <h2
            ref={headingRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4"
          >
            Let's Work Together
          </h2>
          
          <p ref={subtitleRef} className="text-muted-foreground mb-8 md:mb-12 max-w-2xl text-xs sm:text-sm md:text-base">
            Feel free to reach out for project proposals, collaboration opportunities, or just to say hello.
          </p>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {contactInfo.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 md:gap-4 form-element"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.label === "Upwork" ||
                          item.label.includes("WhatsApp")
                            ? "_blank"
                            : undefined
                        }
                        rel="noopener noreferrer"
                        className="text-foreground text-sm md:text-base hover:text-primary transition-colors hover:underline underline-offset-4"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground text-sm md:text-base">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="lg:col-span-3 space-y-4 md:space-y-6 w-full"
            >
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="form-element relative">
                  <Input
                    name="name"
                    placeholder="Name"
                    className="bg-white/5 border-white/10 focus:border-white/30 h-10 md:h-12 transition-all duration-300 text-sm md:text-base"
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={isSubmitting}
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-500 ${focusedField === "name" ? "w-full" : "w-0"}`}
                  />
                </div>
                <div className="form-element relative">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="bg-white/5 border-white/10 focus:border-white/30 h-10 md:h-12 transition-all duration-300 text-sm md:text-base"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={isSubmitting}
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-500 ${focusedField === "email" ? "w-full" : "w-0"}`}
                  />
                </div>
              </div>

              <div className="form-element relative">
                <Input
                  name="subject"
                  placeholder="Subject"
                  className="bg-white/5 border-white/10 focus:border-white/30 h-10 md:h-12 transition-all duration-300 text-sm md:text-base"
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isSubmitting}
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-500 ${focusedField === "subject" ? "w-full" : "w-0"}`}
                />
              </div>

              <div className="form-element relative">
                <Textarea
                  name="message"
                  placeholder="Your message..."
                  rows={4}
                  className="bg-white/5 border-white/10 focus:border-white/30 resize-none transition-all duration-300 text-sm md:text-base"
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isSubmitting}
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-500 ${focusedField === "message" ? "w-full" : "w-0"}`}
                />
              </div>

              <Button
                type="submit"
                className="form-element btn-primary w-full group text-sm md:text-base"
                disabled={isSubmitting}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </span>
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-xs md:text-sm text-muted-foreground/40">
              © {new Date().getFullYear()} Md. Imam Hosen. Crafted with precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
