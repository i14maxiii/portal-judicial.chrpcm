import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Cause } from "@shared/schema";
import {
  FileText,
  User,
  Scale,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function BackgroundPage() {
  const { user, isLoading: userLoading } = useAuth();

  const { data: causes, isLoading: causesLoading } = useQuery<Cause[]>({
    queryKey: ["/api/causes"],
  });

  const isLoading = userLoading || causesLoading;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      activa: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      pendiente: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      cerrada: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
      archivada: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
    return statusStyles[status] || statusStyles.activa;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
          <div className="text-center py-16">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No autenticado</h3>
            <p className="text-muted-foreground">
              Debe iniciar sesión para ver su hoja de vida.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeCases = causes?.filter((c) => c.estado === "activa") || [];
  const closedCases = causes?.filter((c) => c.estado === "cerrada") || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Hoja de Vida
          </h1>
          <p className="text-muted-foreground">
            Resumen de antecedentes y actividad judicial del funcionario.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Documento Oficial - Hoja de Vida
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Poder Judicial - Ministerio Público de Chile
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              <Avatar className="h-20 w-20 flex-shrink-0">
                <AvatarImage
                  src={
                    user.avatar
                      ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=256`
                      : undefined
                  }
                  alt={user.username}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{user.username}</h2>
                <p className="text-muted-foreground mb-3">
                  {user.role === "admin"
                    ? "Administrador del Sistema Judicial"
                    : "Funcionario del Ministerio Público"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-mono">
                    ID: {user.discordId}
                  </Badge>
                  <Badge
                    className={
                      user.role === "admin"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-primary/10 text-primary"
                    }
                  >
                    {user.role === "admin" ? "Administrador" : "Funcionario"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-semibold">Causas Activas</h3>
                </div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {activeCases.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Causas actualmente en proceso
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-500/5 border border-slate-500/10">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold">Causas Cerradas</h3>
                </div>
                <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">
                  {closedCases.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Causas finalizadas
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Historial de Causas Recientes
              </h3>

              {causes && causes.length > 0 ? (
                <div className="space-y-3">
                  {causes.slice(0, 5).map((cause) => (
                    <div
                      key={cause.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-mono font-medium">{cause.ruc}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                            {cause.descripcion}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(cause.estado)}>
                        {cause.estado.charAt(0).toUpperCase() +
                          cause.estado.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/50 rounded-lg border border-border">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No hay causas registradas
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Documento generado automáticamente por el Portal Judicial - Fiscalía
          RP
          <br />
          Fecha de generación:{" "}
          {new Date().toLocaleDateString("es-CL", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
