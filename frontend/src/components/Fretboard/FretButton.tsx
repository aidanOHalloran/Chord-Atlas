interface Props {
  active: boolean;
  fretNum: number;
  finger: number | null;
  onClick: () => void;
}

export default function FretButton({ active, fretNum, finger, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer mb-1 transition
        ${active
          ? "bg-blue-600 border-blue-400 text-white"
          : "bg-neutral-800 border-neutral-700 hover:border-blue-500 text-gray-300"
        }`}
    >
      {active ? (finger ?? fretNum) : ""}
    </div>
  );
}
