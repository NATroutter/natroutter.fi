import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseURI(rawURI:string|undefined, exportAs: "hostname" | "protocol"){
  if (!rawURI) return undefined;
  const uri = new URL(rawURI);
  switch (exportAs) {
    case "hostname": return uri.hostname;
    case "protocol": return uri.protocol.slice(0, -1);
  }
}

export function toCapitalizedCase(input: string): string {
  return input.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export function formatDate(rawDate: string|Date): string {
  const date = new Date(rawDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}