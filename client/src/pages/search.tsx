import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Car,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { Citizen, Vehicle, Cause } from "@shared/schema";

type SearchType = "vehiculos" | "causas" | "personas";

export default function SearchPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const initialType = (params.get("tipo") as SearchType) || "vehiculos";

  const [activeTab, setActiveTab] = useState<SearchType>(initialType);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: results, isLoading, isFetching } = useQuery<{
    citizens?: Citizen[];
    vehicles?: Vehicle[];
    causes?: Cause[];
  }>({
    queryKey: ["/api/search", activeTab, searchTerm],
    enabled: searchTerm.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setSearchTerm(searchQuery.trim());
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "vehiculos":
        return "Ingrese la patente del vehículo (ej: ABCD12)";
      case "causas":
        return "Ingrese el RUC o RIT de la causa";
      case "personas":
        return "Ingrese RUT o nombre de la persona";
      default:
        return "Ingrese término de búsqueda";
    }
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

  const renderVehicleResults = (vehicles: Vehicle[]) => (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="hover-elevate" data-testid={`result-vehicle-${vehicle.id}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-mono text-lg tracking-wider">
                    {vehicle.patente}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.modelo}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Vehículo</Badge>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">RUT Propietario:</span>
                  <p className="font-mono font-medium">{vehicle.duenoRut}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCitizenResults = (citizens: Citizen[]) => (
    <div className="space-y-4">
      {citizens.map((citizen) => (
        <Card key={citizen.id} className="hover-elevate" data-testid={`result-citizen-${citizen.id}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{citizen.nombre}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    RUT: {citizen.rut}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Persona</Badge>
            </div>
            {citizen.antecedentes && (
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Antecedentes:</span>
                <p className="text-sm mt-1">{citizen.antecedentes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCauseResults = (causes: Cause[]) => (
    <div className="space-y-4">
      {causes.map((cause) => (
        <Card key={cause.id} className="hover-elevate" data-testid={`result-cause-${cause.id}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-mono text-lg tracking-wider">
                    {cause.ruc}
                  </h3>
                  {cause.rit && (
                    <p className="text-sm text-muted-foreground font-mono">
                      RIT: {cause.rit}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={getStatusBadge(cause.estado)}>
                {cause.estado.charAt(0).toUpperCase() + cause.estado.slice(1)}
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm mb-3">{cause.descripcion}</p>
              <div className="text-sm">
                <span className="text-muted-foreground">Imputado RUT:</span>
                <span className="font-mono ml-2">{cause.imputadoRut}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderResults = () => {
    if (!searchTerm) {
      return (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Realizar una búsqueda</h3>
          <p className="text-muted-foreground text-sm">
            Ingrese al menos 2 caracteres para comenzar la búsqueda
          </p>
        </div>
      );
    }

    if (isLoading || isFetching) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    const hasResults =
      (activeTab === "vehiculos" && results?.vehicles?.length) ||
      (activeTab === "personas" && results?.citizens?.length) ||
      (activeTab === "causas" && results?.causes?.length);

    if (!hasResults) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Sin resultados</h3>
          <p className="text-muted-foreground text-sm">
            No se encontraron resultados para "{searchTerm}"
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "vehiculos":
        return renderVehicleResults(results?.vehicles || []);
      case "personas":
        return renderCitizenResults(results?.citizens || []);
      case "causas":
        return renderCauseResults(results?.causes || []);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Búsqueda
          </h1>
          <p className="text-muted-foreground">
            Busque vehículos, causas o personas en el sistema judicial.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as SearchType);
            setSearchQuery("");
            setSearchTerm("");
          }}
        >
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger
              value="vehiculos"
              className="flex items-center gap-2"
              data-testid="tab-vehiculos"
            >
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Vehículos</span>
            </TabsTrigger>
            <TabsTrigger
              value="causas"
              className="flex items-center gap-2"
              data-testid="tab-causas"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Causas</span>
            </TabsTrigger>
            <TabsTrigger
              value="personas"
              className="flex items-center gap-2"
              data-testid="tab-personas"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Personas</span>
            </TabsTrigger>
          </TabsList>

          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={getPlaceholder()}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                    data-testid="input-search"
                  />
                </div>
                <Button type="submit" className="h-12 px-6" data-testid="button-search">
                  Buscar
                </Button>
              </form>
            </CardContent>
          </Card>

          <TabsContent value="vehiculos" className="mt-0">
            {renderResults()}
          </TabsContent>
          <TabsContent value="causas" className="mt-0">
            {renderResults()}
          </TabsContent>
          <TabsContent value="personas" className="mt-0">
            {renderResults()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
