import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// Master timeline defaults
export const timelineDefaults = {
  ease: "power4.out",
  duration: 1.2,
};

// Create section timeline with ScrollTrigger
export const createSectionTimeline = (
  trigger: string | Element,
  options?: ScrollTrigger.Vars
) => {
  return gsap.timeline({
    defaults: timelineDefaults,
    scrollTrigger: {
      trigger,
      start: "top center",
      end: "bottom center",
      toggleActions: "play none none reverse",
      ...options,
    },
  });
};

// Stagger reveal animation
export const staggerReveal = (
  elements: string | Element | Element[],
  options?: gsap.TweenVars
) => {
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      ...options,
    }
  );
};

// Text split and reveal
export const textReveal = (
  element: string | Element,
  options?: gsap.TweenVars
) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 100,
      rotateX: -45,
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1.4,
      ease: "expo.out",
      ...options,
    }
  );
};

// Camera dolly effect (for 3D scenes)
export const cameraDolly = (
  cameraRef: { position: { z: number } },
  startZ: number,
  endZ: number,
  duration: number = 2
) => {
  return gsap.fromTo(
    cameraRef.position,
    { z: startZ },
    { z: endZ, duration, ease: "power2.inOut" }
  );
};

// Magnetic hover effect
export const createMagneticEffect = (element: HTMLElement, strength: number = 0.3) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// Parallax effect
export const createParallax = (
  element: string | Element,
  speed: number = 0.5
) => {
  return gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
};

// Horizontal scroll
export const createHorizontalScroll = (
  container: string | Element,
  wrapper: string | Element
) => {
  const sections = gsap.utils.toArray(`${wrapper} > *`);
  
  return gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => "+=" + (document.querySelector(wrapper as string) as HTMLElement)?.offsetWidth,
    },
  });
};
