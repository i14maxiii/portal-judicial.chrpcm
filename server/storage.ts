import {
  type User,
  type InsertUser,
  type Citizen,
  type InsertCitizen,
  type Vehicle,
  type InsertVehicle,
  type Cause,
  type InsertCause,
  type Confiscation,
  type InsertConfiscation,
  type Citation,
  type InsertCitation,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  getCitizen(id: string): Promise<Citizen | undefined>;
  getCitizenByRut(rut: string): Promise<Citizen | undefined>;
  searchCitizens(query: string): Promise<Citizen[]>;
  createCitizen(citizen: InsertCitizen): Promise<Citizen>;
  getAllCitizens(): Promise<Citizen[]>;

  getVehicle(id: string): Promise<Vehicle | undefined>;
  getVehicleByPatente(patente: string): Promise<Vehicle | undefined>;
  searchVehicles(query: string): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  getAllVehicles(): Promise<Vehicle[]>;

  getCause(id: string): Promise<Cause | undefined>;
  getAllCauses(): Promise<Cause[]>;
  getDeletedCauses(): Promise<Cause[]>;
  searchCauses(query: string): Promise<Cause[]>;
  createCause(cause: InsertCause): Promise<Cause>;
  updateCause(id: string, cause: Partial<InsertCause>): Promise<Cause | undefined>;
  softDeleteCause(id: string): Promise<Cause | undefined>;
  restoreCause(id: string): Promise<Cause | undefined>;
  permanentDeleteCause(id: string): Promise<boolean>;

  createConfiscation(confiscation: InsertConfiscation): Promise<Confiscation>;
  getConfiscationsByCauseId(causeId: string): Promise<Confiscation[]>;

  createCitation(citation: InsertCitation): Promise<Citation>;
  getCitationsByCauseId(causeId: string): Promise<Citation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private citizens: Map<string, Citizen>;
  private vehicles: Map<string, Vehicle>;
  private causes: Map<string, Cause>;
  private confiscations: Map<string, Confiscation>;
  private citations: Map<string, Citation>;

  constructor() {
    this.users = new Map();
    this.citizens = new Map();
    this.vehicles = new Map();
    this.causes = new Map();
    this.confiscations = new Map();
    this.citations = new Map();

    this.seedData();
  }

  private seedData() {
    const citizen1: Citizen = {
      id: randomUUID(),
      rut: "12.345.678-9",
      nombre: "Juan Carlos Pérez González",
      antecedentes: "Sin antecedentes penales",
    };
    const citizen2: Citizen = {
      id: randomUUID(),
      rut: "11.222.333-4",
      nombre: "María Fernanda López Soto",
      antecedentes: null,
    };
    const citizen3: Citizen = {
      id: randomUUID(),
      rut: "9.876.543-2",
      nombre: "Roberto Andrés Muñoz Vera",
      antecedentes: "Falta menor - Conducción sin licencia (2023)",
    };
    this.citizens.set(citizen1.id, citizen1);
    this.citizens.set(citizen2.id, citizen2);
    this.citizens.set(citizen3.id, citizen3);

    const vehicle1: Vehicle = {
      id: randomUUID(),
      patente: "ABCD12",
      modelo: "Toyota Corolla 2022",
      duenoRut: "12.345.678-9",
    };
    const vehicle2: Vehicle = {
      id: randomUUID(),
      patente: "WXYZ99",
      modelo: "Chevrolet Spark 2021",
      duenoRut: "11.222.333-4",
    };
    const vehicle3: Vehicle = {
      id: randomUUID(),
      patente: "QRST45",
      modelo: "Ford Ranger 2023",
      duenoRut: "9.876.543-2",
    };
    this.vehicles.set(vehicle1.id, vehicle1);
    this.vehicles.set(vehicle2.id, vehicle2);
    this.vehicles.set(vehicle3.id, vehicle3);

    const cause1: Cause = {
      id: randomUUID(),
      ruc: "2300123456-7",
      rit: "O-123-2024",
      descripcion: "Robo con intimidación en local comercial ubicado en Av. Principal 1234. El imputado habría ingresado al establecimiento portando arma blanca.",
      estado: "activa",
      imputadoRut: "9.876.543-2",
      fiscalId: null,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };
    const cause2: Cause = {
      id: randomUUID(),
      ruc: "2300654321-0",
      rit: "O-456-2024",
      descripcion: "Lesiones leves en riña callejera ocurrida el día 15 de noviembre de 2024 en sector centro.",
      estado: "pendiente",
      imputadoRut: "12.345.678-9",
      fiscalId: null,
      isDeleted: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      deletedAt: null,
    };
    const cause3: Cause = {
      id: randomUUID(),
      ruc: "2300111222-3",
      rit: null,
      descripcion: "Hurto simple de especies desde vehículo estacionado.",
      estado: "cerrada",
      imputadoRut: "11.222.333-4",
      fiscalId: null,
      isDeleted: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      deletedAt: null,
    };
    this.causes.set(cause1.id, cause1);
    this.causes.set(cause2.id, cause2);
    this.causes.set(cause3.id, cause3);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.discordId === discordId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      discordId: insertUser.discordId,
      username: insertUser.username,
      avatar: insertUser.avatar || null,
      role: insertUser.role || "user",
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated: User = {
      ...user,
      ...userData,
      avatar: userData.avatar !== undefined ? userData.avatar || null : user.avatar,
    };
    this.users.set(id, updated);
    return updated;
  }

  async getCitizen(id: string): Promise<Citizen | undefined> {
    return this.citizens.get(id);
  }

  async getCitizenByRut(rut: string): Promise<Citizen | undefined> {
    return Array.from(this.citizens.values()).find(
      (citizen) => citizen.rut === rut
    );
  }

  async searchCitizens(query: string): Promise<Citizen[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.citizens.values()).filter(
      (citizen) =>
        citizen.rut.toLowerCase().includes(lowerQuery) ||
        citizen.nombre.toLowerCase().includes(lowerQuery)
    );
  }

  async createCitizen(insertCitizen: InsertCitizen): Promise<Citizen> {
    const id = randomUUID();
    const citizen: Citizen = {
      id,
      rut: insertCitizen.rut,
      nombre: insertCitizen.nombre,
      antecedentes: insertCitizen.antecedentes || null,
    };
    this.citizens.set(id, citizen);
    return citizen;
  }

  async getAllCitizens(): Promise<Citizen[]> {
    return Array.from(this.citizens.values());
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getVehicleByPatente(patente: string): Promise<Vehicle | undefined> {
    return Array.from(this.vehicles.values()).find(
      (vehicle) => vehicle.patente.toLowerCase() === patente.toLowerCase()
    );
  }

  async searchVehicles(query: string): Promise<Vehicle[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.vehicles.values()).filter(
      (vehicle) =>
        vehicle.patente.toLowerCase().includes(lowerQuery) ||
        vehicle.modelo.toLowerCase().includes(lowerQuery) ||
        vehicle.duenoRut.toLowerCase().includes(lowerQuery)
    );
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = randomUUID();
    const vehicle: Vehicle = {
      id,
      patente: insertVehicle.patente,
      modelo: insertVehicle.modelo,
      duenoRut: insertVehicle.duenoRut,
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getCause(id: string): Promise<Cause | undefined> {
    const cause = this.causes.get(id);
    if (cause && !cause.isDeleted) return cause;
    return undefined;
  }

  async getAllCauses(): Promise<Cause[]> {
    return Array.from(this.causes.values()).filter((cause) => !cause.isDeleted);
  }

  async getDeletedCauses(): Promise<Cause[]> {
    return Array.from(this.causes.values()).filter((cause) => cause.isDeleted);
  }

  async searchCauses(query: string): Promise<Cause[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.causes.values()).filter(
      (cause) =>
        !cause.isDeleted &&
        (cause.ruc.toLowerCase().includes(lowerQuery) ||
          (cause.rit && cause.rit.toLowerCase().includes(lowerQuery)) ||
          cause.descripcion.toLowerCase().includes(lowerQuery) ||
          cause.imputadoRut.toLowerCase().includes(lowerQuery))
    );
  }

  async createCause(insertCause: InsertCause): Promise<Cause> {
    const id = randomUUID();
    const cause: Cause = {
      id,
      ruc: insertCause.ruc,
      rit: insertCause.rit || null,
      descripcion: insertCause.descripcion,
      estado: insertCause.estado || "activa",
      imputadoRut: insertCause.imputadoRut,
      fiscalId: insertCause.fiscalId || null,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };
    this.causes.set(id, cause);
    return cause;
  }

  async updateCause(id: string, causeData: Partial<InsertCause>): Promise<Cause | undefined> {
    const cause = this.causes.get(id);
    if (!cause || cause.isDeleted) return undefined;

    const updated: Cause = {
      ...cause,
      ruc: causeData.ruc ?? cause.ruc,
      rit: causeData.rit !== undefined ? causeData.rit || null : cause.rit,
      descripcion: causeData.descripcion ?? cause.descripcion,
      estado: causeData.estado ?? cause.estado,
      imputadoRut: causeData.imputadoRut ?? cause.imputadoRut,
      fiscalId: causeData.fiscalId !== undefined ? causeData.fiscalId || null : cause.fiscalId,
    };
    this.causes.set(id, updated);
    return updated;
  }

  async softDeleteCause(id: string): Promise<Cause | undefined> {
    const cause = this.causes.get(id);
    if (!cause || cause.isDeleted) return undefined;

    const updated: Cause = {
      ...cause,
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    };
    this.causes.set(id, updated);
    return updated;
  }

  async restoreCause(id: string): Promise<Cause | undefined> {
    const cause = this.causes.get(id);
    if (!cause || !cause.isDeleted) return undefined;

    const updated: Cause = {
      ...cause,
      isDeleted: false,
      deletedAt: null,
    };
    this.causes.set(id, updated);
    return updated;
  }

  async permanentDeleteCause(id: string): Promise<boolean> {
    const cause = this.causes.get(id);
    if (!cause || !cause.isDeleted) return false;
    return this.causes.delete(id);
  }

  async createConfiscation(insertConfiscation: InsertConfiscation): Promise<Confiscation> {
    const id = randomUUID();
    const confiscation: Confiscation = {
      id,
      causeId: insertConfiscation.causeId,
      descripcion: insertConfiscation.descripcion,
      items: insertConfiscation.items,
      ubicacion: insertConfiscation.ubicacion || null,
      createdAt: new Date().toISOString(),
    };
    this.confiscations.set(id, confiscation);
    return confiscation;
  }

  async getConfiscationsByCauseId(causeId: string): Promise<Confiscation[]> {
    return Array.from(this.confiscations.values()).filter(
      (c) => c.causeId === causeId
    );
  }

  async createCitation(insertCitation: InsertCitation): Promise<Citation> {
    const id = randomUUID();
    const citation: Citation = {
      id,
      causeId: insertCitation.causeId,
      citadoRut: insertCitation.citadoRut,
      fecha: insertCitation.fecha,
      hora: insertCitation.hora,
      lugar: insertCitation.lugar,
      motivo: insertCitation.motivo,
      createdAt: new Date().toISOString(),
    };
    this.citations.set(id, citation);
    return citation;
  }

  async getCitationsByCauseId(causeId: string): Promise<Citation[]> {
    return Array.from(this.citations.values()).filter(
      (c) => c.causeId === causeId
    );
  }
}

export const storage = new MemStorage();
