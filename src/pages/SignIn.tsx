import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Mail, Lock, User, Loader2, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Please select your account type first");
      return;
    }

    setIsLoading(true);
    try {
      // Hardcoded Admin Override
      if (email === "aditya@gmail.com" && password === "123456") {
        toast.success("Master Admin Access Granted");
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('user_name', 'Super Master');
        navigate("/admin-dashboard");
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        localStorage.setItem('user_role', selectedRole);

        // Try to recover name from previous logs or set a default if not found
        const existingName = localStorage.getItem('user_name') || email.split('@')[0];
        localStorage.setItem('user_name', existingName);

        const adminReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
        const userName = localStorage.getItem('user_name') || email.split('@')[0];
        adminReports.unshift({
          id: `log_${Math.random().toString(36).substr(2, 9)}`,
          title: "User Session Started",
          user: userName,
          date: "Just now",
          type: "Activity",
          details: `Explorer ${userName} (${email}) logged into the platform as ${selectedRole}.`,
          email: email
        });
        localStorage.setItem('admin_reports', JSON.stringify(adminReports.slice(0, 50)));

        toast.success(`Welcome back ${userName}!`);
        navigate(rolePaths[selectedRole as keyof typeof rolePaths]);
      } else {
        const { error } = await signUp(email, password, fullName || email.split('@')[0]);
        if (error) throw error;
        localStorage.setItem('user_role', selectedRole);
        localStorage.setItem('user_name', fullName || email.split('@')[0]);

        // Log Register Activity for Admin
        const adminReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
        const userName = fullName || email.split('@')[0];
        adminReports.unshift({
          id: `reg_${Math.random().toString(36).substr(2, 9)}`,
          title: "New Identity Created",
          user: userName,
          date: "Just now",
          type: "Activity",
          details: `A new ${selectedRole} account was registered for ${userName} (${email}).`,
          email: email
        });
        localStorage.setItem('admin_reports', JSON.stringify(adminReports.slice(0, 50)));

        toast.success(`Account created for ${userName}!`);
        navigate(rolePaths[selectedRole as keyof typeof rolePaths]);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const rolePaths = {
    tourist: "/tourist-dashboard",
    host: "/host-dashboard",
    guide: "/guide-dashboard",
    admin: "/admin-dashboard"
  };

  const roles = [
    {
      id: "tourist",
      title: "Explorer",
      description: "Discover hidden gems",
      icon: User,
      color: "border-secondary text-secondary bg-secondary/5"
    },
    {
      id: "host",
      title: "Host",
      description: "List your property",
      icon: Home,
      color: "border-nature text-nature bg-nature/5"
    },
    {
      id: "guide",
      title: "Local Expert",
      description: "Guide local tours",
      icon: Sparkles,
      color: "border-primary text-primary bg-primary/5"
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage platform",
      icon: ShieldCheck,
      color: "border-gray-500 text-gray-500 bg-gray-500/5"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden selection:bg-secondary/20 font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-tricolor opacity-5" />
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 relative z-10">
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tighter">
              Choose your <br />
              <span className="text-secondary italic">Identity</span>
            </h1>
            <p className="text-muted-foreground font-medium">Select how you want to experience TourNest.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((role) => (
              <Card
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`cursor-pointer transition-all duration-300 rounded-[2rem] border-2 shadow-soft hover:shadow-premium group overflow-hidden ${selectedRole === role.id
                  ? `border-primary bg-card`
                  : 'border-border grayscale hover:grayscale-0 bg-card/50'
                  }`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${selectedRole === role.id ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                    <role.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{role.title}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{role.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className={`animate-scale-in delay-200 ${!selectedRole ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="bg-white dark:bg-card/50 backdrop-blur-xl p-10 rounded-[3rem] shadow-premium border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary via-white to-nature" />
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-black tracking-tight">
                  {isLogin ? "Welcome Back" : "Start Journey"}
                </h2>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  {selectedRole ? `As a ${selectedRole}` : "Select a role to continue"}
                </p>
              </div>
              <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2 animate-fade-in">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-secondary transition-all font-bold"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-secondary transition-all font-bold"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-secondary transition-all font-bold"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-secondary text-white font-black text-lg shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {isLogin ? "Sign In" : "Sign Up"}
                    </>
                  )}
                </Button>
              </form>
              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-bold text-muted-foreground hover:text-secondary transition-colors"
                >
                  {isLogin ? "New explorer? Create an account" : "Already have an identity? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
