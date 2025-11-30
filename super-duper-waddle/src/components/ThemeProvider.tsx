import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useThemeSettings } from '@/hooks/useThemeSettings';

interface ThemeContextType {
  primaryColor: string;
  showCharts: boolean;
  refreshInterval: number;
  defaultViewMode: 'grid' | 'table';
}

const ThemeContext = createContext<ThemeContextType>({
  primaryColor: 'blue',
  showCharts: true,
  refreshInterval: 5,
  defaultViewMode: 'grid',
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings } = useThemeSettings();

  // Apply CSS custom properties for dynamic theming
  useEffect(() => {
    const root = document.documentElement;
    
    // Color mapping for different themes
    const colorMap = {
      blue: {
        primary: '59 130 246', // blue-500
        primaryForeground: '255 255 255',
      },
      green: {
        primary: '34 197 94', // green-500
        primaryForeground: '255 255 255',
      },
      purple: {
        primary: '168 85 247', // purple-500
        primaryForeground: '255 255 255',
      },
      red: {
        primary: '239 68 68', // red-500
        primaryForeground: '255 255 255',
      },
      orange: {
        primary: '249 115 22', // orange-500
        primaryForeground: '255 255 255',
      },
    };

    const colors = colorMap[settings.primary_color || 'blue'];
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-primary-foreground', colors.primaryForeground);
    
    // Add theme class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${settings.primary_color || 'blue'}`);
  }, [settings.primary_color]);

  const contextValue: ThemeContextType = {
    primaryColor: settings.primary_color || 'blue',
    showCharts: settings.show_charts !== undefined ? settings.show_charts : true,
    refreshInterval: settings.refresh_interval || 5,
    defaultViewMode: settings.default_view_mode || 'grid',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}