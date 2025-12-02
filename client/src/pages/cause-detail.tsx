import { useRoute, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Cause } from "@shared/schema";
import {
  ArrowLeft,
  FileText,
  Scale,
  Trash2,
  Edit,
  Calendar,
  User,
  Hash,
  Loader2,
} from "lucide-react";

export default function CauseDetailPage() {
  const [, params] = useRoute("/causas/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const causeId = params?.id;

  const { data: cause, isLoading } = useQuery<Cause>({
    queryKey: ["/api/causes", causeId],
    enabled: !!causeId,
  });

  const deleteCause = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/causes/${causeId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes"] });
      toast({
        title: "Causa eliminada",
        description: "La causa ha sido movida a la papelera.",
      });
      navigate("/causas");
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive",
      });
    },
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!cause) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Causa no encontrada</h3>
            <p className="text-muted-foreground mb-6">
              La causa solicitada no existe o ha sido eliminada.
            </p>
            <Link href="/causas">
              <Button data-testid="button-back-list">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Causas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <Link href="/causas">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Causas
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Scale className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-2xl font-mono tracking-wider">
                      {cause.ruc}
                    </CardTitle>
                    <Badge className={getStatusBadge(cause.estado)}>
                      {cause.estado.charAt(0).toUpperCase() +
                        cause.estado.slice(1)}
                    </Badge>
                  </div>
                  {cause.rit && (
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                      RIT: {cause.rit}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/causas/${cause.id}/editar`}>
                  <Button variant="outline" data-testid="button-edit">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" data-testid="button-delete">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Eliminar esta causa?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        La causa será movida a la papelera. Podrá restaurarla
                        posteriormente o eliminarla definitivamente desde la
                        sección de papelera.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-testid="button-cancel-delete">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteCause.mutate()}
                        disabled={deleteCause.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-testid="button-confirm-delete"
                      >
                        {deleteCause.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Mover a Papelera
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                  Descripción de los Hechos
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {cause.descripcion}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Información del Imputado
                  </h3>
                  <div className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          RUT del Imputado
                        </p>
                        <p className="font-mono font-medium">
                          {cause.imputadoRut}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Información del Registro
                  </h3>
                  <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          ID de Causa
                        </p>
                        <p className="font-mono text-sm">{cause.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Fecha de Registro
                        </p>
                        <p className="font-medium">
                          {new Date(cause.createdAt).toLocaleDateString(
                            "es-CL",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
