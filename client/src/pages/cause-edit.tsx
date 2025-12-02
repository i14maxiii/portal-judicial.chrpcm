import { useRoute, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertCauseSchema, type InsertCause, type Cause } from "@shared/schema";
import { ArrowLeft, FileText, Scale, Loader2 } from "lucide-react";

export default function CauseEditPage() {
  const [, params] = useRoute("/causas/:id/editar");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const causeId = params?.id;

  const { data: cause, isLoading } = useQuery<Cause>({
    queryKey: ["/api/causes", causeId],
    enabled: !!causeId,
  });

  const form = useForm<InsertCause>({
    resolver: zodResolver(insertCauseSchema),
    defaultValues: {
      ruc: "",
      rit: "",
      descripcion: "",
      estado: "activa",
      imputadoRut: "",
      fiscalId: "",
    },
  });

  useEffect(() => {
    if (cause) {
      form.reset({
        ruc: cause.ruc,
        rit: cause.rit || "",
        descripcion: cause.descripcion,
        estado: cause.estado,
        imputadoRut: cause.imputadoRut,
        fiscalId: cause.fiscalId || "",
      });
    }
  }, [cause, form]);

  const updateCause = useMutation({
    mutationFn: async (data: InsertCause) => {
      const response = await apiRequest("PUT", `/api/causes/${causeId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/causes", causeId] });
      toast({
        title: "Causa actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
      navigate(`/causas/${causeId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCause) => {
    updateCause.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
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
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
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
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Causa no encontrada</h3>
            <p className="text-muted-foreground mb-6">
              La causa que desea editar no existe.
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
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <Link href={`/causas/${causeId}`}>
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Detalles
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Editar Causa
          </h1>
          <p className="text-muted-foreground font-mono">{cause.ruc}</p>
        </div>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Modificación de Causa
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Poder Judicial - Ministerio Público
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ruc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium uppercase tracking-wide">
                          RUC <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2300123456-7"
                            className="font-mono h-12"
                            {...field}
                            data-testid="input-ruc"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Rol Único de Causa
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium uppercase tracking-wide">
                          RIT
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="O-123-2024"
                            className="font-mono h-12"
                            {...field}
                            data-testid="input-rit"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Rol Interno del Tribunal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="imputadoRut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        RUT del Imputado{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12.345.678-9"
                          className="font-mono h-12"
                          {...field}
                          data-testid="input-imputado-rut"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        Estado de la Causa
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="h-12"
                            data-testid="select-estado"
                          >
                            <SelectValue placeholder="Seleccione un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="activa">Activa</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="cerrada">Cerrada</SelectItem>
                          <SelectItem value="archivada">Archivada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        Descripción <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detalle los hechos y circunstancias de la causa..."
                          className="min-h-[120px] resize-none"
                          {...field}
                          data-testid="textarea-descripcion"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Proporcione una descripción detallada de los hechos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
                  <Link href={`/causas/${causeId}`}>
                    <Button
                      type="button"
                      variant="outline"
                      data-testid="button-cancel"
                    >
                      Cancelar
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={updateCause.isPending}
                    data-testid="button-submit"
                  >
                    {updateCause.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
