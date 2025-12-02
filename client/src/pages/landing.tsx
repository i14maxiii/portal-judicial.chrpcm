import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Scale,
  Search,
  FileText,
  Shield,
  Users,
  Car,
  Gavel,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const { login } = useAuth();

  const services = [
    {
      icon: Search,
      title: "Búsqueda de Causas",
      description:
        "Consulte el estado de causas judiciales mediante RUC o RIT de forma rápida y segura.",
    },
    {
      icon: Users,
      title: "Consulta de Personas",
      description:
        "Acceda a información de ciudadanos registrados en el sistema mediante RUT o nombre.",
    },
    {
      icon: Car,
      title: "Búsqueda de Vehículos",
      description:
        "Verifique el registro de vehículos y su historial mediante el número de patente.",
    },
    {
      icon: FileText,
      title: "Gestión de Causas",
      description:
        "Ingrese, modifique y administre causas judiciales de manera eficiente.",
    },
    {
      icon: Gavel,
      title: "Citaciones Judiciales",
      description:
        "Emita citaciones judiciales electrónicas vinculadas a causas activas.",
    },
    {
      icon: Shield,
      title: "Certificados",
      description:
        "Genere certificados de antecedentes penales y hojas de vida del sistema.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZWMGg2djMwem0wIDMwaC02VjM2aDZ2MjR6Ii8+PHBhdGggZD0iTTMwIDM2SDB2LTZoMzB2NnptMzAgMEgzNnYtNmgzMHY2eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Scale className="h-12 w-12 md:h-16 md:w-16 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            Portal del Poder Judicial
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 mb-6">
            Ministerio Público
          </h2>

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Bienvenido al sistema de gestión judicial de la Fiscalía. Acceda a
            herramientas de búsqueda, administración de causas y generación de
            documentos oficiales.
          </p>

          <Button
            size="lg"
            onClick={login}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-base"
            data-testid="button-hero-login"
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Iniciar Sesión con Discord
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="mt-4 text-sm text-white/60">
            Acceso exclusivo para funcionarios autorizados
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Servicios Disponibles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              El Portal Judicial ofrece herramientas completas para la gestión
              eficiente de procesos judiciales y administrativos.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="group hover-elevate transition-all duration-200"
                  data-testid={`card-service-${index}`}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-card border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Portal Judicial</p>
                <p className="text-xs text-muted-foreground">
                  Fiscalía RP - Servidor de RolePlay
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Sistema de gestión judicial para uso exclusivo en entorno de
              RolePlay.
              <br />
              Este portal no representa a ninguna entidad gubernamental real.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
