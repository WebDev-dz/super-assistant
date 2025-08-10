// import { generateDummyPassword } from './utils';

export const isProductionEnvironment = process.env.NODE_ENV === 'production';
export const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

export const guestRegex = /^guest-\d+$/;

// export const DUMMY_PASSWORD = generateDummyPassword();


export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(239 84% 67%)', // primary
    text: 'hsl(0, 0%, 98%)', // foreground
  },
  dark: {
    background: 'hsl(225 14.29% 10.98%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(225 14.29% 10.98%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(239 84% 67%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};