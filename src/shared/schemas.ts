import { z } from "zod";

export const projectStatusSchema = z.enum(["active", "paused", "finished", "frogged"]);

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: projectStatusSchema.default("active"),
  yarnType: z.string().optional(),
  yarnWeight: z.string().optional(),
  colorsUsed: z.string().optional(),
  hookSize: z.string().optional(),
  finishedSize: z.string().optional(),
  notes: z.string().optional(),
  photoPath: z.string().optional(),
  pdfPath: z.string().optional(),
  pdfFilename: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createProjectSchema = projectSchema
  .omit({
    id: true,
    photoPath: true,
    pdfPath: true,
    pdfFilename: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    title: z.string().min(1, "Project title is required."),
  });

export const updateProjectSchema = createProjectSchema.partial();

export const counterSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string().min(1),
  type: z.enum(["row", "round"]).default("row"),
  currentValue: z.number().int().min(0).default(0),
  targetValue: z.number().int().positive().optional(),
  notes: z.string().optional(),
  isCompleted: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createCounterSchema = counterSchema
  .omit({
    id: true,
    projectId: true,
    isCompleted: true,
    sortOrder: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z.string().min(1, "Counter name is required."),
    currentValue: z.number().int().min(0).default(0),
  });

export const updateCounterSchema = counterSchema
  .pick({
    name: true,
    targetValue: true,
    notes: true,
    isCompleted: true,
    sortOrder: true,
  })
  .extend({
    type: z.enum(["row", "round"]).optional(),
    currentValue: z.number().int().min(0).optional(),
  })
  .partial();

export const customSectionSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string().min(1),
  content: z.string().default(""),
  sortOrder: z.number().int().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type Counter = z.infer<typeof counterSchema>;
export type CreateCounterInput = z.infer<typeof createCounterSchema>;
export type UpdateCounterInput = z.infer<typeof updateCounterSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
