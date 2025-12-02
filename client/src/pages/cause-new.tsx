import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { insertCauseSchema, type InsertCause } from "@shared/schema";
import { ArrowLeft, FileText, Scale, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function CauseNewPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

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

  const createCause = useMutation({
    mutationFn: async (data: InsertCause) => {
      const response = await apiRequest("POST", "/api/causes", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes"] });
      toast({
        title: "Causa creada",
        description: "La causa ha sido registrada exitosamente.",
      });
      navigate("/causas");
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear causa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCause) => {
    createCause.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <Link href="/causas">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Causas
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Ingresar Nueva Causa
          </h1>
          <p className="text-muted-foreground">
            Complete el formulario para registrar una nueva causa judicial.
          </p>
        </div>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Formulario de Ingreso</CardTitle>
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
                        RUT del Imputado <span className="text-destructive">*</span>
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
                        defaultValue={field.value}
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
                  <Link href="/causas">
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
                    disabled={createCause.isPending}
                    data-testid="button-submit"
                  >
                    {createCause.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Registrar Causa
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
