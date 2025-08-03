// Header.tsx
export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center space-x-4">
            <img
              src="/International_Monetary_Fund_logo.svg"
              alt="IMF Logo"
              className="w-10 h-10 object-contain bg-white p-1 rounded-lg shadow-md"
              loading="lazy"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white tracking-tight">
                IMF Data Visualizer
              </h1>
              <p className="text-xs text-blue-200 font-medium">
                International Monetary Fund
              </p>
            </div>
          </div>

          {/* Subtítulo responsivo */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-white">
              Economic Data Platform
            </span>
            <span className="text-xs text-blue-200">
              Real-time Global Insights
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
