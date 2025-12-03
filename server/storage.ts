import { 
  UserModel, CitizenModel, VehicleModel, CauseModel, 
  ConfiscationModel, CitationModel, WarrantModel 
} from "./models";
import type { 
  User, InsertUser, Citizen, InsertCitizen, 
  Vehicle, InsertVehicle, Cause, InsertCause, 
  Confiscation, InsertConfiscation, Citation, InsertCitation,
  Warrant, InsertWarrant 
} from "@shared/schema";

export interface IStorage {
  // Usuarios
  getUser(id: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Ciudadanos
  getCitizen(id: string): Promise<Citizen | undefined>;
  getCitizenByRut(rut: string): Promise<Citizen | undefined>;
  searchCitizens(query: string): Promise<Citizen[]>;
  createCitizen(citizen: InsertCitizen): Promise<Citizen>;
  getAllCitizens(): Promise<Citizen[]>;

  // Vehículos
  getVehicle(id: string): Promise<Vehicle | undefined>;
  getVehicleByPatente(patente: string): Promise<Vehicle | undefined>;
  searchVehicles(query: string): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  getAllVehicles(): Promise<Vehicle[]>;

  // Causas
  getCause(id: string): Promise<Cause | undefined>;
  getAllCauses(): Promise<Cause[]>;
  getDeletedCauses(): Promise<Cause[]>;
  searchCauses(query: string): Promise<Cause[]>;
  createCause(cause: InsertCause): Promise<Cause>;
  updateCause(id: string, cause: Partial<InsertCause>): Promise<Cause | undefined>;
  softDeleteCause(id: string): Promise<Cause | undefined>;
  restoreCause(id: string): Promise<Cause | undefined>;
  permanentDeleteCause(id: string): Promise<boolean>;

  // Órdenes Judiciales (Warrants)
  createWarrant(warrant: InsertWarrant): Promise<Warrant>;
  getWarrantsByCause(causeId: string): Promise<Warrant[]>;
  getPendingWarrants(): Promise<Warrant[]>;
  updateWarrantStatus(id: string, status: string, signedBy?: string, rejectionReason?: string): Promise<Warrant | undefined>;

  // Otros
  createConfiscation(confiscation: InsertConfiscation): Promise<Confiscation>;
  getConfiscationsByCauseId(causeId: string): Promise<Confiscation[]>;
  createCitation(citation: InsertCitation): Promise<Citation>;
  getCitationsByCauseId(causeId: string): Promise<Citation[]>;
}

const mapDoc = <T>(doc: any): T => {
  if (!doc) return doc;
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj as T;
};

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
      $or: [{ rut: regex }, { username: regex }, { firstNames: regex }, { lastNames: regex }]
    });
    // Mapeo especial para construir el nombre completo si viene del modelo complejo
    return docs.map(d => {
      const obj = mapDoc<any>(d);
      // Si tiene firstNames/lastNames, construimos "nombre" para compatibilidad
      if (!obj.nombre && obj.firstNames) {
        obj.nombre = `${obj.firstNames.join(" ")} ${obj.lastNames.join(" ")}`.trim();
      }
      return obj as Citizen;
    });
  }

  async createCitizen(citizen: InsertCitizen): Promise<Citizen> {
    const doc = await CitizenModel.create(citizen);
    return mapDoc<Citizen>(doc);
  }

  async getAllCitizens(): Promise<Citizen[]> {
    const docs = await CitizenModel.find().limit(50); // Limitamos para no explotar
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
    const doc = await VehicleModel.findOne({ placa: patente }); // Ojo: tu modelo usa 'placa'
    return doc ? mapDoc<Vehicle>(doc) : undefined;
  }

  async searchVehicles(query: string): Promise<Vehicle[]> {
    const regex = new RegExp(query, 'i');
    // Buscamos por placa (patente) o modelo
    const docs = await VehicleModel.find({
      $or: [{ placa: regex }, { modelo: regex }, { rut: regex }]
    });
    return docs.map(d => {
      const obj = mapDoc<any>(d);
      // Mapeamos 'placa' a 'patente' si es necesario para el frontend
      if (obj.placa && !obj.patente) obj.patente = obj.placa;
      if (obj.rut && !obj.duenoRut) obj.duenoRut = obj.rut;
      return obj as Vehicle;
    });
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const doc = await VehicleModel.create({
        ...vehicle,
        placa: vehicle.patente, // Adaptador
        rut: vehicle.duenoRut
    });
    return mapDoc<Vehicle>(doc);
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const docs = await VehicleModel.find().limit(50);
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

  // --- WARRANTS (ÓRDENES) ---
  async createWarrant(warrant: InsertWarrant): Promise<Warrant> {
    const doc = await WarrantModel.create({
      ...warrant,
      status: "pendiente",
      createdAt: new Date()
    });
    return mapDoc<Warrant>(doc);
  }

  async getWarrantsByCause(causeId: string): Promise<Warrant[]> {
    const docs = await WarrantModel.find({ causeId }).sort({ createdAt: -1 });
    return docs.map(d => mapDoc<Warrant>(d));
  }

  async getPendingWarrants(): Promise<Warrant[]> {
    const docs = await WarrantModel.find({ status: "pendiente" }).sort({ createdAt: 1 });
    return docs.map(d => mapDoc<Warrant>(d));
  }

  async updateWarrantStatus(
    id: string, 
    status: string, 
    signedBy?: string, 
    rejectionReason?: string
  ): Promise<Warrant | undefined> {
    const updateData: any = { status };
    
    if (status === "aprobada" && signedBy) {
      updateData.signedBy = signedBy;
      updateData.signedAt = new Date();
    }
    
    if (status === "rechazada" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    const doc = await WarrantModel.findByIdAndUpdate(id, updateData, { new: true });
    return doc ? mapDoc<Warrant>(doc) : undefined;
  }

  // --- OTROS ---
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
