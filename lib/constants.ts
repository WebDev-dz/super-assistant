// import { generateDummyPassword } from './utils';

import { AppSchema } from "@/instant.schema";
import { id, UpdateParams } from "@instantdb/react-native";

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
    text: 'hsl(240 10% 3.9%)', // foreground
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


export const defaultGoal : UpdateParams<AppSchema, "goals"> = {
  id: id(),
  title: "",
  status: "not_started",
  priority: "low",
  startDate: "",
  targetEndDate: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: "",
  tags: [],
  budget: 0,
  estimatedTotalHours: 0,
  actualTotalHours: 0,
  overallProgress: 0
}

export const defaultMilestone : UpdateParams<AppSchema, "milestones"> = {
  id: id(),
  title: "",
  description: "",
  percentage: 0,
  completed: false,
  status: "not_started",
  priority: "low",
  deadline: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  dependsOn: [],
  estimatedHours: 0,
  actualHours: 0,
  calendarEventId: "",
  reminders: []
}

export const defaultTask : UpdateParams<AppSchema, "tasks"> = {
  id: id(),
  title: "",
  description: "",
  completed: false,
  priority: "low",
  dueDate: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  estimatedHours: 0,
  actualHours: 0,
  tags: [],
  milestoneId: "",
  hasAlarm: false,
  alarm: [{
    relativeOffset: 0,
    absoluteDate: "",
    method: "alert",
    structuredLocation: {
      title: "",
      proximity: "",
      radius: 0,
      coords: {
        latitude: 0,
        longitude: 0
      }
    }
  }]
}