import { Loader2 } from 'lucide-react'

export default function InstagramAuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Authenticating with Instagram</h1>
        <p className="text-gray-600">Please wait while we complete the process...</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Exchanging token</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Storing credentials</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Finalizing setup</span>
          </div>
        </div>
      </div>
    </div>
  )
}

