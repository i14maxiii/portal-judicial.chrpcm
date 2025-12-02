import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Shield, Hash, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
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
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
          <div className="text-center py-16">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No autenticado</h3>
            <p className="text-muted-foreground">
              Debe iniciar sesión para ver su perfil.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Información de su cuenta y datos personales.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={
                    user.avatar
                      ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=256`
                      : undefined
                  }
                  alt={user.username}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold mb-2">{user.username}</h2>
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

            <Separator className="my-8" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Nombre de Usuario
                  </p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Discord ID
                  </p>
                  <p className="font-mono text-sm">{user.discordId}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Rol en el Sistema
                  </p>
                  <p className="font-medium">
                    {user.role === "admin"
                      ? "Administrador del Sistema"
                      : "Funcionario Judicial"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    ID de Sesión
                  </p>
                  <p className="font-mono text-sm truncate max-w-[180px]">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Información del Rol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              {user.role === "admin" ? (
                <div>
                  <p className="font-medium mb-2">Permisos de Administrador</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Gestión completa de causas judiciales</li>
                    <li>Acceso a la papelera y restauración de registros</li>
                    <li>Eliminación permanente de causas</li>
                    <li>Administración de usuarios del sistema</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-2">Permisos de Funcionario</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Consulta y búsqueda de causas</li>
                    <li>Creación de nuevas causas</li>
                    <li>Emisión de citaciones judiciales</li>
                    <li>Registro de incautaciones</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
