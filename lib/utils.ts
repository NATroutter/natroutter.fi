import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function toTitleCase(word:string):string {
  return word.substring(0,1).toUpperCase() + word.substring(1).toLowerCase();
}

export function toCapitalizedCase(input: string): string {
  return input.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export function formatDate(rawDate: string|Date): string {
  const date = new Date(rawDate);  // Convert string to Date object
  return date.toLocaleDateString('en-US', {  // Format the date as you prefer
    year: 'numeric',       // '2019'
    month: 'short',         // 'January'
    day: 'numeric'         // '11'
  });
}