import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { type Express } from "express";
import { storage } from "./storage";

// --- CONFIGURACIÓN DE ROLES ---
// Aquí ponemos los IDs que me diste.
// El sistema revisará si el usuario tiene alguno de estos roles en Discord.
const DISCORD_ROLES_MAP = {
  juez: [
    "1326535548797583421", // Juez
    "1411570917267607613"  // Presidente de la corte
  ],
  fiscal: [
    "1408642405007364157", // Fiscal Preferente
    "1408642519650013298", // Fiscal Adjunto
    "1326534543846543410", // Fiscal Regional
    "1326534442394845215"  // Fiscal Nacional
  ]
};

// Función auxiliar para obtener los roles reales desde la API de Discord
async function fetchUserDiscordRoles(userId: string): Promise<string[]> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) {
    console.warn("⚠️ Faltan DISCORD_GUILD_ID o DISCORD_BOT_TOKEN. No se pueden sincronizar roles.");
    return [];
  }

  try {
    // Consultamos al servidor de Discord: "Dame los datos de este miembro"
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
      headers: {
        Authorization: `Bot ${botToken}`
      }
    });

    if (!response.ok) {
      console.error(`Error al obtener roles de Discord: ${response.statusText}`);
      return [];
    }

    const memberData = await response.json();
    return memberData.roles || []; // Devolvemos la lista de IDs de roles que tiene el usuario
  } catch (error) {
    console.error("Error de conexión con Discord API:", error);
    return [];
  }
}

export function setupAuth(app: Express) {
  // 1. Serialización
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // 2. Deserialización
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // 3. Configuración de la estrategia
  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    callbackURL: process.env.DISCORD_REDIRECT_URI || "https://portal-judicial-chrpcm.onrender.com/auth/discord/callback",
    scope: ['identify', 'email']
  }, async (
    accessToken: string, 
    refreshToken: string, 
    profile: any,
    done: (err: any, user?: any) => void
  ) => {
    try {
      if (!profile.id || !profile.username) {
        return done(new Error("Datos de perfil de Discord incompletos"));
      }

      // --- SINCRONIZACIÓN DE ROLES ---
      // 1. Obtenemos los roles que el usuario tiene en el servidor
      const userDiscordRoles = await fetchUserDiscordRoles(profile.id);
      
      // 2. Determinamos qué rol le corresponde en la web
      let determinedRole = "civil"; // Por defecto

      // Revisamos si tiene algún rol de Juez
      const esJuez = userDiscordRoles.some(id => DISCORD_ROLES_MAP.juez.includes(id));
      // Revisamos si tiene algún rol de Fiscal
      const esFiscal = userDiscordRoles.some(id => DISCORD_ROLES_MAP.fiscal.includes(id));

      if (esJuez) {
        determinedRole = "juez";
      } else if (esFiscal) {
        determinedRole = "fiscal";
      }

      // IMPORTANTE: Si eres tú (o un admin hardcodeado), puedes forzar admin aquí si quieres
      // if (profile.id === "TU_ID_DE_DISCORD") determinedRole = "admin";

      // --- GUARDADO EN BASE DE DATOS ---
      let user = await storage.getUserByDiscordId(profile.id);
      
      if (!user) {
        // Crear usuario nuevo con el rol detectado
        user = await storage.createUser({
          discordId: profile.id,
          username: profile.username,
          avatar: profile.avatar || undefined,
          role: determinedRole as any 
        });
      } else {
        // Actualizar usuario existente (Nombre, Avatar y ROL)
        // Esto es clave: cada vez que entras, actualiza tu rol según Discord
        user = await storage.updateUser(user.id, {
            username: profile.username,
            avatar: profile.avatar || undefined,
            role: determinedRole as any 
        });
      }
      return done(null, user);
    } catch (err) {
      console.error("Discord Auth Error:", err);
      return done(err, undefined);
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}
