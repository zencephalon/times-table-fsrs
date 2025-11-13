import StatisticsChart from "@/components/StatisticsChart";
import type { SessionData } from "@/lib/types";

interface StatisticsModalProps {
  sessionData: SessionData;
  isOpen: boolean;
  onClose: () => void;
}

export default function StatisticsModal({
  sessionData,
  isOpen,
  onClose,
}: StatisticsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detailed Statistics
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          <StatisticsChart responses={sessionData.responses} />

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Close Statistics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
