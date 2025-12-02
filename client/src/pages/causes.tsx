import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  FileText,
  Filter,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import type { Cause } from "@shared/schema";

export default function CausesPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: causes, isLoading } = useQuery<Cause[]>({
    queryKey: ["/api/causes"],
  });

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      activa: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      pendiente: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      cerrada: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
      archivada: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
    return statusStyles[status] || statusStyles.activa;
  };

  const filteredCauses = causes?.filter((cause) => {
    const matchesStatus = filterStatus === "all" || cause.estado === filterStatus;
    const matchesSearch =
      !searchQuery ||
      cause.ruc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cause.rit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cause.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Causas Judiciales
            </h1>
            <p className="text-muted-foreground">
              Gestione y consulte las causas registradas en el sistema.
            </p>
          </div>
          <Link href="/causas/nueva">
            <Button data-testid="button-new-cause">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Causa
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por RUC, RIT o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-filter-search"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40" data-testid="select-filter-status">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="cerrada">Cerrada</SelectItem>
                    <SelectItem value="archivada">Archivada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredCauses && filteredCauses.length > 0 ? (
          <div className="space-y-4">
            {filteredCauses.map((cause) => (
              <Link key={cause.id} href={`/causas/${cause.id}`}>
                <Card
                  className="group cursor-pointer hover-elevate transition-all duration-200"
                  data-testid={`card-cause-${cause.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold font-mono text-lg tracking-wider">
                              {cause.ruc}
                            </h3>
                            {cause.rit && (
                              <span className="text-sm text-muted-foreground font-mono">
                                / RIT: {cause.rit}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                            {cause.descripcion}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusBadge(cause.estado)}>
                          {cause.estado.charAt(0).toUpperCase() +
                            cause.estado.slice(1)}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">Imputado:</span>
                        <span className="font-mono ml-2">{cause.imputadoRut}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(cause.createdAt).toLocaleDateString("es-CL")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay causas</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterStatus !== "all"
                ? "No se encontraron causas con los filtros aplicados."
                : "Aún no hay causas registradas en el sistema."}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Link href="/causas/nueva">
                <Button data-testid="button-empty-new-cause">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Causa
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
