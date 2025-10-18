interface Props {
  autoAssign: boolean;
  onToggle: () => void;
}

export default function AutoAssignToggle({ autoAssign, onToggle }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <label className="text-sm text-gray-300 font-medium">Auto Assign Fingers:</label>
      <input
        type="checkbox"
        checked={autoAssign}
        onChange={onToggle}
        className="w-4 h-4 accent-blue-600"
      />
    </div>
  );
}
