export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-12 max-w-md w-full text-center">
        {/* Logo/Title */}
        <img src="/dinacom.png" alt="Dinacom Logo" className="w-32 mx-auto mb-6" />
        
        {/* 404 Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col gap-3 mr-4">
            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          </div>
          <div className="w-3 h-32 bg-gray-400 transform -skew-x-12"></div>
        </div>
        
        {/* Not Found Text */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Not Found
        </h2>
      </div>
    </div>
  );
}