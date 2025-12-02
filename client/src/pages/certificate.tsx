import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Scale, Shield, CheckCircle, User, Printer } from "lucide-react";

export default function CertificatePage() {
  const { user, isLoading } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const certificateNumber = `CERT-${Date.now().toString(36).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-64 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
          <div className="text-center py-16">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No autenticado</h3>
            <p className="text-muted-foreground">
              Debe iniciar sesión para generar su certificado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Certificado de Antecedentes
            </h1>
            <p className="text-muted-foreground">
              Documento oficial para fines de RolePlay.
            </p>
          </div>
          <Button onClick={handlePrint} variant="outline" data-testid="button-print">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>

        <Card className="print:shadow-none print:border-2 print:border-black">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary print:bg-white print:border-2 print:border-primary">
                  <Scale className="h-10 w-10" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">
                Certificado de Antecedentes Penales
              </h2>
              <p className="text-muted-foreground">
                República de Chile - Poder Judicial
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Ministerio Público - Fiscalía RP
              </p>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-muted/30 rounded-lg border border-border print:bg-white">
              <Avatar className="h-24 w-24 flex-shrink-0 print:border-2 print:border-primary">
                <AvatarImage
                  src={
                    user.avatar
                      ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=256`
                      : undefined
                  }
                  alt={user.username}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <p className="text-sm uppercase tracking-wide text-muted-foreground mb-1">
                  Nombre del Titular
                </p>
                <h3 className="text-2xl font-semibold mb-2">{user.username}</h3>
                <p className="font-mono text-sm text-muted-foreground">
                  ID: {user.discordId}
                </p>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 print:bg-white print:border-2 print:border-emerald-500">
                <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left">
                  <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                    SIN ANTECEDENTES PENALES
                  </p>
                  <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                    El titular no registra antecedentes penales vigentes
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="p-4 rounded-lg bg-muted/50 border border-border print:bg-white">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Número de Certificado
                </p>
                <p className="font-mono font-semibold">{certificateNumber}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border print:bg-white">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Fecha de Emisión
                </p>
                <p className="font-semibold">{currentDate}</p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 border border-border text-sm leading-relaxed print:bg-white">
              <p className="mb-4">
                El presente certificado acredita que el ciudadano identificado
                como{" "}
                <span className="font-semibold">{user.username}</span> no
                registra antecedentes penales en los registros del Poder
                Judicial y Ministerio Público de la República de Chile, para
                fines de RolePlay.
              </p>
              <p className="text-muted-foreground">
                Este documento es válido únicamente dentro del contexto del
                servidor de RolePlay y no tiene ninguna validez legal en el
                mundo real. Cualquier uso fraudulento será sancionado conforme a
                las reglas del servidor.
              </p>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <Shield className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Portal Judicial</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Fiscalía RP - Servidor de RolePlay
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-primary/50 text-primary/50 print:border-primary">
                <Scale className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-6 print:hidden">
          Este certificado es generado automáticamente y es válido solo para
          fines de RolePlay.
        </p>
      </div>
    </div>
  );
}
