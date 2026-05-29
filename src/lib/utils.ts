import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Formats a number as a USD currency string.
 * Example: 1234.56 → "$1,234.56"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a Date or ISO string as a human-readable date.
 * Example: "2026-05-29" → "May 29, 2026"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Formats a Date or ISO string as a month + year string.
 * Example: "2026-05-01" → "May 2026"
 */
export function formatMonth(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
}

/**
 * Merges Tailwind CSS class names, resolving conflicts via tailwind-merge
 * and handling conditional classes via clsx.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
