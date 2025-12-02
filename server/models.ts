import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: String,
  role: { type: String, default: 'user' }
});

const CitizenSchema = new mongoose.Schema({
  rut: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  antecedentes: String
});

const VehicleSchema = new mongoose.Schema({
  patente: { type: String, required: true, unique: true },
  modelo: { type: String, required: true },
  duenoRut: { type: String, required: true }
});

const CauseSchema = new mongoose.Schema({
  ruc: { type: String, required: true, unique: true },
  rit: String,
  descripcion: { type: String, required: true },
  estado: { type: String, default: 'activa' },
  imputadoRut: { type: String, required: true },
  fiscalId: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
}, { timestamps: true });

const ConfiscationSchema = new mongoose.Schema({
  causeId: { type: String, required: true },
  descripcion: String,
  items: String,
  ubicacion: String
}, { timestamps: true });

const CitationSchema = new mongoose.Schema({
  causeId: { type: String, required: true },
  citadoRut: String,
  fecha: String,
  hora: String,
  lugar: String,
  motivo: String
}, { timestamps: true });

export const UserModel = mongoose.model('User', UserSchema);
export const CitizenModel = mongoose.model('Citizen', CitizenSchema);
export const VehicleModel = mongoose.model('Vehicle', VehicleSchema);
export const CauseModel = mongoose.model('Cause', CauseSchema);
export const ConfiscationModel = mongoose.model('Confiscation', ConfiscationSchema);
export const CitationModel = mongoose.model('Citation', CitationSchema);