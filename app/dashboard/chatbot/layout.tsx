



export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
    return   ( <div className="p-6 space-y-8">
    <div className="mb-8 space-y-2">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
        Chatbot
      </h2>
      <p className="text-muted-foreground text-lg">
        Create and manage your Instagram chatbot responses
      </p>
    </div>
    {children}
    </div> )
  }