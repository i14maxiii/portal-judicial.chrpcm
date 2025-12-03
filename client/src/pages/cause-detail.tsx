import { useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Cause, Warrant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// Icons
import {
  ArrowLeft, FileText, Scale, Trash2, Edit, Calendar, User, Hash,
  Loader2, Gavel, FileSearch, ShieldAlert, CheckCircle2, XCircle
} from "lucide-react";

export default function CauseDetailPage() {
  const [, params] = useRoute("/causas/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const causeId = params?.id;

  // Estado para formularios
  const [warrantOpen, setWarrantOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedWarrantId, setSelectedWarrantId] = useState<string | null>(null);
  
  // Form Data
  const [warrantForm, setWarrantForm] = useState({ type: "detencion", target: "", reason: "" });
  const [rejectReason, setRejectReason] = useState("");

  // Queries
  const { data: cause, isLoading: loadingCause } = useQuery<Cause>({
    queryKey: ["/api/causes", causeId],
    enabled: !!causeId,
  });

  const { data: warrants, isLoading: loadingWarrants } = useQuery<Warrant[]>({
    queryKey: ["/api/warrants/cause", causeId],
    enabled: !!causeId,
  });

  const isJudge = user?.role === "juez" || user?.role === "admin";
  const isFiscal = user?.role === "fiscal" || user?.role === "admin";

  // Mutations
  const createWarrant = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/warrants", { ...warrantForm, causeId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warrants/cause", causeId] });
      setWarrantOpen(false);
      setWarrantForm({ type: "detencion", target: "", reason: "" });
      toast({ title: "Solicitud enviada", description: "La orden ha sido enviada al despacho del Juez." });
    }
  });

  const signWarrant = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("PATCH", `/api/warrants/${id}/sign`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warrants/cause", causeId] });
      toast({ title: "Orden Firmada", description: "La orden ha sido aprobada y es ejecutable.", className: "bg-green-600 text-white" });
    }
  });

  const rejectWarrant = useMutation({
    mutationFn: async () => {
      if (!selectedWarrantId) return;
      const res = await apiRequest("PATCH", `/api/warrants/${selectedWarrantId}/reject`, { reason: rejectReason });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warrants/cause", causeId] });
      setRejectOpen(false);
      setRejectReason("");
      toast({ title: "Orden Rechazada", description: "Se ha notificado el rechazo." });
    }
  });

  const deleteCause = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/causes/${causeId}`);
    },
    onSuccess: () => {
      navigate("/causas");
      toast({ title: "Causa eliminada" });
    }
  });

  if (loadingCause) return <div className="p-8"><Skeleton className="h-10 w-32 mb-8" /><Skeleton className="h-64 w-full" /></div>;
  if (!cause) return <div className="p-8 text-center">Causa no encontrada</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/causas">
            <Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4" /> Volver</Button>
          </Link>
          <div className="flex gap-2">
            {isFiscal && (
              <Link href={`/causas/${cause.id}/editar`}>
                <Button variant="outline" size="sm" className="gap-2"><Edit className="h-4 w-4" /> Editar</Button>
              </Link>
            )}
            {/* Solo admin borra definitivamente */}
            {user?.role === "admin" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2"><Trash2 className="h-4 w-4" /> Eliminar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>¿Está seguro?</AlertDialogTitle></AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCause.mutate()}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* INFO CARD */}
        <Card className="mb-8 border-t-4 border-t-[#C5A572] shadow-sm">
          <CardHeader className="bg-white">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-16 w-16 bg-[#1e293b] rounded-lg flex items-center justify-center text-[#C5A572]">
                  <Scale className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex gap-3 items-center mb-1">
                    <CardTitle className="text-2xl font-serif font-bold text-slate-800">{cause.ruc}</CardTitle>
                    <Badge variant={cause.estado === 'activa' ? 'default' : 'secondary'}>{cause.estado.toUpperCase()}</Badge>
                  </div>
                  <CardDescription className="font-mono text-xs">ID INTERNO: {cause.id}</CardDescription>
                  {cause.rit && <p className="text-sm font-bold text-slate-600 mt-1">RIT TRIBUNAL: {cause.rit}</p>}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hechos del Caso</h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100">
                  {cause.descripcion}
                </p>
              </div>
            </div>
            <div className="space-y-4 border-l pl-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Imputado</h3>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <User className="h-4 w-4" /> {cause.imputadoRut}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Ingreso</h3>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4" /> {new Date(cause.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TABS PRINCIPALES */}
        <Tabs defaultValue="ordenes" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
            <TabsTrigger value="ordenes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C5A572] data-[state=active]:bg-transparent py-3">
              Despacho Judicial (Órdenes)
            </TabsTrigger>
            <TabsTrigger value="evidencia" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C5A572] data-[state=active]:bg-transparent py-3">
              Evidencia Digital
            </TabsTrigger>
            <TabsTrigger value="historial" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C5A572] data-[state=active]:bg-transparent py-3">
              Historial de Actuaciones
            </TabsTrigger>
          </TabsList>

          {/* TAB: ÓRDENES JUDICIALES */}
          <TabsContent value="ordenes" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold flex items-center gap-2">
                <Gavel className="h-5 w-5 text-slate-600" /> Órdenes y Solicitudes
              </h3>
              {isFiscal && (
                <Dialog open={warrantOpen} onOpenChange={setWarrantOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1e293b] text-[#C5A572] hover:bg-[#0f172a]">Solicitar Orden al Juez</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Solicitud de Orden Judicial</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Tipo de Orden</Label>
                        <Select onValueChange={(v) => setWarrantForm({...warrantForm, type: v})} defaultValue={warrantForm.type}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="detencion">Orden de Detención</SelectItem>
                            <SelectItem value="allanamiento">Orden de Allanamiento (Entrada y Registro)</SelectItem>
                            <SelectItem value="incautacion">Incautación de Vehículo/Bien</SelectItem>
                            <SelectItem value="secreto_bancario">Levantamiento Secreto Bancario</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Objetivo (Persona, Dirección o Patente)</Label>
                        <Input 
                          placeholder="Ej: 12.345.678-9 o Calle Falsa 123" 
                          value={warrantForm.target}
                          onChange={(e) => setWarrantForm({...warrantForm, target: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Justificación Jurídica</Label>
                        <Textarea 
                          placeholder="Fundamente la solicitud..." 
                          value={warrantForm.reason}
                          onChange={(e) => setWarrantForm({...warrantForm, reason: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setWarrantOpen(false)}>Cancelar</Button>
                      <Button onClick={() => createWarrant.mutate()} disabled={createWarrant.isPending}>
                        {createWarrant.isPending ? <Loader2 className="animate-spin" /> : "Enviar Solicitud"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-4">
              {loadingWarrants ? <Skeleton className="h-20" /> : warrants?.length === 0 ? (
                <div className="text-center py-10 border rounded-lg border-dashed text-muted-foreground">
                  No hay órdenes solicitadas en esta causa.
                </div>
              ) : (
                warrants?.map((w) => (
                  <Card key={w.id} className="border-l-4 border-l-slate-300">
                    <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="uppercase font-bold">{w.type.replace('_', ' ')}</Badge>
                          {w.status === 'pendiente' && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente de Firma</Badge>}
                          {w.status === 'aprobada' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex gap-1"><CheckCircle2 className="h-3 w-3" /> Firmada por Juez</Badge>}
                          {w.status === 'rechazada' && <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex gap-1"><XCircle className="h-3 w-3" /> Rechazada</Badge>}
                        </div>
                        <h4 className="font-bold text-slate-800">Objetivo: {w.target}</h4>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{w.reason}</p>
                        {w.rejectionReason && <p className="text-xs text-red-600 mt-1 font-bold">Motivo rechazo: {w.rejectionReason}</p>}
                        <div className="text-xs text-slate-400 mt-2">Solicitado por: {w.requestedBy} • {new Date(w.createdAt).toLocaleDateString()}</div>
                      </div>

                      {/* ACCIONES DEL JUEZ */}
                      {isJudge && w.status === 'pendiente' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => signWarrant.mutate(w.id)}>
                            <Gavel className="h-4 w-4 mr-1" /> Firmar
                          </Button>
                          <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="destructive" onClick={() => setSelectedWarrantId(w.id)}>Rechazar</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Rechazar Solicitud</DialogTitle></DialogHeader>
                              <div className="py-4">
                                <Label>Motivo del rechazo</Label>
                                <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Falta de pruebas..." />
                              </div>
                              <DialogFooter>
                                <Button onClick={() => rejectWarrant.mutate()}>Confirmar Rechazo</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* TAB: EVIDENCIA (Placeholder) */}
          <TabsContent value="evidencia" className="mt-6">
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
              <FileSearch className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              <h3 className="text-slate-500 font-medium">Gestión de Evidencia</h3>
              <p className="text-sm text-slate-400">Próximamente: Subida de imágenes y documentos.</p>
            </div>
          </TabsContent>

          {/* TAB: HISTORIAL (Placeholder) */}
          <TabsContent value="historial" className="mt-6">
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
              <ShieldAlert className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              <h3 className="text-slate-500 font-medium">Bitácora de Actuaciones</h3>
              <p className="text-sm text-slate-400">Próximamente: Historial inmutable de movimientos.</p>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
