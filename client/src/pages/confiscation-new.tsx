import { useLocation, Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { insertConfiscationSchema, type InsertConfiscation, type Cause } from "@shared/schema";
import { ArrowLeft, Package, Scale, Loader2 } from "lucide-react";

export default function ConfiscationNewPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: causes } = useQuery<Cause[]>({
    queryKey: ["/api/causes"],
  });

  const activeCauses = causes?.filter((c) => c.estado === "activa" || c.estado === "pendiente") || [];

  const form = useForm<InsertConfiscation>({
    resolver: zodResolver(insertConfiscationSchema),
    defaultValues: {
      causeId: "",
      descripcion: "",
      items: "",
      ubicacion: "",
    },
  });

  const createConfiscation = useMutation({
    mutationFn: async (data: InsertConfiscation) => {
      const response = await apiRequest("POST", "/api/confiscations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/confiscations"] });
      toast({
        title: "Incautación registrada",
        description: "La incautación ha sido registrada exitosamente.",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error al registrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertConfiscation) => {
    createConfiscation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Panel
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Generar Incautación
          </h1>
          <p className="text-muted-foreground">
            Registre una incautación de bienes vinculada a una causa judicial.
          </p>
        </div>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Acta de Incautación
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
                <FormField
                  control={form.control}
                  name="causeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        Causa Asociada <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="h-12"
                            data-testid="select-causa"
                          >
                            <SelectValue placeholder="Seleccione una causa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeCauses.length > 0 ? (
                            activeCauses.map((cause) => (
                              <SelectItem key={cause.id} value={cause.id}>
                                <span className="font-mono">{cause.ruc}</span>
                                {cause.rit && (
                                  <span className="text-muted-foreground ml-2">
                                    - {cause.rit}
                                  </span>
                                )}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No hay causas activas
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Seleccione la causa a la que se vincula esta incautación
                      </FormDescription>
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
                          placeholder="Describa las circunstancias de la incautación..."
                          className="min-h-[100px] resize-none"
                          {...field}
                          data-testid="textarea-descripcion"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        Items Incautados <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Liste los bienes incautados (uno por línea o separados por comas)..."
                          className="min-h-[120px] resize-none font-mono text-sm"
                          {...field}
                          data-testid="textarea-items"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Detalle cada ítem incautado con su descripción
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ubicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        Ubicación
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Lugar donde se realizó la incautación"
                          className="h-12"
                          {...field}
                          data-testid="input-ubicacion"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Dirección o ubicación del operativo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
                  <Link href="/dashboard">
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
                    disabled={createConfiscation.isPending}
                    data-testid="button-submit"
                  >
                    {createConfiscation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        Registrar Incautación
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
