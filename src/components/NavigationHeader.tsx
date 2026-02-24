import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Home, User, Menu, Heart, LogOut, Mail, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NavigationHeader = () => {
  const { user, signOut } = useAuth();

  const getInitials = () => {
    const name = localStorage.getItem('user_name');
    if (name) return name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const getUserDisplayName = () => {
    return localStorage.getItem('user_name') || user?.email?.split('@')[0] || "Explorer";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-display font-black text-foreground tracking-tighter">TourNest</span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70 ml-0.5">India</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link to="/homestays" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
              Stays
            </Link>
            <Link to="/attractions" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
              Tours
            </Link>
            <Link to="/contact" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
              Support
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-4">
              <Link to="/become-host">
                <Button variant="ghost" className="rounded-xl font-bold text-primary hover:bg-primary/5 px-6">
                  Join as Host
                </Button>
              </Link>
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/favorites">
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5">
                    <Heart className="w-5 h-5 text-primary" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-2xl p-0 hover:scale-105 transition-transform">
                      <Avatar className="h-12 w-12 border-2 border-primary/20 rounded-2xl">
                        <AvatarFallback className="bg-primary text-white font-black text-lg rounded-2xl">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-3 rounded-3xl mt-4 shadow-premium border-border/50" align="end">
                    <div className="p-4 mb-2 bg-muted/50 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Welcome back,</p>
                      <p className="font-black text-xl text-foreground truncate">{getUserDisplayName()}</p>
                      <p className="text-[10px] font-bold text-muted-foreground truncate opacity-70">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-primary/5 cursor-pointer">
                      <Link to="/tourist-dashboard" className="flex items-center font-bold">
                        <User className="mr-3 h-5 w-5 text-primary" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-primary/5 cursor-pointer">
                      <Link to="/favorites" className="flex items-center font-bold">
                        <Heart className="mr-3 h-5 w-5 text-primary" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem onClick={signOut} className="rounded-xl p-3 focus:bg-destructive/10 text-destructive cursor-pointer font-bold">
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="h-12 px-8 rounded-2xl bg-primary text-white font-bold shadow-glow hover:scale-105 transition-transform group">
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Login
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className="lg:hidden rounded-xl">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;