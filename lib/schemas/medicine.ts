import { z } from 'zod';

export const MedicineOcrSchema = z.object({
  isUnreadable: z.boolean().default(false),
  unreadableReason: z.string().optional(),
  detectedNames: z.array(z.string()).default([]),
  confidenceNote: z.string().optional(),
});

export const MedicineExplanationSchema = z.object({
  brandName: z.string().default(''),
  genericName: z.string().default(''),
  category: z.string().default('General Medicine'),
  primaryUses: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  howAndWhenToTake: z.object({
    timing: z.string().default('As directed by physician'),
    instructions: z.string().default('Take with water as prescribed'),
    dosAndDonts: z.array(z.string()).default([]),
  }),
  sideEffects: z.object({
    common: z.array(z.string()).default([]),
    serious: z.array(z.string()).default([]),
    whenToSeeDoctor: z.string().default('Consult doctor if you feel unusual symptoms.'),
  }),
  safetyWarnings: z.object({
    antibioticCaution: z.string().optional(),
    pregnancyLactationCaution: z.string().default('Consult your doctor if pregnant or breastfeeding.'),
    drivingMachineryCaution: z.string().default('Check for drowsiness before driving.'),
    alcoholCaution: z.string().default('Avoid alcohol while taking this medicine.'),
    generalCautions: z.array(z.string()).default([]),
  }),
  questionsForDoctor: z.array(z.string()).length(3).or(z.array(z.string()).min(1)),
  clarityNote: z.string().optional(),
  isUnreadable: z.boolean().default(false),
});

export type MedicineOcrResponse = z.infer<typeof MedicineOcrSchema>;
export type MedicineExplanationResponse = z.infer<typeof MedicineExplanationSchema>;
