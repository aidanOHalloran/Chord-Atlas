interface FretPositionsProps {
    frets: (string | number | null)[];
}

export default function FretPositions({ frets }: FretPositionsProps) {
    return (
        <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
            <h4 className="text-lg font-semibold text-blue-200 mb-3 flex items-center">
                <span className="mr-2">📍</span>
                Fret Positions
            </h4>
            <div className="flex flex-wrap gap-2">
                {frets?.map((fret, index) => (
                    <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${fret === -1
                                ? "bg-red-900 text-red-200 border border-red-700"
                                : fret === 0
                                    ? "bg-green-900 text-green-200 border border-green-700"
                                    : "bg-blue-900 text-blue-200 border border-blue-700"
                            }`}
                    >
                        String {index + 1}: {fret === -1 ? "X" : fret === 0 ? "Open" : `Fret ${fret}`}
                    </span>
                ))}
            </div>

        </div>
    );
}
