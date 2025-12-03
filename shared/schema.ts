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

// --- CIUDADANOS ---
export const insertCitizenSchema = z.object({
  rut: z.string().min(1, "RUT es requerido"),
  nombre: z.string().min(1, "Nombre es requerido"),
  antecedentes: z.string().optional(),
});

export type InsertCitizen = z.infer<typeof insertCitizenSchema>;
export type Citizen = {
  id: string;
  rut: string;
  nombre: string;
  antecedentes: any[] | string | null;
  cuentas?: { saldo: number; tipo: string; historial: any[] }[];
  licencias?: { tipo: string; fechaVencimiento: string }[];
  multas?: any[];
};

// --- VEHÍCULOS ---
export const insertVehicleSchema = z.object({
  patente: z.string().min(1, "Patente es requerida"),
  modelo: z.string().min(1, "Modelo es requerido"),
  duenoRut: z.string().min(1, "RUT del dueño es requerido"),
});

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = {
  id: string;
  patente: string;
  modelo: string;
  duenoRut: string;
};

// --- CAUSAS (CORREGIDO Y COMPLETO) ---
// Recuperamos las listas originales de tu versión EJS
export const causeStatusEnum = z.enum(["investigacion", "judicializada", "cerrada", "archivada"]);
export const causePriorityEnum = z.enum(["normal", "alta", "urgente"]);
export const causeOriginEnum = z.enum(["Fiscalía", "Juzgado de Garantía", "Tribunal Oral", "Corte Suprema", "Querella Civil"]);
export const causeMateriaEnum = z.enum(["Penal", "Civil", "Familia", "Laboral", "Corte Suprema"]);

export type CauseStatus = z.infer<typeof causeStatusEnum>;

export const insertCauseSchema = z.object({
  caratula: z.string().min(5, "La carátula es obligatoria"),
  ruc: z.string().min(1, "RUC es requerido"),
  rit: z.string().optional(),
  
  // Nuevos campos recuperados
  origen: causeOriginEnum.default("Fiscalía"),
  materia: causeMateriaEnum.default("Penal"),
  
  descripcion: z.string().min(1, "Descripción es requerida"),
  estado: causeStatusEnum.default("investigacion"), // Ahora seleccionable
  prioridad: causePriorityEnum.default("normal"),
  
  imputadoRut: z.string().min(1, "RUT del imputado es requerido"),
  fiscalId: z.string().optional(),
  juezId: z.string().optional(),
});

export type InsertCause = z.infer<typeof insertCauseSchema>;
export type Cause = {
  id: string;
  caratula: string;
  ruc: string;
  rit: string | null;
  origen: string; // Nuevo
  materia: string; // Nuevo
  descripcion: string;
  estado: CauseStatus;
  prioridad: string;
  imputadoRut: string;
  fiscalId: string | null;
  juezId: string | null;
  isDeleted: boolean;
  createdAt: string;
  deletedAt: string | null;
};

// --- ÓRDENES JUDICIALES ---
export const warrantTypeEnum = z.enum([
  "detencion",
  "allanamiento",
  "incautacion",
  "intervencion",
  "secreto_bancario"
]);
export const warrantStatusEnum = z.enum(["pendiente", "aprobada", "rechazada", "ejecutada", "vencida"]);

export const insertWarrantSchema = z.object({
  causeId: z.string().min(1, "Causa vinculada requerida"),
  type: warrantTypeEnum,
  target: z.string().min(1, "Objetivo requerido"),
  reason: z.string().min(10, "Justificación requerida"),
  requestedBy: z.string(),
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
  signedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  signedAt: string | null;
};

// --- INCAUTACIONES ---
export const insertConfiscationSchema = z.object({
  causeId: z.string().min(1, "Causa es requerida"),
  descripcion: z.string().min(1, "Descripción es requerida"),
  items: z.string().min(1, "Items incautados son requeridos"),
  ubicacion: z.string().optional(),
});

export type InsertConfiscation = z.infer<typeof insertConfiscationSchema>;
export type Confiscation = {
  id: string;
  causeId: string;
  descripcion: string;
  items: string;
  ubicacion: string | null;
  createdAt: string;
  updatedAt?: string;
};

// --- CITACIONES ---
export const insertCitationSchema = z.object({
  causeId: z.string().min(1, "Causa es requerida"),
  citadoRut: z.string().min(1, "RUT del citado es requerido"),
  fecha: z.string().min(1, "Fecha es requerida"),
  hora: z.string().min(1, "Hora es requerida"),
  lugar: z.string().min(1, "Lugar es requerido"),
  motivo: z.string().min(1, "Motivo es requerido"),
});

export type InsertCitation = z.infer<typeof insertCitationSchema>;
export type Citation = {
  id: string;
  causeId: string;
  citadoRut: string;
  fecha: string;
  hora: string;
  lugar: string;
  motivo: string;
  createdAt: string;
  updatedAt?: string;
};

export type SearchResult = {
  type: "citizen" | "vehicle" | "cause";
  data: Citizen | Vehicle | Cause;
};
