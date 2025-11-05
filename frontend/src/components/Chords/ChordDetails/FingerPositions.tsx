interface FingerPositionsProps {
    fingers: (string | number | null)[];
}

export default function FingerPositions({ fingers }: FingerPositionsProps) {
    return (
        <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
            <h4 className="text-lg font-semibold text-blue-200 mb-3 flex items-center">
                <span className="mr-2">✋</span>
                Finger Positions
            </h4>
            <div className="flex flex-wrap gap-2">
                {fingers?.map((rawFinger, index) => {
                    const finger = rawFinger === null ? 0 : Number(rawFinger);
                    return (
                        <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${finger === 0
                                    ? "bg-gray-700 text-gray-300 border border-gray-600"
                                    : "bg-purple-900 text-purple-200 border border-purple-700"
                                }`}
                        >
                            String {index + 1}: {finger === 0 ? "Open" : `Finger ${finger}`}
                        </span>
                    );
                })}
            </div>

        </div>
    );
}
