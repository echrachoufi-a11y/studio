'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Printer, ArrowLeft, FileText, AlertCircle, Info } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserData {
  nom: string;
  empresa: string;
  usuari: string;
}

interface ApiUser {
  usuari: string;
  rol: string;
  empresa: string;
  fiscalid: string;
  adreca: string;
  telefon: string;
}

interface DocumentLine {
  num_factura: string;
  data: string;
  usuari: string;
  fpagament: string;
  concepte: string;
  preu_unitari: string;
  unitats: string;
  iva: string;
  dte: string;
  albara: string;
}

interface ProcessedInvoice {
  invoiceNumber: string;
  date: string;
  clientUsername: string;
  paymentMethod: string;
  lines: {
    concept: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    vatRate: number;
    netTotal: number;
    vatAmount: number;
    total: number;
  }[];
  baseTotal: number;
  vatBreakdown: {
    rate: number;
    base: number;
    amount: number;
  }[];
  grandTotal: number;
  clientData: ApiUser | null;
}

const normalizeKeys = (obj: any): any => {
  if (!obj) return null;
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key.trim().toLowerCase()] = obj[key];
    }
  }
  return newObj;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<ApiUser[]>([]);
  const [allDocuments, setAllDocuments] = useState<DocumentLine[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<ProcessedInvoice | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (!storedData) {
      router.push('/login');
      return;
    }
    const parsedData: UserData = JSON.parse(storedData);
    setCurrentUserData(parsedData);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const SHEET_ID = 'kltblqn245xln';
        const [usersRes, documentsRes] = await Promise.all([
          fetch(`https://sheetdb.io/api/v1/${SHEET_ID}?sheet=usuaris`),
          fetch(`https://sheetdb.io/api/v1/${SHEET_ID}?sheet=documents`)
        ]);

        if (!usersRes.ok || !documentsRes.ok) {
          throw new Error('Error de connexió amb SheetDB. Verifica el nom de les pestanyes.');
        }

        const rawUsers = await usersRes.json();
        const rawDocuments = await documentsRes.json();

        const usersData = rawUsers.map(normalizeKeys);
        const documentsData = rawDocuments.map(normalizeKeys);
        
        setAllUsers(usersData);
        setAllDocuments(documentsData);

        const currentUser = usersData.find((u: ApiUser) => 
          u.usuari?.toString().toLowerCase().trim() === parsedData.usuari?.toString().toLowerCase().trim()
        );
        
        const role = currentUser ? currentUser.rol?.toString().toLowerCase().trim() : 'client';
        setUserRole(role);

      } catch (e: any) {
        setError(e.message || 'Error de connexió.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const processedInvoices = useMemo((): ProcessedInvoice[] => {
    if (!currentUserData || !userRole) return [];

    const isAdmin = ['admin', 'administrador', 'treballador'].includes(userRole);
    
    const filteredDocs = isAdmin
      ? allDocuments
      : allDocuments.filter(doc => 
          doc.usuari?.toString().toLowerCase().trim() === currentUserData.usuari?.toString().toLowerCase().trim()
        );

    const invoicesMap = new Map<string, DocumentLine[]>();
    filteredDocs.forEach(line => {
      if (line.num_factura) {
        if (!invoicesMap.has(line.num_factura)) {
          invoicesMap.set(line.num_factura, []);
        }
        invoicesMap.get(line.num_factura)!.push(line);
      }
    });

    const result: ProcessedInvoice[] = [];
    invoicesMap.forEach((lines, invoiceNumber) => {
      const firstLine = lines[0];
      const clientData = allUsers.find(u => u.usuari?.toString().toLowerCase().trim() === firstLine.usuari?.toString().toLowerCase().trim()) || null;
      let baseTotal = 0;
      const vatMap = new Map<number, { base: number; amount: number }>();

      const processedLines = lines.map(line => {
        const unitPrice = parseFloat(line.preu_unitari?.toString().replace(',', '.')) || 0;
        const quantity = parseFloat(line.unitats?.toString().replace(',', '.')) || 0;
        const discount = parseFloat(line.dte?.toString().replace(',', '.')) || 0;
        const vatRate = parseFloat(line.iva?.toString().replace(',', '.')) || 0;
        
        const netTotal = (unitPrice * quantity) * (1 - discount / 100);
        const vatAmount = netTotal * (vatRate / 100);

        baseTotal += netTotal;
        
        const currentVat = vatMap.get(vatRate) || { base: 0, amount: 0 };
        currentVat.base += netTotal;
        currentVat.amount += vatAmount;
        vatMap.set(vatRate, currentVat);

        return {
          concept: line.concepte,
          unitPrice,
          quantity,
          discount,
          vatRate,
          netTotal,
          vatAmount,
          total: netTotal + vatAmount,
        };
      });

      const vatBreakdown = Array.from(vatMap.entries()).map(([rate, data]) => ({ rate, ...data }));
      const grandTotal = baseTotal + vatBreakdown.reduce((acc, curr) => acc + curr.amount, 0);

      result.push({
        invoiceNumber,
        date: firstLine.data,
        clientUsername: firstLine.usuari,
        paymentMethod: firstLine.fpagament,
        lines: processedLines,
        baseTotal,
        vatBreakdown,
        grandTotal,
        clientData,
      });
    });

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allDocuments, allUsers, currentUserData, userRole]);

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Connexió</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center mt-6">
            <Button onClick={() => window.location.reload()}>Tornar a provar</Button>
        </div>
      </div>
    );
  }

  if (selectedInvoice) {
    const invoice = selectedInvoice;
    const client = invoice.clientData;
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Tornar
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir PDF
          </Button>
        </div>
        
        <Card id="zona-factura" className="w-full max-w-4xl mx-auto p-12 shadow-none border">
            <header className="flex justify-between items-start pb-8 border-b">
                <div>
                    <Logo />
                    <div className="mt-4 text-xs text-muted-foreground">
                        <p className="font-bold">Meridian Logistics S.L.</p>
                        <p>ESB12345678</p>
                        <p>Puerto Principal, Nave 12</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-primary">FACTURA</h2>
                    <p className="mt-2 text-lg font-medium">Nº: {invoice.invoiceNumber}</p>
                    <p className="text-sm">Data: {new Date(invoice.date).toLocaleDateString('ca-ES')}</p>
                </div>
            </header>

            <section className="my-10 grid grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Facturat a:</h3>
                    {client ? (
                    <div className="text-sm space-y-1">
                        <p className="font-bold text-base">{client.empresa || client.usuari}</p>
                        <p>NIF/CIF: <span className="font-medium">{client.fiscalid}</span></p>
                        <p>{client.adreca}</p>
                        <p>Tel: {client.telefon}</p>
                    </div>
                    ) : ( 
                        <div className="text-sm p-3 bg-destructive/5 rounded border border-destructive/20">
                            <p className="font-bold text-destructive">Atenció: Dades fiscals no trobades</p>
                            <p className="text-xs">Usuari Excel: {invoice.clientUsername}</p>
                        </div>
                    )}
                </div>
                <div className="text-right flex flex-col justify-end">
                    <div className="text-sm text-muted-foreground">
                        <p>Mètode de pagament: <span className="text-foreground font-medium">{invoice.paymentMethod}</span></p>
                    </div>
                </div>
            </section>

            <div className="mb-8">
                <Table>
                    <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-bold text-foreground">Descripció del servei</TableHead>
                        <TableHead className="text-right font-bold text-foreground">Preu Unit.</TableHead>
                        <TableHead className="text-right font-bold text-foreground">Unitats</TableHead>
                        <TableHead className="text-right font-bold text-foreground">Total Net</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {invoice.lines.map((line, index) => (
                        <TableRow key={index}>
                        <TableCell className="py-4">
                            <p className="font-medium">{line.concept}</p>
                            <p className="text-[10px] text-muted-foreground">Tipus d'IVA aplicat: {line.vatRate}%</p>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(line.unitPrice)}</TableCell>
                        <TableCell className="text-right">{line.quantity}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(line.netTotal)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
            
            <Separator className="my-8"/>

            <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Base Imposable Total</span>
                        <span className="text-foreground">{formatCurrency(invoice.baseTotal)}</span>
                    </div>
                    {invoice.vatBreakdown.map(vat => (
                         <div key={vat.rate} className="flex justify-between text-sm text-muted-foreground">
                            <span>Quota IVA ({vat.rate}%) sobre {formatCurrency(vat.base)}</span>
                            <span className="text-foreground">{formatCurrency(vat.amount)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-primary/20 text-primary">
                        <span>TOTAL FACTURA</span>
                        <span>{formatCurrency(invoice.grandTotal)}</span>
                    </div>
                </div>
            </div>

            <footer className="mt-16 pt-8 border-t text-[9px] text-muted-foreground leading-relaxed">
                <div className="grid grid-cols-1 gap-4">
                    <p><strong>Avís Legal i Protecció de Dades:</strong> En compliment del Reglament (UE) 2016/679 (RGPD), l'informem que les dades personals facilitades seran tractades per Meridian Logistics S.L. amb la finalitat de gestionar la relació comercial i administrativa. Pot exercir els seus drets d'accés, rectificació, supressió i altres previstos per la llei dirigint-se a contacte@meridianlogistics.com.</p>
                    <p>Meridian Logistics S.L. - Registre Mercantil de València, Tom 12345, Foli 67, Full V-98765. Domicili Social: Puerto Principal, Nave 12, València, Espanya.</p>
                </div>
            </footer>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full bg-background py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            Els Meus Documents
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">Gestiona i descarrega les teves factures oficials.</p>
          {userRole && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/20">
                <Info className="h-4 w-4" />
                Mode d'accés: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
          )}
        </div>

        {processedInvoices.length > 0 ? (
          <div className="mx-auto max-w-4xl grid gap-6">
            {processedInvoices.map(invoice => (
              <Card key={invoice.invoiceNumber} className="hover:shadow-lg transition-all border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Factura</span>
                        <CardTitle className="text-2xl font-bold">{invoice.invoiceNumber}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Data d'emissió: <span className="font-medium text-foreground">{new Date(invoice.date).toLocaleDateString('ca-ES')}</span>
                    </CardDescription>
                  </div>
                  <Button size="lg" onClick={() => setSelectedInvoice(invoice)} className="shadow-md">
                    Veure Detall i Imprimir
                  </Button>
                </CardHeader>
                <CardContent className="bg-muted/30 py-4 flex justify-between items-center rounded-b-lg px-8 border-t">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Client Associat</span>
                        <span className="text-sm font-semibold">{invoice.clientUsername}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Import Total</span>
                        <span className="text-2xl font-black text-primary">{formatCurrency(invoice.grandTotal)}</span>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mx-auto max-w-xl p-12 text-center border-dashed">
            <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-xl font-medium text-muted-foreground">No s'han trobat documents per al teu compte.</p>
                <p className="text-sm text-muted-foreground">Si creus que es tracta d'un error, contacta amb el suport tècnic.</p>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>Tornar al Panell</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
