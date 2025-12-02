import mongoose from 'mongoose';

export async function connectDB() {
  try {
    // Ahora busca MONGODB_URI (tu .env) o MONGO_URI (por si acaso)
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/portal-judicial';
    
    if (uri.includes("localhost")) {
        console.warn("⚠️ Advertencia: Intentando conectar a base de datos LOCAL.");
    }

    await mongoose.connect(uri);
    console.log('✅ [MongoDB] Conectado exitosamente');
  } catch (error) {
    console.error('❌ [MongoDB] Error de conexión:', error);
    process.exit(1);
  }
}