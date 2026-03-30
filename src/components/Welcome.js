"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function Welcome({ name, onComplete }) {
  const overlayRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => onComplete?.(),
      });

      timeline
        .fromTo(
          textRef.current,
          { autoAlpha: 0, y: 50 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
        )
        .to({}, { duration: 0.8 })
        .to(textRef.current, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in",
        })
        .to(
          overlayRef.current,
          {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power2.out",
          },
          "-=0.05",
        );

      return () => timeline.kill();
    },
    { scope: overlayRef, dependencies: [onComplete] },
  );

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-999 flex min-h-screen items-center justify-center bg-[#D7D7D7] px-6 text-black"
    >
      <p
        ref={textRef}
        className="font-camood text-center text-4xl font-semibold tracking-[0.04em] text-black sm:text-5xl md:text-6xl"
      >
        Welcome to Taskify, {name}
      </p>
    </div>
  );
}
