import Constants from 'expo-constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}





export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "#10B981";
    case "medium":
      return "#F59E0B";
    case "high":
      return "#EF4444";
    case "urgent":
      return "#DC2626";
    default:
      return "#6B7280";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return '#10B981';
    case 'in_progress': return '#3B82F6';
    case 'not_started': return '#6B7280';
    case 'on_hold': return '#F59E0B';
    case 'cancelled': return '#EF4444';
    default: return '#6B7280';
  }
};


export const generateAPIUrl = (relativePath: string) => {

  console.log({experienceUrl: Constants.linkingUri, relativePath}); 
  const origin =  Constants?.experienceUrl?.replace('exp://', 'http://');

  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  let apiUrl =  origin || process.env.EXPO_PUBLIC_API_BASE_URL;
  apiUrl = apiUrl.concat(path);
  console.log({apiUrl, origin, path});

  // if (process.env.NODE_ENV === 'development') {
  //   return origin?.concat(path);
  // }


  if (!apiUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
    );
  }

  return apiUrl
};