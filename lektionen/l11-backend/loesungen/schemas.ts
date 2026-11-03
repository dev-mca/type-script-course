// Lösung Teil B – Eingaben validieren mit Zod

import { z } from "zod";

const LOCAL_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const CreateBookingSchema = z.object({
  serviceId: z.string().min(1),
  customerName: z.string().trim().min(2, "Name zu kurz").max(80, "Name zu lang"),
  start: z.string().regex(LOCAL_DATE_TIME, "Format JJJJ-MM-TTTHH:MM erwartet"),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
// = { serviceId: string; customerName: string; start: string }

export const DateSchema = z.string().regex(DATE, "Format JJJJ-MM-TT erwartet");

export type ValidationIssue = { path: string; message: string };

export function formatIssues(error: z.ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
  }));
}
