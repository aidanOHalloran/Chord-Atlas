// src/components/layout/section-nav/SectionNavContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SectionConfig = {
  id: string;
  label: string;
  ref: React.RefObject<HTMLElement | null>;
  order: number;
};

type SectionNavContextValue = {
  sections: SectionConfig[];
  activeSectionId: string | null;
  registerSection: (config: Omit<SectionConfig, "order">) => void;
  unregisterSection: (id: string) => void;
};

const SectionNavContext = createContext<SectionNavContextValue | null>(null);

export const useSectionNav = () => {
  const ctx = useContext(SectionNavContext);
  if (!ctx) throw new Error("useSectionNav must be used inside provider");
  return ctx;
};

export const SectionNavProvider = ({ children }: { children: React.ReactNode }) => {
  const [sectionsMap, setSectionsMap] = useState<Map<string, SectionConfig>>(
    () => new Map()
  );

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const orderCounter = useRef(0);

  const registerSection = useCallback(
    (config: Omit<SectionConfig, "order">) => {
      setSectionsMap((prev) => {
        if (prev.has(config.id)) return prev;
        const next = new Map(prev);
        next.set(config.id, { ...config, order: orderCounter.current++ });
        return next;
      });
    },
    []
  );

  const unregisterSection = useCallback((id: string) => {
    setSectionsMap((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const sections = useMemo(
    () => Array.from(sectionsMap.values()).sort((a, b) => a.order - b.order),
    [sectionsMap]
  );

  // Scroll spy
  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop
          );

        if (visible.length) {
          const id = visible[0].target.getAttribute("data-section-id");
          if (id) setActiveSectionId(id);
        }
      },
      { threshold: 0.25 }
    );

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.setAttribute("data-section-id", id);
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const value = useMemo(
    () => ({
      sections,
      activeSectionId,
      registerSection,
      unregisterSection,
    }),
    [sections, activeSectionId, registerSection, unregisterSection]
  );

  return (
    <SectionNavContext.Provider value={value}>
      {children}
    </SectionNavContext.Provider>
  );
};
