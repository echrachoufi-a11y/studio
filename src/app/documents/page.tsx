'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Loader2, Printer, ArrowLeft, FileText, AlertCircle, Building, User, Phone, Hash } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- TYPE DEFINITIONS ---
interface UserData {
  nom: string;
  empresa: string;
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

// --- HELPER FUNCTIONS ---
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

  // --- DATA FETCHING & PROCESSING ---
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (!storedData) {
      router.push('/login');
      return;
    }
    const parsedData = JSON.parse(storedData);
    setCurrentUserData(parsedData);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, documentsRes] = await Promise.all([
          fetch('https://sheetdb.io/api/v1/kymb6tvlvb694?sheet=usurais'),
          fetch('https://sheetdb.io/api/v1/kymb6tvlvb694?sheet=documents')
        ]);

        if (!usersRes.ok || !documentsRes.ok) {
          throw new Error('No s\'ha pogut connectar amb la base de dades. Intenta-ho de nou més tard.');
        }

        const usersData = (await usersRes.json()).map(normalizeKeys);
        const documentsData = (await documentsRes.json()).map(normalizeKeys);
        
        setAllUsers(usersData);
        setAllDocuments(documentsData);

        const currentUser = usersData.find((u: ApiUser) => u.usuari.toLowerCase() === parsedData.nom.toLowerCase());
        setUserRole(currentUser ? currentUser.rol.toLowerCase() : 'client');

      } catch (e: any) {
        setError(e.message || 'Ha ocorregut un error inesperat.');
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
      : allDocuments.filter(doc => doc.usuari.toLowerCase() === currentUserData.nom.toLowerCase());

    const invoicesMap = new Map<string, DocumentLine[]>();
    filteredDocs.forEach(line => {
      if (!invoicesMap.has(line.num_factura)) {
        invoicesMap.set(line.num_factura, []);
      }
      invoicesMap.get(line.num_factura)!.push(line);
    });

    const result: ProcessedInvoice[] = [];
    invoicesMap.forEach((lines, invoiceNumber) => {
      const firstLine = lines[0];
      const clientData = allUsers.find(u => u.usuari.toLowerCase() === firstLine.usuari.toLowerCase()) || null;
      let baseTotal = 0;
      const vatMap = new Map<number, { base: number; amount: number }>();

      const processedLines = lines.map(line => {
        const unitPrice = parseFloat(line.preu_unitari) || 0;
        const quantity = parseFloat(line.unitats) || 0;
        const discount = parseFloat(line.dte) || 0;
        const vatRate = parseFloat(line.iva) || 0;
        
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


  const handlePrint = () => {
    window.print();
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16 md:px-6">
        <div className="flex items-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Carregant documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 md:px-6">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Càrrega</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (selectedInvoice) {
    // --- INVOICE DETAIL VIEW ---
    const invoice = selectedInvoice;
    const client = invoice.clientData;
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
            <ArrowLeft className="mr-2" /> Tornar al llistat
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2" /> Imprimir PDF
          </Button>
        </div>
        
        <Card id="zona-factura" className="w-full max-w-4xl mx-auto p-8 shadow-lg border">
            <header className="flex justify-between items-start pb-6 border-b-2">
                <div>
                    <Logo />
                    <div className="mt-4 text-xs text-muted-foreground">
                        <p>Meridian Logistics S.L.</p>
                        <p>123 Calle de la Logística, Puerto Principal</p>
                        <p>ESB12345678</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold font-headline text-primary">FACTURA</h2>
                    <p className="mt-1">
                        <span className="font-semibold">Nº Factura:</span> {invoice.invoiceNumber}
                    </p>
                    <p>
                        <span className="font-semibold">Data:</span> {new Date(invoice.date).toLocaleDateString('ca-ES')}
                    </p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-6">
                <div>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">Facturat a:</h3>
                    {client ? (
                    <div className="mt-2 text-sm">
                        <p className="font-bold text-base">{client.empresa || client.usuari}</p>
                        <p>NIF: {client.fiscalid}</p>
                        <p>{client.adreca}</p>
                        <p>Tel: {client.telefon}</p>
                    </div>
                    ) : ( <p className="text-sm text-destructive">Dades del client no trobades.</p>)}
                </div>
            </section>

            <section>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/2">Concepte</TableHead>
                        <TableHead className="text-right">P. Unitari</TableHead>
                        <TableHead className="text-right">Uds.</TableHead>
                        <TableHead className="text-right">Net</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {invoice.lines.map((line, index) => (
                        <TableRow key={index}>
                        <TableCell>
                            <p className="font-medium">{line.concept}</p>
                            <p className="text-xs text-muted-foreground">
                                {`IVA: ${line.vatRate}%`}{line.discount > 0 && ` | Dte: ${line.discount}%`}
                            </p>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(line.unitPrice)}</TableCell>
                        <TableCell className="text-right">{line.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(line.netTotal)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </section>
            
            <Separator className="my-6"/>

            <section className="flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatCurrency(invoice.baseTotal)}</span>
                    </div>
                    {invoice.vatBreakdown.map(vat => (
                         <div key={vat.rate} className="flex justify-between">
                            <span className="text-muted-foreground">IVA ({vat.rate}%)</span>
                            <span className="font-medium">{formatCurrency(vat.amount)}</span>
                        </div>
                    ))}
                    <Separator/>
                    <div className="flex justify-between text-xl font-bold">
                        <span className="text-primary">TOTAL</span>
                        <span>{formatCurrency(invoice.grandTotal)}</span>
                    </div>
                </div>
            </section>

            <footer className="mt-8 pt-6 border-t">
                <p className="text-sm"><span className="font-semibold">Forma de Pagament:</span> {invoice.paymentMethod}</p>
                <div className="mt-4 text-xs text-muted-foreground text-justify space-y-2">
                    <p>Inscrita en el Registre Mercantil de València, Volum 1234, Foli 56, Full V-7890. </p>
                    <p>De conformitat amb el que estableix el Reglament (UE) 2016/679 del Parlament Europeu i del Consell, de 27 d'abril de 2016, l'informem que les seves dades personals seran tractades per Meridian Logistics S.L. amb la finalitat de gestionar la relació comercial. Pot exercir els seus drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat de les dades a través de l'adreça de correu electrònic contacte@meridianlogistics.com.</p>
                </div>
            </footer>
        </Card>
      </div>
    );
  }

  // --- INVOICE LIST VIEW ---
  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Els Meus Documents
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Consulta i gestiona les teves factures i documents.
          </p>
        </div>

        {processedInvoices.length > 0 ? (
          <div className="mx-auto mt-12 grid max-w-4xl gap-6">
            {processedInvoices.map(invoice => (
              <Card key={invoice.invoiceNumber} className="transition-all hover:shadow-md">
                <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="text-primary"/>
                      Factura {invoice.invoiceNumber}
                    </CardTitle>
                    <CardDescription>
                      Data: {new Date(invoice.date).toLocaleDateString('ca-ES')}
                    </CardDescription>
                  </div>
                  <Button onClick={() => setSelectedInvoice(invoice)}>Veure Detall</Button>
                </CardHeader>
                <CardContent className="flex justify-between items-center bg-muted/50 p-4 rounded-b-lg">
                    <div className="text-sm text-muted-foreground">Client: <span className="font-medium text-foreground">{invoice.clientUsername}</span></div>
                    <div className="text-lg font-bold">{formatCurrency(invoice.grandTotal)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl text-center">
            <p className="text-muted-foreground">No s'han trobat factures.</p>
          </div>
        )}
      </div>
    </div>
  );
}
