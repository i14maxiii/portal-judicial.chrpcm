import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Scale className="h-10 w-10" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4">Página No Encontrada</h2>
          
          <p className="text-muted-foreground mb-8">
            La página que busca no existe o ha sido movida. Verifique la URL o 
            regrese al portal principal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button data-testid="button-home">
                <Home className="mr-2 h-4 w-4" />
                Ir al Inicio
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver Atrás
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
