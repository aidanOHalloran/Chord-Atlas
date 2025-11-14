import React from 'react'
import type { Chord } from '../../../types/models'

const ChordProgressionOrderLabel = ({ chords = [] as Chord[] }) => {
  return (
    <>
    {chords.length > 0 && (
        <div className="mt-1 text-xs text-gray-400 font-mono">
          Order:{" "}
          <span className="text-blue-400">
            {chords.map((chord) => chord.name).join(" → ")}
          </span>
        </div>
      )}
    </>
  )
}

export default ChordProgressionOrderLabel