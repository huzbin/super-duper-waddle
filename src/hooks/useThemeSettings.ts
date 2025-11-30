import { useState, useEffect } from 'react';
import type { PublicInfo } from '@/types/komari';

interface ThemeSettings {
  default_view_mode?: 'grid' | 'table';
  show_charts?: boolean;
  refresh_interval?: number;
  primary_color?: 'blue' | 'green' | 'purple' | 'red' | 'orange';
}

export function useThemeSettings() {
  const [settings, setSettings] = useState<ThemeSettings>({});
  const [publicInfo, setPublicInfo] = useState<PublicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/public');
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          setPublicInfo(result.data);
          
          // Extract theme settings with defaults
          const themeSettings = result.data.theme_settings || {};
          setSettings({
            default_view_mode: themeSettings.default_view_mode || 'grid',
            show_charts: themeSettings.show_charts !== undefined ? themeSettings.show_charts : true,
            refresh_interval: themeSettings.refresh_interval || 5,
            primary_color: themeSettings.primary_color || 'blue',
          });
        } else {
          throw new Error('Failed to fetch public info');
        }
      } catch (err) {
        console.error('Error fetching theme settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set default values on error
        setSettings({
          default_view_mode: 'grid',
          show_charts: true,
          refresh_interval: 5,
          primary_color: 'blue',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublicInfo();
  }, []);

  return {
    settings,
    publicInfo,
    loading,
    error,
    sitename: publicInfo?.sitename || 'Komari Monitor',
    description: publicInfo?.description || 'A simple server monitor tool.',
  };
}