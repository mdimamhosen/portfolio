import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const CameraController = () => {
  const { camera, viewport } = useThree();
  const targetPosition = useRef({ x: 0, y: 0, z: 12 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const mousePosition = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const currentSection = useRef(0);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollProgress.current = Math.min(scrollY / maxScroll, 1);
      
      // Determine current section (0-5)
      const sections = 6;
      const newSection = Math.floor(scrollProgress.current * sections);
      
      // Enhanced camera movement based on scroll sections
      const progress = scrollProgress.current;
      
      // Create cinematic camera path
      if (progress < 0.15) {
        // Hero section - zoom in slowly
        targetPosition.current.z = 12 - progress * 10;
        targetPosition.current.x = 0;
        targetPosition.current.y = 0;
      } else if (progress < 0.3) {
        // About section - pan left
        const sectionProgress = (progress - 0.15) / 0.15;
        targetPosition.current.z = 10 - sectionProgress * 2;
        targetPosition.current.x = -sectionProgress * 4;
        targetPosition.current.y = sectionProgress * 2;
      } else if (progress < 0.45) {
        // Skills section - rotate around
        const sectionProgress = (progress - 0.3) / 0.15;
        targetPosition.current.z = 8 + sectionProgress * 2;
        targetPosition.current.x = -4 + sectionProgress * 6;
        targetPosition.current.y = 2 - sectionProgress * 3;
      } else if (progress < 0.6) {
        // Projects section - pull back for overview
        const sectionProgress = (progress - 0.45) / 0.15;
        targetPosition.current.z = 10 + sectionProgress * 3;
        targetPosition.current.x = 2 - sectionProgress * 2;
        targetPosition.current.y = -1 + sectionProgress * 2;
      } else if (progress < 0.75) {
        // Automation section - dive in
        const sectionProgress = (progress - 0.6) / 0.15;
        targetPosition.current.z = 13 - sectionProgress * 5;
        targetPosition.current.x = 0 - sectionProgress * 3;
        targetPosition.current.y = 1 - sectionProgress * 2;
      } else {
        // Contact section - dramatic pull back
        const sectionProgress = (progress - 0.75) / 0.25;
        targetPosition.current.z = 8 + sectionProgress * 6;
        targetPosition.current.x = -3 + sectionProgress * 3;
        targetPosition.current.y = -1 + sectionProgress * 2;
      }
      
      // Add subtle rotation based on scroll
      targetRotation.current.x = Math.sin(progress * Math.PI * 2) * 0.08;
      targetRotation.current.y = Math.cos(progress * Math.PI) * 0.12;
      
      // Trigger GSAP animation on section change
      if (newSection !== currentSection.current) {
        currentSection.current = newSection;
        gsap.to(camera.position, {
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mousePosition.current.x = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mousePosition.current.y = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    
    // Touch handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current.x = e.touches[0].clientX;
      touchStart.current.y = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = (e.touches[0].clientX - touchStart.current.x) / window.innerWidth;
      const deltaY = (e.touches[0].clientY - touchStart.current.y) / window.innerHeight;
      mousePosition.current.x = deltaX * 0.5;
      mousePosition.current.y = -deltaY * 0.5;
    };
    
    const handleTouchEnd = () => {
      // Smoothly return to center
      gsap.to(mousePosition.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };
    
    // Click effect - subtle camera shake
    const handleClick = () => {
      gsap.to(camera.position, {
        x: camera.position.x + (Math.random() - 0.5) * 0.3,
        y: camera.position.y + (Math.random() - 0.5) * 0.3,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('click', handleClick);
    
    // Initial animation
    gsap.fromTo(camera.position, 
      { z: 20, x: 5, y: 3 },
      { z: 12, x: 0, y: 0, duration: 2.5, ease: "power4.out", delay: 0.5 }
    );
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', checkMobile);
    };
  }, [camera, isMobile]);
  
  useFrame((state) => {
    const lerpFactor = isMobile ? 0.03 : 0.025;
    
    // Smooth camera position transition with mouse parallax
    const mouseInfluence = isMobile ? 0.3 : 1;
    camera.position.x += (targetPosition.current.x + mousePosition.current.x * mouseInfluence - camera.position.x) * lerpFactor;
    camera.position.y += (targetPosition.current.y - mousePosition.current.y * mouseInfluence - camera.position.y) * lerpFactor;
    camera.position.z += (targetPosition.current.z - camera.position.z) * lerpFactor;
    
    // Add subtle floating motion
    const floatX = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    const floatY = Math.cos(state.clock.elapsedTime * 0.4) * 0.1;
    camera.position.x += floatX * 0.01;
    camera.position.y += floatY * 0.01;
    
    // Smooth camera rotation
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.02;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.02;
    
    // Always look towards center but with subtle offset
    const lookTarget = new THREE.Vector3(
      mousePosition.current.x * 0.5,
      -mousePosition.current.y * 0.3,
      0
    );
    camera.lookAt(lookTarget);
  });
  
  return null;
};

export default CameraController;