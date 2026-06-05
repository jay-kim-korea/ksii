"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

// IntersectionObserver 기반 페이드인-업 래퍼.
// 뷰포트 진입 시 1회만 트리거되고, 이후 unobserve.
export function SectionReveal({
  children,
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            const t = setTimeout(() => setVisible(true), delay);
            return () => clearTimeout(t);
          }
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -64px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${visible ? "reveal-visible" : "reveal-hidden"} ${className}`}
    >
      {children}
    </div>
  );
}
