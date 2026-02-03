'use client';

import Link from 'next/link';
import { Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Inici' },
  { href: '/#services', label: 'Serveis' },
  { href: '/about', label: 'Sobre Nosaltres' },
  { href: '/blog', label: 'Blog' },
  { href: '/seguimiento', label: 'Seguiment' },
  { href: '/optimize', label: 'Optimitzar Ruta' },
  { href: '/contact', label: 'Contacte' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<{ nom: string; empresa: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
    // Refresh user data from localStorage on every navigation
    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch (e) {
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    router.push('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300',
        isScrolled ? 'border-border bg-background/80 backdrop-blur-md' : 'bg-background'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="Tornar a l'inici">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          
          {userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 bg-primary/5">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{userData.nom}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>El meu compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Àrea de Client
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/documents" className="cursor-pointer">
                    <Menu className="mr-2 h-4 w-4" />
                    Les meves Factures
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Tancar Sessió
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Accés</Link>
              </Button>
              <Button asChild>
                <Link href="/quote">Sol·licitar Cotització</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Obrir menú">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Link href="/" aria-label="Tornar a l'inici">
                    <Logo />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                
                {userData ? (
                   <>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/dashboard">Àrea de Client ({userData.nom})</Link>
                    </Button>
                    <Button onClick={handleLogout} variant="destructive">
                      Tancar Sessió
                    </Button>
                   </>
                ) : (
                  <>
                    <Button asChild size="lg" className="mt-4" variant="outline">
                       <Link href="/login">Accés Usuaris</Link>
                    </Button>
                    <Button asChild size="lg" className="mt-2">
                      <Link href="/quote">Sol·licitar Cotització</Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}