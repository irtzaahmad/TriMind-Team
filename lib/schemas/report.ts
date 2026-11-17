import { z } from 'zod';

export const TestResultItemSchema = z.object({
  testName: z.string(),
  value: z.string(),
  unit: z.string().default(''),
  referenceRange: z.string().default('range not provided'),
  status: z.enum(['normal', 'high', 'low', 'unknown', 'not_provided', 'unclear']).default('unknown'),
  statusExplanation: z.string().default(''),
  isBlurryOrUnclear: z.boolean().default(false),
});

export const MedicalReportSchema = z.object({
  patientNeutralSummary: z.string().default(''),
  overallHealthStatusSimple: z.string().default(''),
  testResults: z.array(TestResultItemSchema).default([]),
  abnormalFindingsExplanation: z.array(
    z.object({
      testName: z.string(),
      meaningInPlainLanguage: z.string(),
      whatItMeansForBody: z.string(),
    })
  ).default([]),
  whatToAskYourDoctor: z.array(z.string()).default([]),
  whenToSeekUrgentCare: z.array(z.string()).default([]),
  validationNotes: z.string().default(''),
  isUnreadable: z.boolean().default(false),
});

export type MedicalReportResponse = z.infer<typeof MedicalReportSchema>;
