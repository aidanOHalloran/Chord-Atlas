interface StringNotesProps {
  tips: string[];
}

export default function StringNotes({ tips }: StringNotesProps) {
  return (
    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
      <h4 className="text-lg font-semibold text-blue-200 mb-3 flex items-center">
        <span className="mr-2">💡</span>
        String Notes
      </h4>
      <div className="flex flex-wrap gap-2">
        {tips.map((tip, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-indigo-900 text-indigo-200 rounded-full text-sm font-medium border border-indigo-700"
          >
            {tip}
          </span>
        ))}
      </div>
    </div>
  );
}
