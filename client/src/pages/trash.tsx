import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileText,
  Loader2,
} from "lucide-react";

export default function TrashPage() {
  const { toast } = useToast();

  const { data: deletedCauses, isLoading } = useQuery<Cause[]>({
    queryKey: ["/api/causes/trash"],
  });

  const restoreCause = useMutation({
    mutationFn: async (causeId: string) => {
      const response = await apiRequest("POST", `/api/causes/${causeId}/restore`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/causes/trash"] });
      toast({
        title: "Causa restaurada",
        description: "La causa ha sido restaurada exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al restaurar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const permanentDelete = useMutation({
    mutationFn: async (causeId: string) => {
      const response = await apiRequest(
        "DELETE",
        `/api/causes/${causeId}/permanent`
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes/trash"] });
      toast({
        title: "Causa eliminada permanentemente",
        description: "El registro ha sido eliminado de la base de datos.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-16 w-full mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Papelera
          </h1>
          <p className="text-muted-foreground">
            Causas eliminadas que pueden ser restauradas o eliminadas
            permanentemente.
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Advertencia
            </p>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
              Las causas eliminadas permanentemente no pueden ser recuperadas.
              Asegúrese de verificar antes de eliminar definitivamente.
            </p>
          </div>
        </div>

        {deletedCauses && deletedCauses.length > 0 ? (
          <div className="space-y-4">
            {deletedCauses.map((cause) => (
              <Card
                key={cause.id}
                className="opacity-75"
                data-testid={`card-trash-${cause.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold font-mono text-lg tracking-wider line-through">
                            {cause.ruc}
                          </h3>
                          {cause.rit && (
                            <span className="text-sm text-muted-foreground font-mono line-through">
                              / RIT: {cause.rit}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                          {cause.descripcion}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreCause.mutate(cause.id)}
                        disabled={restoreCause.isPending}
                        data-testid={`button-restore-${cause.id}`}
                      >
                        {restoreCause.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="mr-2 h-4 w-4" />
                        )}
                        Restaurar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            data-testid={`button-permanent-delete-${cause.id}`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Eliminar permanentemente?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El registro de
                              la causa{" "}
                              <span className="font-mono font-medium">
                                {cause.ruc}
                              </span>{" "}
                              será eliminado permanentemente de la base de
                              datos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-testid="button-cancel-permanent">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => permanentDelete.mutate(cause.id)}
                              disabled={permanentDelete.isPending}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-testid="button-confirm-permanent"
                            >
                              {permanentDelete.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Eliminar Permanentemente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {cause.deletedAt && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Eliminado el{" "}
                        {new Date(cause.deletedAt).toLocaleDateString("es-CL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Trash2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Papelera vacía</h3>
            <p className="text-muted-foreground">
              No hay causas eliminadas en la papelera.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
