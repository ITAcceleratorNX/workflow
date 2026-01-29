export function Header() {
  return (
    <header className="bg-gradient-to-r from-white via-white to-gray-50/50 shadow-md border-b border-gray-200/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#114A65] to-[#B8400E] p-1 shadow-lg transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-lg bg-white flex items-center justify-center">
                <img 
                  src="/app-icon.png" 
                  alt="WorkFlow Icon" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-[#114A65] to-[#B8400E] bg-clip-text text-transparent">
                WorkFlow
              </span>
              <span className="text-xs text-gray-500 -mt-1">Сервисные офисы</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
