import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car, FileText, Users, Search, Plus, Package, Mail,
  FolderOpen, Trash2, ArrowRight, Gavel, AlertCircle
} from "lucide-react";
import type { Warrant } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const isJudge = user?.role === "juez" || user?.role === "admin";

  // Solo cargar si es juez para ahorrar recursos
  const { data: pendingWarrants } = useQuery<Warrant[]>({
    queryKey: ["/api/warrants/pending"],
    enabled: isJudge
  });

  const searchModules = [
    { icon: Car, title: "Búsqueda de Vehículos", description: "Buscar por patente", href: "/busqueda?tipo=vehiculos", color: "bg-blue-100 text-blue-700" },
    { icon: FileText, title: "Búsqueda de Causas", description: "Buscar por RUC o RIT", href: "/busqueda?tipo=causas", color: "bg-amber-100 text-amber-700" },
    { icon: Users, title: "Búsqueda de Personas", description: "Buscar por RUT", href: "/busqueda?tipo=personas", color: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        
        {/* HEADER DE BIENVENIDA */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h1 className="text-3xl font-serif font-bold text-[#1e293b] mb-1">
            Escritorio Judicial
          </h1>
          <p className="text-slate-500">
            Sesión iniciada como: <span className="font-bold text-[#C5A572] uppercase">{user?.role}</span> — {user?.username}
          </p>
        </div>

        {/* SECCIÓN EXCLUSIVA JUECES: BANDEJA DE ENTRADA */}
        {isJudge && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-[#1e293b]">
              <Gavel className="h-5 w-5 text-[#C5A572]" /> Despacho Judicial
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-[#C5A572] shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between">
                    Solicitudes Pendientes
                    {pendingWarrants && pendingWarrants.length > 0 && (
                      <Badge variant="destructive" className="animate-pulse">{pendingWarrants.length} NUEVAS</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingWarrants?.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No hay solicitudes pendientes de firma.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingWarrants?.slice(0, 3).map(w => (
                        <div key={w.id} className="bg-slate-50 p-3 rounded border border-slate-100 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm text-slate-800 uppercase">{w.type}</p>
                            <p className="text-xs text-slate-500">Objetivo: {w.target}</p>
                          </div>
                          <Link href={`/causas/${w.causeId}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs">Revisar</Button>
                          </Link>
                        </div>
                      ))}
                      {pendingWarrants && pendingWarrants.length > 3 && (
                        <p className="text-xs text-center text-slate-400 mt-2">Ver {pendingWarrants.length - 3} más...</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Estadísticas Rápidas (Dummy Data por ahora) */}
              <Card className="bg-[#1e293b] text-white border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg mb-4 text-[#C5A572]">Estado del Tribunal</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs opacity-60 uppercase">Causas Activas</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-xs opacity-60 uppercase">Juicios Hoy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* MÓDULOS DE BÚSQUEDA */}
        <div className="mb-10">
          <h2 className="text-xl font-serif font-bold mb-4 text-[#1e293b]">Módulos de Consulta</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {searchModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} href={module.href}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-t-4 border-t-transparent hover:border-t-[#C5A572]">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${module.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-slate-800">{module.title}</h3>
                      <p className="text-sm text-slate-500 mb-4">{module.description}</p>
                      <div className="mt-auto flex items-center text-sm font-bold text-[#1e293b] group-hover:text-[#C5A572] transition-colors">
                        Acceder <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div>
          <h2 className="text-xl font-serif font-bold mb-4 text-[#1e293b]">Gestión Administrativa</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/causas/nueva">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:border-[#C5A572] hover:text-[#C5A572]">
                <Plus className="h-6 w-6" />
                <span>Ingresar Causa</span>
              </Button>
            </Link>
            <Link href="/causas">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:border-[#C5A572] hover:text-[#C5A572]">
                <FolderOpen className="h-6 w-6" />
                <span>Mis Expedientes</span>
              </Button>
            </Link>
            {/* Otros botones placeholder */}
            <Button variant="outline" disabled className="w-full h-auto py-4 flex flex-col gap-2 opacity-50">
              <Package className="h-6 w-6" />
              <span>Incautaciones</span>
            </Button>
            <Button variant="outline" disabled className="w-full h-auto py-4 flex flex-col gap-2 opacity-50">
              <Mail className="h-6 w-6" />
              <span>Citaciones</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Icono auxiliar
function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
  )
}
