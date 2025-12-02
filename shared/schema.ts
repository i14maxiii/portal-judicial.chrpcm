import { z } from "zod";

export const users = {
  id: "string",
  discordId: "string",
  username: "string",
  avatar: "string",
  role: "string",
};

export const insertUserSchema = z.object({
  discordId: z.string(),
  username: z.string(),
  avatar: z.string().optional(),
  role: z.string().default("user"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  discordId: string;
  username: string;
  avatar: string | null;
  role: string;
};

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
  antecedentes: string | null;
};

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

export const causeStatusEnum = z.enum(["activa", "pendiente", "cerrada", "archivada"]);
export type CauseStatus = z.infer<typeof causeStatusEnum>;

export const insertCauseSchema = z.object({
  ruc: z.string().min(1, "RUC es requerido"),
  rit: z.string().optional(),
  descripcion: z.string().min(1, "Descripción es requerida"),
  estado: causeStatusEnum.default("activa"),
  imputadoRut: z.string().min(1, "RUT del imputado es requerido"),
  fiscalId: z.string().optional(),
});

export type InsertCause = z.infer<typeof insertCauseSchema>;
export type Cause = {
  id: string;
  ruc: string;
  rit: string | null;
  descripcion: string;
  estado: CauseStatus;
  imputadoRut: string;
  fiscalId: string | null;
  isDeleted: boolean;
  createdAt: string;
  deletedAt: string | null;
};

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
};

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
};

export type SearchResult = {
  type: "citizen" | "vehicle" | "cause";
  data: Citizen | Vehicle | Cause;
};
