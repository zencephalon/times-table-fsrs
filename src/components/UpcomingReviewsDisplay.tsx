interface UpcomingReviewsDisplayProps {
  upcomingReviews: number[];
}

export default function UpcomingReviewsDisplay({
  upcomingReviews,
}: UpcomingReviewsDisplayProps) {
  if (upcomingReviews.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Upcoming Reviews
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 text-center text-sm">
        {upcomingReviews.slice(0, 7).map((count, index) => {
          const date = new Date();
          date.setDate(date.getDate() + index);
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          const dayNumber = date.getDate();
          const dayKey = `day-${index}-${dayNumber}`;

          return (
            <div
              key={dayKey}
              className="p-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div className="font-semibold text-gray-900 dark:text-white">
                {index === 0 ? "Today" : dayName}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {dayNumber}
              </div>
              <div
                className={`text-lg font-bold ${
                  count > 0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
