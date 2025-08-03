// src/components/layout/Sidebar.jsx
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export const Sidebar = ({ children, className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(false); // Reset collapsed state on mobile
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Fechar sidebar mobile ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isMobileOpen && !event.target.closest('[data-sidebar]')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileOpen]);

  const toggleCollapsed = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Mobile: Botão de toggle no header/main
  const MobileToggle = () => (
    <button
      onClick={toggleMobile}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
      aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
    >
      {isMobileOpen ? (
        <XMarkIcon className="h-5 w-5 text-gray-600" />
      ) : (
        <Bars3Icon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );

  // Overlay para mobile
  const MobileOverlay = () => (
    isMobile && isMobileOpen && (
      <div 
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
        onClick={() => setIsMobileOpen(false)}
      />
    )
  );

  const sidebarClasses = `
    ${isMobile 
      ? `fixed left-0 top-0 h-full z-40 transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }` 
      : `relative transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'}`
    }
    bg-white border-r border-gray-200 shadow-sm flex flex-col
    ${className}
  `;

  return (
    <>
      <MobileToggle />
      <MobileOverlay />
      
      <aside 
        className={sidebarClasses}
        data-sidebar
        style={isMobile ? { width: '320px' } : undefined}
      >
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-900">Métricas de visualização</h2>
            </div>
          )}
          
          {!isMobile && (
            <button
              onClick={toggleCollapsed}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" />
              )}
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fechar menu"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Conteúdo da Sidebar */}
        <div className="flex-1 overflow-y-auto">
          {(!isCollapsed || isMobile) && (
            <div className="p-4 space-y-6">
              {children}
            </div>
          )}
          
          {isCollapsed && !isMobile && (
            <div className="p-2 space-y-4">
              {/* Ícones colapsados - você pode personalizar conforme necessário */}
              <div className="flex flex-col items-center space-y-3 pt-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-600">📊</span>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-600">🌍</span>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-600">📅</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};