import { z } from 'zod';
import { 
  authRequestSchema, 
  authResponseSchema,
  registerRequestSchema,
  moodSchema,
  noteSchema,
  createNoteSchema,
  letterSchema,
  createLetterSchema,
  journalEntrySchema,
  createJournalSchema
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  serverError: z.object({
    message: z.string(),
  })
};

export const api = {
  auth: {
    login: {
      method: "POST" as const,
      path: "/api/auth/login",
      input: authRequestSchema,
      responses: {
        200: authResponseSchema,
        401: errorSchemas.unauthorized,
      }
    },
    register: {
      method: "POST" as const,
      path: "/api/auth/register",
      input: registerRequestSchema,
      responses: {
        201: authResponseSchema,
      }
    }
  },
  mood: {
    get: {
      method: "GET" as const,
      path: "/api/mood",
      responses: {
        200: moodSchema.nullable(),
        401: errorSchemas.unauthorized,
      }
    },
    update: {
      method: "POST" as const,
      path: "/api/mood",
      input: moodSchema.omit({ timestamp: true }), // Backend sets timestamp
      responses: {
        200: moodSchema,
        401: errorSchemas.unauthorized,
      }
    }
  },
  notes: {
    list: {
      method: "GET" as const,
      path: "/api/notes",
      responses: {
        200: z.array(noteSchema),
        401: errorSchemas.unauthorized,
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/notes",
      input: createNoteSchema,
      responses: {
        201: noteSchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/notes/:id",
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    }
  },
  letters: {
    list: {
      method: "GET" as const,
      path: "/api/letters",
      responses: {
        200: z.array(letterSchema),
        401: errorSchemas.unauthorized,
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/letters",
      input: createLetterSchema,
      responses: {
        201: letterSchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    open: {
      method: "POST" as const,
      path: "/api/letters/:id/open",
      responses: {
        200: letterSchema,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    },
    archive: {
      method: "POST" as const,
      path: "/api/letters/:id/archive",
      responses: {
        200: letterSchema,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    }
  },
  journal: {
    list: {
      method: "GET" as const,
      path: "/api/journal",
      responses: {
        200: z.array(journalEntrySchema),
        401: errorSchemas.unauthorized,
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/journal",
      input: createJournalSchema,
      responses: {
        201: journalEntrySchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AuthRequest = z.infer<typeof authRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type MoodResponse = z.infer<typeof moodSchema>;
export type NoteInput = z.infer<typeof createNoteSchema>;
export type NoteResponse = z.infer<typeof noteSchema>;
export type LetterInput = z.infer<typeof createLetterSchema>;
export type LetterResponse = z.infer<typeof letterSchema>;
export type JournalInput = z.infer<typeof createJournalSchema>;
export type JournalResponse = z.infer<typeof journalEntrySchema>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type UnauthorizedError = z.infer<typeof errorSchemas.unauthorized>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
