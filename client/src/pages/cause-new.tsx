import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCauseSchema, type InsertCause } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
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
      imputadoRut: "",
      estado: "investigacion", // <--- CORRECCIÓN IMPORTANTE AQUÍ
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCause) => {
      const res = await apiRequest("POST", "/api/causes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes"] });
      toast({
        title: "Causa creada",
        description: "El expediente ha sido ingresado correctamente.",
      });
      navigate("/causas");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: InsertCause) {
    mutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/causas">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Ingresar Nueva Causa</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ruc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUC (Rol Único)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 2400123456-7" {...field} />
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
                        <FormLabel>RIT (Tribunal)</FormLabel>
                        <FormControl>
                          <Input placeholder="Opcional" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>Solo si ya está judicializada</FormDescription>
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
                      <FormLabel>RUT Imputado</FormLabel>
                      <FormControl>
                        <Input placeholder="12.345.678-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hechos del Caso</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describa los hechos constitutivos de delito..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/causas")}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#1e293b]" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear Expediente
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
