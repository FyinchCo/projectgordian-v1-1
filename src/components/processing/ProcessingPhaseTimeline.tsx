
interface ProcessingPhaseTimelineProps {}

export const ProcessingPhaseTimeline = ({}: ProcessingPhaseTimelineProps) => {
  return (
    <div className="flex justify-between text-xs text-gray-500">
      <span className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span>Analysis Phase</span>
      </span>
      <span className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        <span>Integration Phase</span>
      </span>
      <span className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Synthesis Phase</span>
      </span>
    </div>
  );
};
