// src/components/layout/section-nav/SectionNavBar.tsx

import { useSectionNav } from "./SectionNavContext";

type Props = {
  offsetPx?: number;  // distance from top for sticking
  position?: "top" | "bottom";
};

export const SectionNavBar = ({
  offsetPx = 72,
  position = "top",
}: Props) => {
  const { sections, activeSectionId } = useSectionNav();

  if (!sections.length) return null;

  const fixedClass =
    position === "top"
      ? `fixed top-[${offsetPx}px] left-0 right-0`
      : `fixed bottom-[${offsetPx}px] left-0 right-0`;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`${fixedClass} z-30 mb-4`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-2 backdrop-blur">
          <span className="mr-2 text-xs uppercase tracking-wide text-neutral-400">
            On this page
          </span>

          {sections.map((s) => {
            const active = s.id === activeSectionId;

            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }
                `}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
