export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-lg text-gray-900 dark:text-white">
          Loading cards...
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Initializing your practice session
        </div>
      </div>
    </div>
  );
}
