import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { type Express } from "express";
import { storage } from "./storage";

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
    profile: any, // <--- CAMBIO: Usamos 'any' para evitar conflictos de importación
    done: (err: any, user?: any) => void
  ) => {
    try {
      // Validar datos mínimos
      if (!profile.id || !profile.username) {
        return done(new Error("Datos de perfil de Discord incompletos"));
      }

      let user = await storage.getUserByDiscordId(profile.id);
      
      if (!user) {
        user = await storage.createUser({
          discordId: profile.id,
          username: profile.username,
          avatar: profile.avatar || undefined,
          role: "user" 
        });
      } else {
        user = await storage.updateUser(user.id, {
            username: profile.username,
            avatar: profile.avatar || undefined 
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
