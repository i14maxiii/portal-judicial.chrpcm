import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "passport";
import { storage } from "./storage";
import { setupAuth } from "./discord-auth";
import {
  insertCauseSchema,
  insertCitizenSchema,
  insertVehicleSchema,
  insertConfiscationSchema,
  insertCitationSchema,
} from "@shared/schema";

// Extender tipos de sesión
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Middleware para proteger rutas
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "No autenticado" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Configuración de Sesión
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "portal-judicial-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production", // true solo en HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      },
    })
  );

  // 2. Inicializar Autenticación (Passport)
  setupAuth(app);

  // --- RUTAS DE AUTH (DISCORD) ---

  // Iniciar login: Redirige a Discord
  app.get("/api/auth/discord", passport.authenticate("discord"));

  // Callback: Discord nos devuelve al usuario aquí
  app.get("/api/auth/callback", 
    passport.authenticate("discord", { 
      failureRedirect: "/?error=auth_failed",
      successRedirect: "/dashboard" 
    })
  );

  // Obtener usuario actual (para el frontend)
  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }
    res.json(req.user);
  });

  // Cerrar sesión
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Sesión cerrada" });
    });
  });

  // --- API DEL PORTAL (PROTEGIDAS) ---

  app.get("/api/causes", requireAuth, async (req, res) => {
    const causes = await storage.getAllCauses();
    res.json(causes);
  });

  app.get("/api/causes/trash", requireAuth, async (req, res) => {
    const deletedCauses = await storage.getDeletedCauses();
    res.json(deletedCauses);
  });

  app.get("/api/causes/:id", requireAuth, async (req, res) => {
    const cause = await storage.getCause(req.params.id);
    if (!cause) {
      return res.status(404).json({ message: "Causa no encontrada" });
    }
    res.json(cause);
  });

  app.post("/api/causes", requireAuth, async (req, res) => {
    const result = insertCauseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
    const cause = await storage.createCause(result.data);
    res.status(201).json(cause);
  });

  app.put("/api/causes/:id", requireAuth, async (req, res) => {
    const result = insertCauseSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
    const cause = await storage.updateCause(req.params.id, result.data);
    if (!cause) {
      return res.status(404).json({ message: "Causa no encontrada" });
    }
    res.json(cause);
  });

  app.delete("/api/causes/:id", requireAuth, async (req, res) => {
    const cause = await storage.softDeleteCause(req.params.id);
    if (!cause) {
      return res.status(404).json({ message: "Causa no encontrada" });
    }
    res.json({ message: "Causa movida a papelera", cause });
  });

  app.post("/api/causes/:id/restore", requireAuth, async (req, res) => {
    const cause = await storage.restoreCause(req.params.id);
    if (!cause) {
      return res.status(404).json({ message: "Causa no encontrada en papelera" });
    }
    res.json({ message: "Causa restaurada", cause });
  });

  app.delete("/api/causes/:id/permanent", requireAuth, async (req, res) => {
    const deleted = await storage.permanentDeleteCause(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Causa no encontrada en papelera" });
    }
    res.json({ message: "Causa eliminada permanentemente" });
  });

  app.get("/api/search/:type/:query", requireAuth, async (req, res) => {
    const { type, query } = req.params;
    if (query.length < 2) {
      return res.json({ vehicles: [], citizens: [], causes: [] });
    }
    switch (type) {
      case "vehiculos": {
        const vehicles = await storage.searchVehicles(query);
        return res.json({ vehicles });
      }
      case "personas": {
        const citizens = await storage.searchCitizens(query);
        return res.json({ citizens });
      }
      case "causas": {
        const causes = await storage.searchCauses(query);
        return res.json({ causes });
      }
      default:
        return res.status(400).json({ message: "Tipo de búsqueda inválido" });
    }
  });

  app.get("/api/citizens", requireAuth, async (req, res) => {
    const citizens = await storage.getAllCitizens();
    res.json(citizens);
  });

  app.post("/api/citizens", requireAuth, async (req, res) => {
    const result = insertCitizenSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
    const citizen = await storage.createCitizen(result.data);
    res.status(201).json(citizen);
  });

  app.get("/api/vehicles", requireAuth, async (req, res) => {
    const vehicles = await storage.getAllVehicles();
    res.json(vehicles);
  });

  app.post("/api/vehicles", requireAuth, async (req, res) => {
    const result = insertVehicleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
    const vehicle = await storage.createVehicle(result.data);
    res.status(201).json(vehicle);
  });

  app.post("/api/confiscations", requireAuth, async (req, res) => {
    const result = insertConfiscationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
    const confiscation = await storage.createConfiscation(result.data);
    res.status(201).json(confiscation);
  });

  app.get("/api/confiscations/:causeId", requireAuth, async (req, res) => {
    const confiscations = await storage.getConfiscationsByCauseId(req.params.causeId);
    res.json(confiscations);
  });

  app.post("/api/citations", requireAuth, async (req, res) => {
    const result = insertCitationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
    const citation = await storage.createCitation(result.data);
    res.status(201).json(citation);
  });

  app.get("/api/citations/:causeId", requireAuth, async (req, res) => {
    const citations = await storage.getCitationsByCauseId(req.params.causeId);
    res.json(citations);
  });

  return httpServer;
}