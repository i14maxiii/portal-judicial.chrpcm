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
import { insertCitationSchema, type InsertCitation, type Cause } from "@shared/schema";
import { ArrowLeft, Mail, Scale, Loader2 } from "lucide-react";

export default function CitationNewPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: causes } = useQuery<Cause[]>({
    queryKey: ["/api/causes"],
  });

  const activeCauses = causes?.filter((c) => c.estado === "activa" || c.estado === "pendiente") || [];

  const form = useForm<InsertCitation>({
    resolver: zodResolver(insertCitationSchema),
    defaultValues: {
      causeId: "",
      citadoRut: "",
      fecha: "",
      hora: "",
      lugar: "",
      motivo: "",
    },
  });

  const createCitation = useMutation({
    mutationFn: async (data: InsertCitation) => {
      const response = await apiRequest("POST", "/api/citations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/citations"] });
      toast({
        title: "Citación emitida",
        description: "La citación judicial ha sido emitida exitosamente.",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error al emitir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCitation) => {
    createCitation.mutate(data);
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
            Emitir Citación Judicial
          </h1>
          <p className="text-muted-foreground">
            Genere una citación judicial oficial vinculada a una causa activa.
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
                  Citación Judicial
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="citadoRut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        RUT del Citado <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12.345.678-9"
                          className="font-mono h-12"
                          {...field}
                          data-testid="input-citado-rut"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium uppercase tracking-wide">
                          Fecha <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-12"
                            {...field}
                            data-testid="input-fecha"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hora"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium uppercase tracking-wide">
                          Hora <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            className="h-12"
                            {...field}
                            data-testid="input-hora"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="lugar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        Lugar de Comparecencia <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tribunal de Justicia, Sala 3"
                          className="h-12"
                          {...field}
                          data-testid="input-lugar"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Dirección o ubicación donde debe presentarse el citado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium uppercase tracking-wide">
                        Motivo de la Citación <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa el motivo de la citación..."
                          className="min-h-[100px] resize-none"
                          {...field}
                          data-testid="textarea-motivo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    <strong>Nota:</strong> La citación judicial tiene carácter
                    obligatorio. El incumplimiento puede generar consecuencias
                    legales dentro del contexto de RolePlay.
                  </p>
                </div>

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
                    disabled={createCitation.isPending}
                    data-testid="button-submit"
                  >
                    {createCitation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Emitiendo...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Emitir Citación
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
