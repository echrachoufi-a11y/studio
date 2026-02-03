'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Printer, ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    const parsedData = JSON.parse(storedData);
    setCurrentUserData(parsedData);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // S'utilitzen les pestanyes 'usurais' i 'documents' segons la configuració del client
        const [usersRes, documentsRes] = await Promise.all([
          fetch('https://sheetdb.io/api/v1/kymb6tvlvb694?sheet=usurais'),
          fetch('https://sheetdb.io/api/v1/kymb6tvlvb694?sheet=documents')
        ]);

        if (!usersRes.ok || !documentsRes.ok) {
          throw new Error('Error al connectar amb la base de dades. Revisa el nom de les pestanyes.');
        }

        const rawUsers = await usersRes.json();
        const rawDocuments = await documentsRes.json();

        const usersData = rawUsers.map(normalizeKeys);
        const documentsData = rawDocuments.map(normalizeKeys);
        
        setAllUsers(usersData);
        setAllDocuments(documentsData);

        const currentUser = usersData.find((u: ApiUser) => u.usuari?.toLowerCase() === parsedData.nom?.toLowerCase());
        setUserRole(currentUser ? currentUser.rol?.toLowerCase() : 'client');

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
      : allDocuments.filter(doc => doc.usuari?.toLowerCase() === currentUserData.nom?.toLowerCase());

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
      const clientData = allUsers.find(u => u.usuari?.toLowerCase() === firstLine.usuari?.toLowerCase()) || null;
      let baseTotal = 0;
      const vatMap = new Map<number, { base: number; amount: number }>();

      const processedLines = lines.map(line => {
        const unitPrice = parseFloat(line.preu_unitari?.replace(',', '.')) || 0;
        const quantity = parseFloat(line.unitats?.replace(',', '.')) || 0;
        const discount = parseFloat(line.dte?.replace(',', '.')) || 0;
        const vatRate = parseFloat(line.iva?.replace(',', '.')) || 0;
        
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
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
        
        <Card id="zona-factura" className="w-full max-w-4xl mx-auto p-8 shadow-none border">
            <header className="flex justify-between items-start pb-6 border-b">
                <div>
                    <Logo />
                    <div className="mt-4 text-xs text-muted-foreground">
                        <p>Meridian Logistics S.L.</p>
                        <p>ESB12345678</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-primary">FACTURA</h2>
                    <p className="mt-1 font-medium">Nº: {invoice.invoiceNumber}</p>
                    <p className="text-sm">Data: {new Date(invoice.date).toLocaleDateString('ca-ES')}</p>
                </div>
            </header>

            <section className="my-6">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Facturat a:</h3>
                {client ? (
                <div className="text-sm">
                    <p className="font-bold">{client.empresa || client.usuari}</p>
                    <p>NIF: {client.fiscalid}</p>
                    <p>{client.adreca}</p>
                    <p>Tel: {client.telefon}</p>
                </div>
                ) : ( <p className="text-sm text-destructive">Client: {invoice.clientUsername}</p>)}
            </section>

            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Concepte</TableHead>
                    <TableHead className="text-right">Preu</TableHead>
                    <TableHead className="text-right">Uds.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {invoice.lines.map((line, index) => (
                    <TableRow key={index}>
                    <TableCell>
                        <p className="font-medium">{line.concept}</p>
                        <p className="text-xs text-muted-foreground">IVA: {line.vatRate}%</p>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(line.unitPrice)}</TableCell>
                    <TableCell className="text-right">{line.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(line.netTotal)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            
            <Separator className="my-6"/>

            <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Base Imposable</span>
                        <span>{formatCurrency(invoice.baseTotal)}</span>
                    </div>
                    {invoice.vatBreakdown.map(vat => (
                         <div key={vat.rate} className="flex justify-between text-sm">
                            <span>IVA ({vat.rate}%)</span>
                            <span>{formatCurrency(vat.amount)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                        <span>TOTAL</span>
                        <span>{formatCurrency(invoice.grandTotal)}</span>
                    </div>
                </div>
            </div>

            <footer className="mt-12 pt-6 border-t text-[10px] text-muted-foreground leading-tight space-y-2">
                <p>Forma de pagament: {invoice.paymentMethod}</p>
                <p>Meridian Logistics S.L. - Inscrita al Registre Mercantil de València.</p>
                <p>De conformitat amb el RGPD, l'informem que les seves dades personals són tractades per Meridian Logistics S.L. per a la gestió comercial. Pot exercir els seus drets a contacte@meridianlogistics.com.</p>
            </footer>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full bg-background py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="text-4xl font-bold">Els Meus Documents</h1>
          <p className="mt-4 text-muted-foreground">Consulta i gestiona les teves factures.</p>
        </div>

        {processedInvoices.length > 0 ? (
          <div className="mx-auto max-w-4xl grid gap-6">
            {processedInvoices.map(invoice => (
              <Card key={invoice.invoiceNumber} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Factura {invoice.invoiceNumber}
                    </CardTitle>
                    <CardDescription>
                      Data: {new Date(invoice.date).toLocaleDateString('ca-ES')}
                    </CardDescription>
                  </div>
                  <Button onClick={() => setSelectedInvoice(invoice)}>Veure Detall</Button>
                </CardHeader>
                <CardContent className="bg-muted/30 py-3 flex justify-between items-center rounded-b-lg px-6">
                    <span className="text-sm font-medium">Client: {invoice.clientUsername}</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(invoice.grandTotal)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No s'han trobat documents.</p>
          </div>
        )}
      </div>
    </div>
  );
}
