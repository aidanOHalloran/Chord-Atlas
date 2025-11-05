import { useEffect, useState } from "react";
import { ChordTimelineService } from "../../../services/api";
import ChordTimelineViewer from "./ChordTimelineViewer";
import ChordTimelineCreator from "./ChordTimelineCreator";

interface Props {
  songId: number;
}

export default function ChordTimelineSection({ songId }: Props) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!songId) return;
    setLoading(true);
    ChordTimelineService.getBySongId(songId)
      .then(setTimeline)
      .finally(() => setLoading(false));
  }, [songId]);

  if (loading) {
    return (
      <div className="text-gray-500 italic mt-8 animate-pulse">
        Loading chord timeline...
      </div>
    );
  }

  if (!timeline.length) {
    return <ChordTimelineCreator songId={songId} onCreated={setTimeline} />;
  }

  return <ChordTimelineViewer timeline={timeline} />;
}
