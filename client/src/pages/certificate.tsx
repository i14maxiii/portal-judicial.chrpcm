import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function CertificatePage() {
  const { user } = useAuth();
  const today = new Date();
  
  // Generamos un FOLIO único basado en la fecha y el ID
  const folio = `FOL-${today.getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const verificationUrl = `https://portal-judicial.roleplay/validar/${folio}`;
  
  // Simulamos antecedentes (esto vendría de tu base de datos)
  const antecedentesCount = 0; 

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 print:p-0 print:bg-white font-serif">
      
      {/* BARRA SUPERIOR (Se oculta al imprimir) */}
      <div className="mx-auto max-w-[210mm] mb-6 flex justify-between items-center print:hidden">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 font-sans"><ArrowLeft className="h-4 w-4" /> Volver al Panel</Button>
        </Link>
        <div className="flex gap-2">
          <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-xs font-sans border border-yellow-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Vista Previa Oficial
          </div>
          <Button onClick={handlePrint} className="bg-[#1e293b] gap-2 font-sans">
            <Printer className="h-4 w-4" /> Imprimir Original
          </Button>
        </div>
      </div>

      {/* DOCUMENTO OFICIAL A4 */}
      <Card className="mx-auto max-w-[210mm] min-h-[297mm] bg-white shadow-2xl p-16 relative overflow-hidden print:shadow-none print:border-none print:m-0 print:w-full">
        
        {/* MARCA DE AGUA DE FONDO (Escudo Gigante) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none print:opacity-[0.05]">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[500px] h-[500px]">
             <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.172-2.67-.499-3.922a.75.75 0 00-.722-.515 11.208 11.208 0 01-7.877-3.08zM12 4.25a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0V5a.75.75 0 00-.75-.75z" clipRule="evenodd" />
           </svg>
        </div>

        {/* CONTENIDO (Z-Index para estar sobre la marca de agua) */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* ENCABEZADO */}
          <header className="text-center border-b-4 border-double border-slate-800 pb-6">
            <div className="flex justify-between items-end mb-4">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">República de Chile</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Poder Judicial</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Emisión: {today.toLocaleDateString()}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold text-red-700">DOC. OFICIAL N° {folio}</p>
              </div>
            </div>
            
            <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900 mb-1 scale-y-110">
              Certificado de Antecedentes
            </h1>
            <p className="text-sm italic text-slate-600 font-medium">Registro General de Condenas y Anotaciones Penales</p>
          </header>

          {/* CUERPO DEL TEXTO */}
          <main className="mt-12 space-y-8 text-justify leading-loose text-slate-800">
            <p>
              El <strong>Jefe del Registro General</strong> que suscribe, certifica que en la base de datos nacional del Sistema Unificado de Justicia (SUJ), los antecedentes del ciudadano individualizado a continuación son los siguientes:
            </p>

            <div className="border border-slate-300 p-6 bg-slate-50/50">
              <div className="grid grid-cols-[150px_1fr] gap-y-2">
                <span className="font-bold text-slate-600">NOMBRE COMPLETO:</span>
                <span className="uppercase font-bold tracking-wide">{user?.username}</span>
                
                <span className="font-bold text-slate-600">IDENTIFICADOR (RUT):</span>
                <span className="font-mono">{user?.discordId || 'S/I'}</span>
                
                <span className="font-bold text-slate-600">FECHA CONSULTA:</span>
                <span>{today.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <p className="text-center font-bold text-sm text-slate-500 uppercase tracking-widest mt-8">-- ESTADO ACTUAL --</p>

            <div className="text-center py-6">
              {antecedentesCount === 0 ? (
                <div className="inline-block border-4 border-slate-900 p-2 rotate-[-2deg] opacity-90">
                  <div className="border-2 border-slate-900 px-10 py-4 bg-slate-100">
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-[0.2em] scale-y-110">
                      SIN ANTECEDENTES
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="inline-block border-4 border-red-800 p-2 rotate-[-2deg]">
                  <div className="border-2 border-red-800 px-10 py-4 bg-red-50">
                    <h2 className="text-4xl font-black text-red-800 uppercase tracking-[0.2em] scale-y-110">
                      REGISTRA ANTECEDENTES
                    </h2>
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-slate-600 mt-8">
              Se extiende el presente certificado a petición del interesado para los fines que estime conveniente. 
              La alteración o falsificación de este documento constituye delito penado por la ley.
            </p>
          </main>

          {/* PIE DE PÁGINA CON QR Y FIRMA */}
          <footer className="mt-auto pt-12 flex items-end justify-between border-t border-slate-200">
            
            {/* CÓDIGO QR REAL */}
            <div className="flex flex-col items-center gap-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`} 
                alt="Código de Verificación" 
                className="w-24 h-24 border border-slate-200 p-1"
              />
              <p className="text-[9px] text-center font-mono text-slate-400 w-24 leading-tight">
                Escanee para validar autenticidad
              </p>
            </div>

            {/* TIMBRE DE AGUA */}
            <div className="text-center relative">
              {/* Sello visual superpuesto */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 border-4 border-blue-900/20 rounded-full flex items-center justify-center rotate-[-15deg] pointer-events-none">
                <div className="w-28 h-28 border border-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold text-blue-900/20 uppercase text-center leading-none">
                    Sistema Unificado<br/>de Justicia<br/>CHRPCM
                  </span>
                </div>
              </div>

              <div className="relative z-10 mt-8">
                <p className="font-serif font-bold text-slate-900 border-t border-slate-900 pt-2 px-8 uppercase text-sm">
                  Secretaría General
                </p>
                <p className="text-[10px] text-slate-500 uppercase">Firma Autorizada</p>
              </div>
            </div>

          </footer>
          
          <div className="text-center mt-4 text-[8px] text-slate-300 font-mono">
            HASH: {Math.random().toString(36).substring(2)} • IP: {Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.X.X
          </div>

        </div>
      </Card>
    </div>
  );
}
