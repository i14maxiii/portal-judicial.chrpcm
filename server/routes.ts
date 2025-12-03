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
  insertWarrantSchema,
} from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "No autenticado" });
}

function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "No autenticado" });
    
    const user = req.user as any;
    if (user.role === "admin" || roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: "No tienes permisos para esta acción" });
    }
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "portal-judicial-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  setupAuth(app);

  // AUTH
  app.get("/api/auth/discord", passport.authenticate("discord"));
  
  app.get("/auth/discord/callback", 
    passport.authenticate("discord", { 
      failureRedirect: "/?error=auth_failed",
      successRedirect: "/dashboard" 
    })
  );

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }
    res.json(req.user);
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Sesión cerrada" });
    });
  });

  // --- CAUSAS ---
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
    if (!cause) return res.status(404).json({ message: "Causa no encontrada" });
    res.json(cause);
  });

  app.post("/api/causes", requireAuth, async (req, res) => {
    const result = insertCauseSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
    
    const user = req.user as any;
    const causeData = { ...result.data, fiscalId: user.id };
    
    const cause = await storage.createCause(causeData);
    res.status(201).json(cause);
  });

  app.put("/api/causes/:id", requireAuth, async (req, res) => {
    const result = insertCauseSchema.partial().safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
    const cause = await storage.updateCause(req.params.id, result.data);
    if (!cause) return res.status(404).json({ message: "Causa no encontrada" });
    res.json(cause);
  });

  app.delete("/api/causes/:id", requireAuth, async (req, res) => {
    const cause = await storage.softDeleteCause(req.params.id);
    if (!cause) return res.status(404).json({ message: "Causa no encontrada" });
    res.json({ message: "Causa movida a papelera", cause });
  });

  app.post("/api/causes/:id/restore", requireAuth, async (req, res) => {
    const cause = await storage.restoreCause(req.params.id);
    if (!cause) return res.status(404).json({ message: "Causa no encontrada en papelera" });
    res.json({ message: "Causa restaurada", cause });
  });

  app.delete("/api/causes/:id/permanent", requireAuth, async (req, res) => {
    const deleted = await storage.permanentDeleteCause(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Causa no encontrada en papelera" });
    res.json({ message: "Causa eliminada permanentemente" });
  });

  // --- WARRANTS (ÓRDENES JUDICIALES) ---
  
  app.get("/api/warrants/cause/:causeId", requireAuth, async (req, res) => {
    const warrants = await storage.getWarrantsByCause(req.params.causeId);
    res.json(warrants);
  });

  app.get("/api/warrants/pending", requireRole(["juez", "admin"]), async (req, res) => {
    const warrants = await storage.getPendingWarrants();
    res.json(warrants);
  });

  // CORRECCIÓN AQUÍ: Usamos .omit() para no exigir 'requestedBy' al cliente
  app.post("/api/warrants", requireRole(["fiscal", "juez", "admin"]), async (req, res) => {
    // Validamos todo MENOS requestedBy (porque lo ponemos nosotros)
    const result = insertWarrantSchema.omit({ requestedBy: true }).safeParse(req.body);
    
    if (!result.success) {
        console.error("Error validación warrants:", result.error);
        return res.status(400).json({ message: result.error.errors[0].message });
    }
    
    const user = req.user as any;
    // Aquí inyectamos el nombre del usuario
    const warrantData = { 
        ...result.data, 
        requestedBy: user.username // O user.discordId si prefieres
    }; 
    
    const warrant = await storage.createWarrant(warrantData);
    res.status(201).json(warrant);
  });

  app.patch("/api/warrants/:id/sign", requireRole(["juez", "admin"]), async (req, res) => {
    const user = req.user as any;
    const warrant = await storage.updateWarrantStatus(req.params.id, "aprobada", user.username);
    if (!warrant) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(warrant);
  });

  app.patch("/api/warrants/:id/reject", requireRole(["juez", "admin"]), async (req, res) => {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Debe indicar motivo de rechazo" });
    
    const warrant = await storage.updateWarrantStatus(req.params.id, "rechazada", undefined, reason);
    if (!warrant) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(warrant);
  });

  // --- BÚSQUEDA ---
  app.get("/api/search/:type/:query", requireAuth, async (req, res) => {
    const { type, query } = req.params;
    if (query.length < 2) return res.json({ vehicles: [], citizens: [], causes: [] });
    
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

  // --- OTROS CRUDs ---
  app.get("/api/citizens", requireAuth, async (req, res) => {
    const citizens = await storage.getAllCitizens();
    res.json(citizens);
  });

  app.post("/api/citizens", requireAuth, async (req, res) => {
    const result = insertCitizenSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
    const citizen = await storage.createCitizen(result.data);
    res.status(201).json(citizen);
  });

  app.get("/api/vehicles", requireAuth, async (req, res) => {
    const vehicles = await storage.getAllVehicles();
    res.json(vehicles);
  });

  app.post("/api/vehicles", requireAuth, async (req, res) => {
    const result = insertVehicleSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
    const vehicle = await storage.createVehicle(result.data);
    res.status(201).json(vehicle);
  });

  app.post("/api/confiscations", requireAuth, async (req, res) => {
    const result = insertConfiscationSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
    const confiscation = await storage.createConfiscation(result.data);
    res.status(201).json(confiscation);
  });

  app.get("/api/confiscations/:causeId", requireAuth, async (req, res) => {
    const confiscations = await storage.getConfiscationsByCauseId(req.params.causeId);
    res.json(confiscations);
  });

  app.post("/api/citations", requireAuth, async (req, res) => {
    const result = insertCitationSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
    const citation = await storage.createCitation(result.data);
    res.status(201).json(citation);
  });

  app.get("/api/citations/:causeId", requireAuth, async (req, res) => {
    const citations = await storage.getCitationsByCauseId(req.params.causeId);
    res.json(citations);
  });

  return httpServer;
}
