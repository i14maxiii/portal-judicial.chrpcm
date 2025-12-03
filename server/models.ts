import mongoose from "mongoose";

// ===================================================================
// 1. MODELO DE CÉDULA (CIUDADANO)
// ===================================================================

const antecedenteSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    lugar: { type: String, required: true },
    estadoSujeto: { type: String, required: true },
    oficial: { type: String, required: true },
    codigoPenal: { type: String, default: '' },
    evidencia: { type: String, default: '' },
    sentencia: { type: Number, default: 0 },
    fianza: { type: Number, default: 0 },
});

const multaSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    motivo: { type: String, required: true },
    lugar: { type: String, required: true },
    monto: { type: Number, required: true },
    oficial: { type: String, required: true },
    estado: { type: String, default: 'Pendiente de Pago' },
    placa: { type: String, default: 'N/A' },
    liberaVehiculo: { type: String, default: null }
});

const transaccionSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    descripcion: { type: String, required: true },
    monto: { type: Number, required: true },
    saldoResultante: { type: Number, required: true }
});

const cuentaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, default: 'Cuenta Principal' },
    tipo: { type: String, enum: ['Corriente', 'Ahorro'], default: 'Corriente' },
    saldo: { type: Number, default: 150000 },
    historial: [transaccionSchema]
});

const licenciaSchema = new mongoose.Schema({
    tipo: { type: String, required: true },
    fechaEmision: { type: Date, default: Date.now },
    fechaVencimiento: { type: Date }
});

const cedulaSchema = new mongoose.Schema({
    // Datos de Identidad
    discordId: { type: String, required: true, unique: true },
    username: { type: String }, 
    avatar: { type: String },
    robloxId: { type: String, unique: true, sparse: true },
    rut: { type: String, unique: true, sparse: true },
    firstNames: { type: [String], default: [] },
    lastNames: { type: [String], default: [] },
    nationality: { type: String },
    
    // Datos Profesionales y Rol
    profesion: { type: String, default: 'Civil' },
    roles: { type: [String], default: [] },
    
    // Economía y Bienes
    cuentas: [cuentaSchema],
    licencias: [licenciaSchema],
    
    // Historial Legal Existente
    antecedentes: [antecedenteSchema],
    multas: [multaSchema],
    
    // Meta
    ordenDetencion: { type: Boolean, default: false }
}, { timestamps: true });

// ===================================================================
// 2. MODELO DE VEHÍCULO
// ===================================================================

const historialEstadoSchema = new mongoose.Schema({
    estadoAnterior: { type: String },
    estadoNuevo: { type: String, required: true },
    oficialQueModifica: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

const vehiculoSchema = new mongoose.Schema({
    placa: { type: String, unique: true, uppercase: true, required: true },
    rut: { type: String, required: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    color: { type: String, default: '#ffffff' },
    imagen: { type: String },
    
    estado: { 
        type: String, 
        enum: ['Operativo', 'Robado', 'En Revisión', 'Dado de Baja', 'Inmovilizado', 'Embargado'], 
        default: 'Operativo' 
    },
    
    historialDeEstado: [historialEstadoSchema],
    encargoRobo: { type: Boolean, default: false },
}, { timestamps: true });

// ===================================================================
// 3. MODELOS PROPIOS DEL SISTEMA JUDICIAL
// ===================================================================

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, default: "civil" },
});

// CAUSAS (Expedientes)
const causeSchema = new mongoose.Schema({
    caratula: { type: String, required: true },
    ruc: { type: String, required: true },
    rit: { type: String },
    
    // CAMPOS RECUPERADOS
    origen: { type: String, default: "Fiscalía" },
    materia: { type: String, default: "Penal" },
    
    descripcion: { type: String, required: true },
    estado: { type: String, default: "investigacion" },
    prioridad: { type: String, default: "normal" },
    imputadoRut: { type: String, required: true },
    fiscalId: { type: String },
    juezId: { type: String },
    isDeleted: { type: Boolean, default: false },
    evidencia: [{ 
        tipo: String, 
        url: String, 
        descripcion: String, 
        fecha: { type: Date, default: Date.now } 
    }],
}, { timestamps: true });

// ÓRDENES JUDICIALES
const warrantSchema = new mongoose.Schema({
    causeId: { type: String, required: true },
    type: { type: String, required: true },
    target: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: "pendiente" },
    requestedBy: { type: String, required: true },
    signedBy: { type: String },
    rejectionReason: { type: String },
    signedAt: { type: Date },
}, { timestamps: true });

// INCAUTACIONES (Recuperado)
const confiscationSchema = new mongoose.Schema({
  causeId: { type: String, required: true },
  descripcion: { type: String, required: true },
  items: { type: String, required: true },
  ubicacion: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// CITACIONES (Recuperado)
const citationSchema = new mongoose.Schema({
  causeId: { type: String, required: true },
  citadoRut: { type: String, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  lugar: { type: String, required: true },
  motivo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// EXPORTS
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export const CitizenModel = mongoose.models.Cedula || mongoose.model("Cedula", cedulaSchema);
export const VehicleModel = mongoose.models.Vehiculo || mongoose.model("Vehiculo", vehiculoSchema);
export const CauseModel = mongoose.models.Cause || mongoose.model("Cause", causeSchema);
export const WarrantModel = mongoose.models.Warrant || mongoose.model("Warrant", warrantSchema);
// Añadidos los faltantes:
export const ConfiscationModel = mongoose.models.Confiscation || mongoose.model("Confiscation", confiscationSchema);
export const CitationModel = mongoose.models.Citation || mongoose.model("Citation", citationSchema);
