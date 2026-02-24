import { useState } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, MessageSquare, Clock, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000)
});

const Contact = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      contactSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) fieldErrors[error.path[0] as string] = error.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsSubmitting(true);

    // Mock delay for premium feel
    setTimeout(() => {
      // Persist to Admin Activity Feed via localStorage
      const adminReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
      const reportId = `sup_${Math.random().toString(36).substr(2, 9)}`;

      const newReport = {
        id: reportId,
        title: "New Support Inquiry",
        user: formData.name,
        date: "Just now",
        type: "Support",
        priority: "Medium",
        details: `[Subject: ${formData.subject}] - Message: ${formData.message}`,
        email: formData.email
      };

      localStorage.setItem('admin_reports', JSON.stringify([newReport, ...adminReports]));

      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent successfully!");
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30">
        <NavigationHeader />
        <div className="pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center bg-white dark:bg-card p-12 rounded-[3rem] shadow-premium border border-border/50">
            <div className="w-20 h-20 bg-nature/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
              <CheckCircle className="w-10 h-10 text-nature" />
            </div>
            <h1 className="text-4xl font-display font-black text-foreground mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed italic">
              "The world is one family" — Your message is received. Our India team will get back to you within 24 hours.
            </p>
            <Button size="lg" className="h-14 px-10 rounded-2xl btn-premium bg-primary text-white font-bold" onClick={() => setSubmitted(false)}>
              Send Another Enquiry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 selection:bg-primary/20">
      <NavigationHeader />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-black tracking-widest uppercase text-xs">Always Here for You</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-foreground tracking-tight">
              Let's Start a <span className="text-primary italic">Story...</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Whether you're a traveler seeking adventures or a host with a story, we're just a message away.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {[
                { icon: Mail, title: "Mail Us", sub: "support@tournest.in", color: "bg-primary/10 text-primary", label: "General & Support" },
                { icon: Phone, title: "Call Us", sub: "+91 99887 76655", color: "bg-nature/10 text-nature", label: "24/7 Helpline" },
                { icon: MapPin, title: "Our Hub", sub: "7th Heaven, Cyber City, Gurgaon, India", color: "bg-blue-500/10 text-blue-500", label: "Main Office" },
                { icon: Clock, title: "Timeline", sub: "Response within 4 hours", color: "bg-orange-500/10 text-orange-500", label: "Average TAT" }
              ].map((item, i) => (
                <Card key={i} className="shadow-soft border-0 hover:shadow-premium transition-all hover:translate-x-2 rounded-2xl overflow-hidden group">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-70">{item.label}</p>
                      <h3 className="font-bold text-foreground mb-0.5">{item.title}</h3>
                      <p className="text-muted-foreground text-sm font-medium">{item.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 shadow-premium border-0 rounded-[3rem] overflow-hidden">
              <div className="h-4 bg-primary" />
              <CardHeader className="p-10 pb-6">
                <CardTitle className="text-3xl font-display font-bold flex items-center gap-3">
                  <MessageSquare className="w-7 h-7 text-primary" />
                  Your Message
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  We value your feedback and questions. Talk to us.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Aditya Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-14 rounded-2xl bg-muted/50 border-0 focus:ring-2 focus:ring-primary font-medium px-6"
                      />
                      {errors.name && <p className="text-xs text-destructive font-bold">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="aditya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-14 rounded-2xl bg-muted/50 border-0 focus:ring-2 focus:ring-primary font-medium px-6"
                      />
                      {errors.email && <p className="text-xs text-destructive font-bold">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help you explore India?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="h-14 rounded-2xl bg-muted/50 border-0 focus:ring-2 focus:ring-primary font-medium px-6"
                    />
                    {errors.subject && <p className="text-xs text-destructive font-bold">{errors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your thoughts, complaints, or curiosities..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="rounded-[2.5rem] bg-muted/50 border-0 focus:ring-2 focus:ring-primary font-medium p-8 resize-none"
                    />
                    {errors.message && <p className="text-xs text-destructive font-bold">{errors.message}</p>}
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full h-16 rounded-2xl font-bold text-xl btn-premium bg-primary text-white shadow-xl" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      ) : (
                        <Send className="w-6 h-6 mr-3" />
                      )}
                      Send My Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
