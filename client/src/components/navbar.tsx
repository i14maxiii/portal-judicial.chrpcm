import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Scale,
  User,
  FileText,
  Shield,
  LogOut,
  Menu,
  Home,
  Search,
  FolderOpen,
  Trash2,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Panel Principal", icon: Home },
        { href: "/causas", label: "Causas", icon: FolderOpen },
        { href: "/busqueda", label: "Búsqueda", icon: Search },
        { href: "/papelera", label: "Papelera", icon: Trash2 },
      ]
    : [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <a
                className="flex items-center gap-3 hover-elevate rounded-md px-2 py-1"
                data-testid="link-home"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Scale className="h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold tracking-tight">
                    Portal Judicial
                  </p>
                  <p className="text-xs text-muted-foreground">Fiscalía RP</p>
                </div>
              </a>
            </Link>
          </div>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <a
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors hover-elevate ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                      data-testid={`link-nav-${link.label.toLowerCase().replace(" ", "-")}`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid="button-mobile-menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72">
                    <div className="flex flex-col gap-4 mt-8">
                      <div className="flex items-center gap-3 px-2 py-3 border-b border-border">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              user.avatar
                                ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
                                : undefined
                            }
                            alt={user.username}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.role === "admin" ? "Administrador" : "Funcionario"}
                          </p>
                        </div>
                      </div>
                      <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => {
                          const Icon = link.icon;
                          const isActive = location === link.href;
                          return (
                            <Link key={link.href} href={link.href}>
                              <a
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover-elevate ${
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                                data-testid={`link-mobile-${link.label.toLowerCase().replace(" ", "-")}`}
                              >
                                <Icon className="h-4 w-4" />
                                {link.label}
                              </a>
                            </Link>
                          );
                        })}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2"
                      data-testid="button-user-menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            user.avatar
                              ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
                              : undefined
                          }
                          alt={user.username}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block text-sm font-medium max-w-[120px] truncate">
                        {user.username}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user.avatar
                              ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
                              : undefined
                          }
                          alt={user.username}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role === "admin" ? "Administrador" : "Funcionario"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/perfil">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        data-testid="menu-item-profile"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/hoja-de-vida">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        data-testid="menu-item-background"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Hoja de Vida
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/certificado">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        data-testid="menu-item-certificate"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Certificado de Antecedentes
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={logout}
                      data-testid="menu-item-logout"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={login} data-testid="button-login">
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
