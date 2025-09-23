import type { ThemeConfig } from 'antd';

// Ant Design theme configuration that matches the existing design system
export const antdTheme: ThemeConfig = {
  token: {
    // Primary colors matching your existing primary color palette
    colorPrimary: '#3b82f6', // primary-500
    colorPrimaryHover: '#2563eb', // primary-600
    colorPrimaryActive: '#1d4ed8', // primary-700
    colorPrimaryBg: '#eff6ff', // primary-50
    colorPrimaryBgHover: '#dbeafe', // primary-100
    colorPrimaryBorder: '#93c5fd', // primary-300
    colorPrimaryBorderHover: '#60a5fa', // primary-400
    colorPrimaryText: '#1e40af', // primary-800
    colorPrimaryTextHover: '#1d4ed8', // primary-700
    colorPrimaryTextActive: '#1e3a8a', // primary-900

    // Success colors matching your secondary green palette
    colorSuccess: '#22c55e', // secondary-500
    colorSuccessHover: '#16a34a', // secondary-600
    colorSuccessActive: '#15803d', // secondary-700
    colorSuccessBg: '#f0fdf4', // secondary-50
    colorSuccessBgHover: '#dcfce7', // secondary-100
    colorSuccessBorder: '#86efac', // secondary-300
    colorSuccessBorderHover: '#4ade80', // secondary-400

    // Warning colors matching your accent yellow palette
    colorWarning: '#eab308', // accent-500
    colorWarningHover: '#ca8a04', // accent-600
    colorWarningActive: '#a16207', // accent-700
    colorWarningBg: '#fefce8', // accent-50
    colorWarningBgHover: '#fef9c3', // accent-100
    colorWarningBorder: '#fde047', // accent-300
    colorWarningBorderHover: '#facc15', // accent-400

    // Error colors matching your danger red palette
    colorError: '#ef4444', // danger-500
    colorErrorHover: '#dc2626', // danger-600
    colorErrorActive: '#b91c1c', // danger-700
    colorErrorBg: '#fef2f2', // danger-50
    colorErrorBgHover: '#fee2e2', // danger-100
    colorErrorBorder: '#fca5a5', // danger-300
    colorErrorBorderHover: '#f87171', // danger-400

    // Info colors (using primary blue)
    colorInfo: '#3b82f6', // primary-500
    colorInfoHover: '#2563eb', // primary-600
    colorInfoActive: '#1d4ed8', // primary-700
    colorInfoBg: '#eff6ff', // primary-50
    colorInfoBgHover: '#dbeafe', // primary-100
    colorInfoBorder: '#93c5fd', // primary-300
    colorInfoBorderHover: '#60a5fa', // primary-400

    // Neutral colors matching your gray palette
    colorText: '#111827', // gray-900
    colorTextSecondary: '#4b5563', // gray-600
    colorTextTertiary: '#9ca3af', // gray-400
    colorTextQuaternary: '#d1d5db', // gray-300
    colorBgBase: '#ffffff', // white
    colorBgContainer: '#ffffff', // white
    colorBgElevated: '#ffffff', // white
    colorBgLayout: '#f9fafb', // gray-50
    colorBgSpotlight: '#f3f4f6', // gray-100
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    colorBorder: '#e5e7eb', // gray-200
    colorBorderSecondary: '#f3f4f6', // gray-100

    // Typography
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 30,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    lineHeight: 1.5714285714285714,
    lineHeightHeading1: 1.2666666666666666,
    lineHeightHeading2: 1.3333333333333333,
    lineHeightHeading3: 1.3333333333333333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5714285714285714,
    lineHeightLG: 1.5,
    lineHeightSM: 1.6666666666666667,

    // Border radius matching your design system
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,

    // Box shadow matching your custom shadows
    boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)', // soft shadow
    boxShadowSecondary: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // medium shadow
    boxShadowTertiary: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)', // strong shadow

    // Control heights
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
    controlHeightXS: 16,

    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
    motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
    motionEaseOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',

    // Z-index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
  },
  components: {
    // Button component customization
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontWeight: 500,
      primaryShadow: '0 2px 0 rgba(59, 130, 246, 0.1)',
    },
    // Input component customization
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      paddingInline: 12,
    },
    // Card component customization
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      headerBg: '#ffffff',
      headerHeight: 56,
      headerHeightSM: 48,
    },
    // Table component customization
    Table: {
      borderRadius: 8,
      headerBg: '#f9fafb',
      headerColor: '#374151',
      headerSortActiveBg: '#f3f4f6',
      headerSortHoverBg: '#f9fafb',
      rowHoverBg: '#f9fafb',
    },
    // Modal component customization
    Modal: {
      borderRadius: 12,
      headerBg: '#ffffff',
      contentBg: '#ffffff',
      footerBg: '#ffffff',
    },
    // Notification component customization
    Notification: {
      borderRadius: 8,
      boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    // Message component customization
    Message: {
      borderRadius: 8,
      boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    // Dropdown component customization
    Dropdown: {
      borderRadius: 8,
      boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    // Tooltip component customization
    Tooltip: {
      borderRadius: 6,
      boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    // Popover component customization
    Popover: {
      borderRadius: 8,
      boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
  algorithm: [], // Use default algorithm, can be changed to theme.darkAlgorithm for dark mode
};

// Dark theme configuration (optional)
export const antdDarkTheme: ThemeConfig = {
  ...antdTheme,
  token: {
    ...antdTheme.token,
    colorBgBase: '#111827', // gray-900
    colorBgContainer: '#1f2937', // gray-800
    colorBgElevated: '#374151', // gray-700
    colorBgLayout: '#030712', // gray-950
    colorBgSpotlight: '#1f2937', // gray-800
    colorText: '#f9fafb', // gray-50
    colorTextSecondary: '#d1d5db', // gray-300
    colorTextTertiary: '#9ca3af', // gray-400
    colorTextQuaternary: '#6b7280', // gray-500
    colorBorder: '#374151', // gray-700
    colorBorderSecondary: '#4b5563', // gray-600
  },
};
