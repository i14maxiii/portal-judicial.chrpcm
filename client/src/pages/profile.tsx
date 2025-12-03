import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Citizen } from "@shared/schema";
import { User, CreditCard, ShieldCheck, MapPin } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();


  
  // Para este ejemplo, usaremos los datos de sesión que ya tenemos enriquecidos
  const citizenData = user; 

  if (!citizenData) {
    return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        
        <h1 className="text-3xl font-serif font-bold text-[#1e293b] mb-6">Mi Identidad Digital</h1>

        <Card className="border-t-4 border-t-[#C5A572] shadow-md overflow-hidden">
          <div className="bg-[#1e293b] h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={user?.avatar || undefined} />
                <AvatarFallback className="text-4xl bg-slate-200 text-slate-500">
                  {user?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <CardContent className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{user?.username}</h2>
                <p className="text-slate-500 flex items-center gap-2 mt-1">
                  <ShieldCheck className="h-4 w-4 text-[#C5A572]" /> 
                  Ciudadano Verificado
                </p>
              </div>
              <Badge variant="outline" className="px-3 py-1 border-slate-300 text-slate-600">
                {user?.role?.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-100">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Identificador Digital</p>
                    <p className="font-mono text-sm">{user?.discordId}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-100">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Nacionalidad</p>
                    <p className="font-medium">Chilena</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 italic">
                Documento generado por el Sistema Unificado de Justicia.
                Válido para trámites internos.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
