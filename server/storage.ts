import { 
  UserModel, CitizenModel, VehicleModel, CauseModel, 
  ConfiscationModel, CitationModel 
} from "./models";
import type { 
  User, InsertUser, Citizen, InsertCitizen, 
  Vehicle, InsertVehicle, Cause, InsertCause, 
  Confiscation, InsertConfiscation, Citation, InsertCitation 
} from "@shared/schema";

// 1. DEFINICIÓN DE LA INTERFAZ (Esto faltaba y causaba el error)
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

// 2. HELPER PARA MAPEAR DOCUMENTOS DE MONGO A OBJETOS
const mapDoc = <T>(doc: any): T => {
  if (!doc) return doc;
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj as T;
};

// 3. IMPLEMENTACIÓN DE MONGO STORAGE
export class MongoStorage implements IStorage {
  // --- USUARIOS ---
  async getUser(id: string): Promise<User | undefined> {
    try {
      const doc = await UserModel.findById(id);
      return doc ? mapDoc<User>(doc) : undefined;
    } catch { return undefined; }
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    const doc = await UserModel.findOne({ discordId });
    return doc ? mapDoc<User>(doc) : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const doc = await UserModel.create(user);
    return mapDoc<User>(doc);
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const doc = await UserModel.findByIdAndUpdate(id, user, { new: true });
      return doc ? mapDoc<User>(doc) : undefined;
    } catch { return undefined; }
  }

  // --- CIUDADANOS ---
  async getCitizen(id: string): Promise<Citizen | undefined> {
    try {
      const doc = await CitizenModel.findById(id);
      return doc ? mapDoc<Citizen>(doc) : undefined;
    } catch { return undefined; }
  }

  async getCitizenByRut(rut: string): Promise<Citizen | undefined> {
    const doc = await CitizenModel.findOne({ rut });
    return doc ? mapDoc<Citizen>(doc) : undefined;
  }

  async searchCitizens(query: string): Promise<Citizen[]> {
    const regex = new RegExp(query, 'i');
    const docs = await CitizenModel.find({
      $or: [{ rut: regex }, { nombre: regex }]
    });
    return docs.map(d => mapDoc<Citizen>(d));
  }

  async createCitizen(citizen: InsertCitizen): Promise<Citizen> {
    const doc = await CitizenModel.create(citizen);
    return mapDoc<Citizen>(doc);
  }

  async getAllCitizens(): Promise<Citizen[]> {
    const docs = await CitizenModel.find();
    return docs.map(d => mapDoc<Citizen>(d));
  }

  // --- VEHICULOS ---
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    try {
      const doc = await VehicleModel.findById(id);
      return doc ? mapDoc<Vehicle>(doc) : undefined;
    } catch { return undefined; }
  }

  async getVehicleByPatente(patente: string): Promise<Vehicle | undefined> {
    const doc = await VehicleModel.findOne({ patente });
    return doc ? mapDoc<Vehicle>(doc) : undefined;
  }

  async searchVehicles(query: string): Promise<Vehicle[]> {
    const regex = new RegExp(query, 'i');
    const docs = await VehicleModel.find({
      $or: [{ patente: regex }, { modelo: regex }, { duenoRut: regex }]
    });
    return docs.map(d => mapDoc<Vehicle>(d));
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const doc = await VehicleModel.create(vehicle);
    return mapDoc<Vehicle>(doc);
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const docs = await VehicleModel.find();
    return docs.map(d => mapDoc<Vehicle>(d));
  }

  // --- CAUSAS ---
  async getCause(id: string): Promise<Cause | undefined> {
    try {
      const doc = await CauseModel.findOne({ _id: id, isDeleted: false });
      return doc ? mapDoc<Cause>(doc) : undefined;
    } catch { return undefined; }
  }

  async getAllCauses(): Promise<Cause[]> {
    const docs = await CauseModel.find({ isDeleted: false }).sort({ createdAt: -1 });
    return docs.map(d => mapDoc<Cause>(d));
  }

  async getDeletedCauses(): Promise<Cause[]> {
    const docs = await CauseModel.find({ isDeleted: true }).sort({ deletedAt: -1 });
    return docs.map(d => mapDoc<Cause>(d));
  }

  async searchCauses(query: string): Promise<Cause[]> {
    const regex = new RegExp(query, 'i');
    const docs = await CauseModel.find({
      isDeleted: false,
      $or: [{ ruc: regex }, { rit: regex }, { descripcion: regex }, { imputadoRut: regex }]
    });
    return docs.map(d => mapDoc<Cause>(d));
  }

  async createCause(cause: InsertCause): Promise<Cause> {
    const doc = await CauseModel.create({ ...cause, isDeleted: false });
    return mapDoc<Cause>(doc);
  }

  async updateCause(id: string, cause: Partial<InsertCause>): Promise<Cause | undefined> {
    try {
      const doc = await CauseModel.findOneAndUpdate(
        { _id: id, isDeleted: false }, 
        cause, 
        { new: true }
      );
      return doc ? mapDoc<Cause>(doc) : undefined;
    } catch { return undefined; }
  }

  async softDeleteCause(id: string): Promise<Cause | undefined> {
    try {
      const doc = await CauseModel.findByIdAndUpdate(
        id, 
        { isDeleted: true, deletedAt: new Date() }, 
        { new: true }
      );
      return doc ? mapDoc<Cause>(doc) : undefined;
    } catch { return undefined; }
  }

  async restoreCause(id: string): Promise<Cause | undefined> {
    try {
      const doc = await CauseModel.findByIdAndUpdate(
        id, 
        { isDeleted: false, deletedAt: null }, 
        { new: true }
      );
      return doc ? mapDoc<Cause>(doc) : undefined;
    } catch { return undefined; }
  }

  async permanentDeleteCause(id: string): Promise<boolean> {
    try {
      const result = await CauseModel.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch { return false; }
  }

  // --- INCAUTACIONES Y CITACIONES ---
  async createConfiscation(confiscation: InsertConfiscation): Promise<Confiscation> {
    const doc = await ConfiscationModel.create(confiscation);
    return mapDoc<Confiscation>(doc);
  }

  async getConfiscationsByCauseId(causeId: string): Promise<Confiscation[]> {
    const docs = await ConfiscationModel.find({ causeId });
    return docs.map(d => mapDoc<Confiscation>(d));
  }

  async createCitation(citation: InsertCitation): Promise<Citation> {
    const doc = await CitationModel.create(citation);
    return mapDoc<Citation>(doc);
  }

  async getCitationsByCauseId(causeId: string): Promise<Citation[]> {
    const docs = await CitationModel.find({ causeId });
    return docs.map(d => mapDoc<Citation>(d));
  }
}

export const storage = new MongoStorage();