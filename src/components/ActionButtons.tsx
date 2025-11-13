interface ActionButtonsProps {
  onShowProgress: () => void;
  onShowStatistics: () => void;
  onShowSettings: () => void;
}

export default function ActionButtons({
  onShowProgress,
  onShowStatistics,
  onShowSettings,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
      <button
        type="button"
        onClick={onShowProgress}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="View Progress (Ctrl/Cmd + P)"
      >
        📊 Progress
      </button>
      <button
        type="button"
        onClick={onShowStatistics}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        title="View Statistics (Ctrl/Cmd + S)"
      >
        📈 Statistics
      </button>
      <button
        type="button"
        onClick={onShowSettings}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        title="Settings (Ctrl/Cmd + B)"
      >
        ⚙️ Settings
      </button>
    </div>
  );
}
