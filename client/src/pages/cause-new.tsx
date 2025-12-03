import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCauseSchema, type InsertCause } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";

export default function CauseNewPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertCause>({
    resolver: zodResolver(insertCauseSchema),
    defaultValues: {
      caratula: "",
      ruc: "",
      rit: "",
      origen: "Fiscalía",
      materia: "Penal",
      descripcion: "",
      imputadoRut: "",
      estado: "investigacion",
      prioridad: "normal",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCause) => {
      const res = await apiRequest("POST", "/api/causes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes"] });
      toast({ title: "Causa creada", description: "Expediente ingresado correctamente." });
      navigate("/causas");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  function onSubmit(data: InsertCause) {
    mutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/causas">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
        </Link>

        <Card>
          <CardHeader className="border-b bg-white">
            <CardTitle className="text-2xl font-serif text-[#1e293b]">Ingresar Nuevo Expediente</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* 1. CABECERA DEL CASO */}
                <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-100">
                  <FormField
                    control={form.control}
                    name="caratula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700 text-lg">Carátula del Caso (Título)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Fiscalía vs Juan Pérez por Robo con Intimidación" {...field} className="text-lg bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="origen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origen</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fiscalía">Fiscalía</SelectItem>
                              <SelectItem value="Juzgado de Garantía">Juzgado de Garantía</SelectItem>
                              <SelectItem value="Tribunal Oral">Tribunal Oral</SelectItem>
                              <SelectItem value="Querella Civil">Querella Civil</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="materia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Materia</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Penal">Penal</SelectItem>
                              <SelectItem value="Civil">Civil</SelectItem>
                              <SelectItem value="Familia">Familia</SelectItem>
                              <SelectItem value="Laboral">Laboral</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prioridad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prioridad</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="alta">Alta</SelectItem>
                              <SelectItem value="urgente">Urgente 🚨</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* 2. IDENTIFICADORES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ruc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUC (Rol Único de Causa)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 2400123456-7" {...field} className="font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RIT (Rol Interno Tribunal)</FormLabel>
                        <FormControl>
                          <Input placeholder="Opcional" {...field} value={field.value || ''} className="font-mono" />
                        </FormControl>
                        <FormDescription>Solo si la causa ya está judicializada</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 3. ESTADO E IMPUTADO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado Inicial</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="investigacion">En Investigación</SelectItem>
                            <SelectItem value="judicializada">Judicializada</SelectItem>
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
                    name="imputadoRut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUT Imputado</FormLabel>
                        <FormControl>
                          <Input placeholder="12.345.678-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 4. DESCRIPCIÓN */}
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Hechos del Caso</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Relate detalladamente los hechos constitutivos de delito, fecha, hora y lugar..." 
                          className="min-h-[150px] leading-relaxed"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => navigate("/causas")}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#1e293b] hover:bg-[#0f172a] text-white min-w-[200px]" disabled={mutation.isPending}>
                    {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Crear Expediente"}
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
