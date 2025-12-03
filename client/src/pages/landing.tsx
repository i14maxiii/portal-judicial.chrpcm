import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Scale,
  Search,
  FileText,
  ShieldAlert,
  Users,
  Building2,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      
      {/* HEADER INSTITUCIONAL */}
      <section className="relative bg-[#1e293b] text-white py-16 overflow-hidden border-b-4 border-[#C5A572] shadow-xl">
        {/* Fondo sutil abstracto, sin rejillas tech */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block p-4 rounded-full bg-white/10 mb-6 border border-white/20 backdrop-blur-sm">
            <Scale className="h-16 w-16 text-[#C5A572]" /> {/* Dorado */}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 tracking-wide">
            SISTEMA UNIFICADO DE JUSTICIA
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light tracking-widest uppercase mb-8">
            República de Chile [Roleplay]
          </p>

          <div className="max-w-2xl mx-auto bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur-md">
            <p className="text-sm text-gray-200 leading-relaxed font-sans">
              Plataforma oficial para la gestión de expedientes penales, causas civiles y 
              trámites del Ministerio Público. El acceso no autorizado a este sistema 
              constituye un delito federal bajo el Código Penal vigente.
            </p>
          </div>
        </div>
      </section>

      {/* ZONA DE TRÁMITES (GRID) */}
      <section className="flex-1 container mx-auto px-4 py-12 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* TARJETA 1: PÚBLICO */}
          <Card className="hover:shadow-lg transition-all border-t-4 border-t-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-serif">
                <Search className="h-5 w-5 text-blue-600" />
                Consulta Pública
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Acceso ciudadano para verificar estado de causas no reservadas y consulta de antecedentes públicos.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between group">
                  Buscar Causa (RUC/RIT) <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                </Button>
                <Button variant="outline" className="w-full justify-between group">
                  Certificado Antecedentes <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* TARJETA 2: FUNCIONARIOS (LOGIN) */}
          <Card className="hover:shadow-lg transition-all border-t-4 border-t-[#C5A572] relative overflow-hidden bg-slate-50">
            <div className="absolute top-0 right-0 p-2 bg-[#C5A572] text-[10px] font-bold text-slate-900 uppercase">
              Área Restringida
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-serif">
                <LockKeyhole className="h-5 w-5 text-[#C5A572]" />
                Acceso Funcionarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ingreso exclusivo para Fiscales, Jueces y personal administrativo mediante credenciales seguras.
              </p>
              <Button 
                onClick={login} 
                className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white font-serif"
              >
                Acceder a Intranet
              </Button>
            </CardContent>
          </Card>

          {/* TARJETA 3: SERVICIOS */}
          <Card className="hover:shadow-lg transition-all border-t-4 border-t-gray-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-serif">
                <Building2 className="h-5 w-5 text-gray-600" />
                Mesa de Partes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Canales de atención para abogados y civiles.
              </p>
              <div className="text-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldAlert className="h-4 w-4" /> <span>Denuncias Anónimas</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <FileText className="h-4 w-4" /> <span>Validación de Folios</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="h-4 w-4" /> <span>Directorio de Defensores</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* FOOTER BUROCRÁTICO */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <Scale className="h-6 w-6 mx-auto text-gray-400 mb-3" />
          <p className="text-sm font-serif text-gray-900 font-bold mb-1">
            SISTEMA UNIFICADO DE JUSTICIA
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
            Departamento de Informática Judicial
          </p>
          <Separator className="my-4 max-w-[200px] mx-auto" />
          <p className="text-[10px] text-gray-400 max-w-md mx-auto leading-normal">
            Este sistema es de uso exclusivo para fines de Roleplay en el servidor. 
            Cualquier similitud con sistemas reales es coincidencia. 
            Versión del Sistema: 2.5.0 (Build 2025)
          </p>
        </div>
      </footer>

    </div>
  );
}
