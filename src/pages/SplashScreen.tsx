export default function SplashScreen() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 gap-y-4">
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
        BreezeChess is currently down. Please check back in at another time.
      </h1>
      <h2 className="text-xl text-gray-700 dark:text-white">Sorry for the inconvenience!</h2>
    </div>
  );
}
