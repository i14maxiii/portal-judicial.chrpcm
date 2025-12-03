import { z } from "zod";

// --- USUARIOS Y ROLES ---
export const userRolesEnum = z.enum(["admin", "juez", "fiscal", "policia", "abogado", "civil"]);
export type UserRole = z.infer<typeof userRolesEnum>;

export const insertUserSchema = z.object({
  discordId: z.string(),
  username: z.string(),
  avatar: z.string().optional(),
  role: userRolesEnum.default("civil"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  discordId: string;
  username: string;
  avatar: string | null;
  role: UserRole;
};

// --- CIUDADANOS Y VEHÍCULOS (Sin cambios mayores) ---
export const insertCitizenSchema = z.object({
  rut: z.string().min(1, "RUT es requerido"),
  nombre: z.string().min(1, "Nombre es requerido"),
  antecedentes: z.string().optional(),
});
export type InsertCitizen = z.infer<typeof insertCitizenSchema>;
export type Citizen = { id: string; rut: string; nombre: string; antecedentes: string | null; };

export const insertVehicleSchema = z.object({
  patente: z.string().min(1, "Patente es requerida"),
  modelo: z.string().min(1, "Modelo es requerido"),
  duenoRut: z.string().min(1, "RUT del dueño es requerido"),
});
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = { id: string; patente: string; modelo: string; duenoRut: string; };

// --- CAUSAS MEJORADAS ---
export const causeStatusEnum = z.enum(["investigacion", "judicializada", "cerrada", "archivada"]);

export const insertCauseSchema = z.object({
  ruc: z.string().min(1, "RUC es requerido"),
  rit: z.string().optional(),
  descripcion: z.string().min(1, "Descripción es requerida"),
  estado: causeStatusEnum.default("investigacion"),
  imputadoRut: z.string().min(1, "RUT del imputado es requerido"),
  fiscalId: z.string().optional(),
  juezId: z.string().optional(),
});

export type InsertCause = z.infer<typeof insertCauseSchema>;
export type Cause = {
  id: string;
  ruc: string;
  rit: string | null;
  descripcion: string;
  estado: z.infer<typeof causeStatusEnum>;
  imputadoRut: string;
  fiscalId: string | null;
  juezId: string | null;
  isDeleted: boolean;
  createdAt: string;
  deletedAt: string | null;
};

// --- NUEVO: ÓRDENES JUDICIALES (Warrants) ---
export const warrantTypeEnum = z.enum(["detencion", "allanamiento", "incautacion", "intervencion"]);
export const warrantStatusEnum = z.enum(["pendiente", "aprobada", "rechazada", "ejecutada", "vencida"]);

export const insertWarrantSchema = z.object({
  causeId: z.string().min(1, "Causa vinculada requerida"),
  type: warrantTypeEnum,
  target: z.string().min(1, "Objetivo requerido (Nombre o Dirección)"),
  reason: z.string().min(10, "Justificación requerida para el Juez"),
  requestedBy: z.string(), // ID del Fiscal
});

export type InsertWarrant = z.infer<typeof insertWarrantSchema>;
export type Warrant = {
  id: string;
  causeId: string;
  type: z.infer<typeof warrantTypeEnum>;
  target: string;
  reason: string;
  status: z.infer<typeof warrantStatusEnum>;
  requestedBy: string;
  signedBy: string | null; // Juez
  rejectionReason: string | null;
  createdAt: string;
  signedAt: string | null;
};

// --- OTROS (Sin cambios mayores) ---
export const insertConfiscationSchema = z.object({
  causeId: z.string().min(1),
  descripcion: z.string().min(1),
  items: z.string().min(1),
  ubicacion: z.string().optional(),
});
export type InsertConfiscation = z.infer<typeof insertConfiscationSchema>;
export type Confiscation = { id: string; causeId: string; descripcion: string; items: string; ubicacion: string | null; createdAt: string; };

export const insertCitationSchema = z.object({
  causeId: z.string().min(1),
  citadoRut: z.string().min(1),
  fecha: z.string().min(1),
  hora: z.string().min(1),
  lugar: z.string().min(1),
  motivo: z.string().min(1),
});
export type InsertCitation = z.infer<typeof insertCitationSchema>;
export type Citation = { id: string; causeId: string; citadoRut: string; fecha: string; hora: string; lugar: string; motivo: string; createdAt: string; };

export type SearchResult = { type: "citizen" | "vehicle" | "cause"; data: Citizen | Vehicle | Cause; };
