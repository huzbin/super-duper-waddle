// API integration test utilities
// This file can be used to test API integration during development

export const mockPublicApiResponse = {
  status: "success",
  message: "",
  data: {
    allow_cors: true,
    custom_body: "",
    custom_head: "",
    description: "My Custom Komari Monitor Description",
    disable_password_login: false,
    oauth_enable: false,
    oauth_provider: null,
    ping_record_preserve_time: 48,
    private_site: false,
    record_enabled: true,
    record_preserve_time: 720,
    sitename: "My Custom Komari Site",
    theme: "Hero",
    theme_settings: {
      default_view_mode: "table",
      show_charts: true,
      refresh_interval: 10,
      primary_color: "green"
    }
  }
};

// Function to test API integration
export async function testApiIntegration() {
  try {
    const response = await fetch('/api/public');
    const result = await response.json();
    
    console.log('API Response:', result);
    
    if (result.status === 'success' && result.data) {
      console.log('✅ API integration working correctly');
      console.log('Site Name:', result.data.sitename);
      console.log('Description:', result.data.description);
      console.log('Theme Settings:', result.data.theme_settings);
      return true;
    } else {
      console.log('❌ API response format incorrect');
      return false;
    }
  } catch (error) {
    console.log('❌ API request failed:', error);
    return false;
  }
}

// Call this function in browser console to test API integration
// testApiIntegration();