// src/components/layout/section-nav/Section.tsx

import React, { useEffect, useRef } from "react";
import { useSectionNav } from "./SectionNavContext";

type Props = {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
};

export const Section = ({ id, label, className = "", children }: Props) => {
  const ref = useRef<HTMLElement | null>(null);
  const { registerSection, unregisterSection } = useSectionNav();

  useEffect(() => {
    registerSection({ id, label, ref });
    return () => unregisterSection(id);
  }, [id, label, registerSection, unregisterSection]);

  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-mt-24 ${className}`}
    >
      {children}
    </section>
  );
};
