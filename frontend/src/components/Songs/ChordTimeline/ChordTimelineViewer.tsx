interface Props {
  timeline: { chord_name: string; start_time: number; end_time: number }[];
}

export default function ChordTimelineViewer({ timeline }: Props) {
  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mt-8">
      <h3 className="text-2xl font-semibold text-blue-300 mb-4">
        Chord Timeline
      </h3>

      <div className="space-y-2">
        {timeline.map((entry, idx) => (
          <div
            key={idx}
            className="flex justify-between text-gray-300 bg-neutral-800 rounded-lg px-3 py-2"
          >
            <span className="font-mono text-lg text-blue-400">
              {entry.chord_name}
            </span>
            <span className="text-sm text-gray-500">
              {entry.start_time.toFixed(2)}s – {entry.end_time.toFixed(2)}s
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
