import { Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  FileText,
  Users,
  Search,
  Plus,
  Package,
  Mail,
  FolderOpen,
  Trash2,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const searchModules = [
    {
      icon: Car,
      title: "Búsqueda de Vehículos",
      description: "Buscar por patente del vehículo",
      href: "/busqueda?tipo=vehiculos",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: FileText,
      title: "Búsqueda de Causas",
      description: "Buscar por RUC o RIT",
      href: "/busqueda?tipo=causas",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      icon: Users,
      title: "Búsqueda de Personas",
      description: "Buscar por RUT o nombre",
      href: "/busqueda?tipo=personas",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  const actionModules = [
    {
      icon: Plus,
      title: "Ingresar Nueva Causa",
      description: "Crear una nueva causa judicial",
      href: "/causas/nueva",
      variant: "default" as const,
    },
    {
      icon: Package,
      title: "Generar Incautación",
      description: "Registrar una incautación de bienes",
      href: "/incautacion/nueva",
      variant: "outline" as const,
    },
    {
      icon: Mail,
      title: "Emitir Citación Judicial",
      description: "Generar una citación judicial oficial",
      href: "/citacion/nueva",
      variant: "outline" as const,
    },
  ];

  const quickLinks = [
    {
      icon: FolderOpen,
      title: "Mis Causas",
      description: "Ver causas asignadas",
      href: "/causas",
    },
    {
      icon: Trash2,
      title: "Papelera",
      description: "Causas eliminadas",
      href: "/papelera",
    },
    {
      icon: Search,
      title: "Búsqueda Avanzada",
      description: "Búsqueda completa",
      href: "/busqueda",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Panel Principal
          </h1>
          <p className="text-muted-foreground">
            Bienvenido, <span className="font-medium">{user?.username}</span>.
            Seleccione una opción para continuar.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            Módulos de Búsqueda
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} href={module.href}>
                  <Card
                    className="group cursor-pointer hover-elevate h-full transition-all duration-200"
                    data-testid={`card-search-${index}`}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg ${module.color}`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex-1">
                        {module.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary">
                        Buscar
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-muted-foreground" />
            Acciones Rápidas
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {actionModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} href={module.href}>
                  <Card
                    className="group cursor-pointer hover-elevate h-full transition-all duration-200"
                    data-testid={`card-action-${index}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <Button
                          variant={module.variant}
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Crear
                        </Button>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {module.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            Accesos Directos
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link key={index} href={link.href}>
                  <Card
                    className="group cursor-pointer hover-elevate transition-all duration-200"
                    data-testid={`card-quick-${index}`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {link.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {link.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
