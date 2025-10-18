interface Props {
  finger: number | null;
  onSelect: (num: number | null) => void;
}

export default function FingerPopup({ finger, onSelect }: Props) {
  return (
    <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-md shadow-md z-10 flex">
      {[1, 2, 3, 4].map(num => (
        <button
          key={num}
          onClick={() => onSelect(num)}
          className={`px-2 py-1 text-sm hover:bg-blue-600 hover:text-white ${finger === num ? "bg-blue-700 text-white" : "text-gray-300"}`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onSelect(null)}
        className="px-2 py-1 text-sm text-gray-400 hover:bg-red-600 hover:text-white"
        title="Clear"
      >
        ×
      </button>
    </div>
  );
}
