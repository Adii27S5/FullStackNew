import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NavigationHeader from "@/components/NavigationHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, MapPin, Bed, IndianRupee, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const hostSchema = z.object({
  propertyName: z.string().trim().min(3, "Property name must be at least 3 characters").max(100),
  propertyType: z.string().min(1, "Please select a property type"),
  propertyLocation: z.string().trim().min(3, "Location must be at least 3 characters").max(200),
  propertyDescription: z.string().trim().min(20, "Description must be at least 20 characters").max(2000),
  numRooms: z.number().min(1, "At least 1 room required").max(50),
  pricePerNight: z.number().min(800, "Price must be at least ₹800").max(100000)
});

const amenitiesList = [
  "WiFi", "Kitchen", "Parking", "Air Conditioning",
  "Power Backup", "Traditional Meals", "Garden", "Balcony", "Temple View", "Mountain View", "Pet Friendly"
];

const BecomeHost = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    propertyLocation: "",
    propertyDescription: "",
    numRooms: 1,
    pricePerNight: 2000,
    amenities: [] as string[]
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to become a host",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    } else {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      hostSchema.parse(formData);
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

    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to continue",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Mock Backend Submission via localStorage
    setTimeout(() => {
      const applicationId = `app_${Math.random().toString(36).substr(2, 9)}`;
      const applicationData = {
        ...formData,
        id: applicationId,
        userId: user.id,
        userName: user.email?.split('@')[0] || "User",
        submittedAt: new Date().toISOString(),
        status: "Pending"
      };

      // 1. Save to host_applications
      const existingApps = JSON.parse(localStorage.getItem('admin_host_applications') || '[]');
      localStorage.setItem('admin_host_applications', JSON.stringify([...existingApps, applicationData]));

      // 2. Inject into Admin Activity Feed (admin_reports)
      const existingReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
      const newReport = {
        id: `r_${applicationId}`,
        title: "New Host Application",
        user: applicationData.userName,
        date: "Just now",
        type: "Application",
        priority: "High",
        details: `${applicationData.userName} applied with '${applicationData.propertyName}' in ${applicationData.propertyLocation}. Type: ${applicationData.propertyType}.`,
        applicationId: applicationId // Link to the specific app
      };
      localStorage.setItem('admin_reports', JSON.stringify([newReport, ...existingReports]));

      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We will review your property and get back to you soon.",
      });
    }, 1200);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/20 selection:bg-secondary/20 font-sans">
        <NavigationHeader />
        <div className="pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center bg-white dark:bg-card p-12 rounded-[3.5rem] shadow-premium border border-border/50 animate-scale-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-tricolor" />
            <div className="w-24 h-24 bg-nature/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle className="w-12 h-12 text-nature" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 tracking-tight">
              Application Received!
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed italic px-6">
              "Atithi Devo Bhava" — Thank you for sharing your home. Our team will verify your heritage stay and get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="flex-1">
                <Button size="lg" className="w-full h-16 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
                  Back to Hub
                </Button>
              </Link>
              <Link to="/guest-dashboard" className="flex-1">
                <Button size="lg" className="w-full h-16 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest shadow-glow hover:scale-105 transition-transform">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 selection:bg-secondary/20 font-sans">
      <NavigationHeader />

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/5 rounded-full">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-black tracking-[0.2em] uppercase text-[10px]">Share Your Heritage</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black text-foreground tracking-tighter leading-none">
              Become an <span className="text-secondary italic">India Host</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed italic">
              Join the movement to preserve authentic Indian hospitality. Open your doors to the world and tell your story.
            </p>
          </div>

          <Card className="shadow-premium border border-border/50 rounded-[4rem] overflow-hidden bg-white dark:bg-card/50 backdrop-blur-md animate-scale-in">
            <div className="p-12 md:p-16 space-y-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-black flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                    <Home className="w-6 h-6" />
                  </div>
                  Property Story
                </h2>
                <p className="text-muted-foreground font-medium pl-16">
                  Tell us about your home, your story, and your city.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label htmlFor="propertyName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Property Name</Label>
                    <Input
                      id="propertyName"
                      placeholder="Royal Rajput Haveli"
                      value={formData.propertyName}
                      onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                      className="h-16 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-secondary focus:bg-white transition-all font-bold text-lg"
                    />
                    {errors.propertyName && <p className="text-xs text-destructive font-bold ml-2">{errors.propertyName}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="propertyType" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Stay Type</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                      <SelectTrigger className="h-16 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-secondary focus:bg-white transition-all font-bold text-lg">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="haveli">Heritage Haveli</SelectItem>
                        <SelectItem value="houseboat">Luxury Houseboat</SelectItem>
                        <SelectItem value="villa">Beach Villa</SelectItem>
                        <SelectItem value="cottage">Mountain Cottage</SelectItem>
                        <SelectItem value="apartment">Modern Apartment</SelectItem>
                        <SelectItem value="farm">Organic Farmstay</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.propertyType && <p className="text-xs text-destructive font-bold ml-2">{errors.propertyType}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="propertyLocation" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Location Pin</Label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <Input
                      id="propertyLocation"
                      placeholder="Old City, Jaipur, Rajasthan"
                      value={formData.propertyLocation}
                      onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                      className="h-16 pl-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-secondary focus:bg-white transition-all font-bold text-lg"
                    />
                  </div>
                  {errors.propertyLocation && <p className="text-xs text-destructive font-bold ml-2">{errors.propertyLocation}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="propertyDescription" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">The Story (Description)</Label>
                  <Textarea
                    id="propertyDescription"
                    placeholder="Describe the architecture, the food you serve, and the unique local experiences around your home..."
                    rows={6}
                    value={formData.propertyDescription}
                    onChange={(e) => setFormData({ ...formData, propertyDescription: e.target.value })}
                    className="rounded-[2.5rem] bg-muted/30 border-2 border-transparent focus:border-secondary focus:bg-white transition-all font-medium p-8 resize-none text-lg leading-relaxed shadow-inner"
                  />
                  {errors.propertyDescription && <p className="text-xs text-destructive font-bold ml-2">{errors.propertyDescription}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label htmlFor="numRooms" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Rooms for Guests</Label>
                    <div className="relative">
                      <Bed className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                      <Input
                        id="numRooms"
                        type="number"
                        min={1}
                        max={50}
                        value={formData.numRooms}
                        onChange={(e) => setFormData({ ...formData, numRooms: parseInt(e.target.value) || 1 })}
                        className="h-16 pl-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-secondary focus:bg-white transition-all font-bold text-lg"
                      />
                    </div>
                    {errors.numRooms && <p className="text-xs text-destructive font-bold ml-2">{errors.numRooms}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="pricePerNight" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Price per Night (INR)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-nature font-black" />
                      <Input
                        id="pricePerNight"
                        type="number"
                        min={800}
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData({ ...formData, pricePerNight: parseInt(e.target.value) || 800 })}
                        className="h-16 pl-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-secondary focus:bg-white transition-all font-bold text-lg"
                      />
                    </div>
                    {errors.pricePerNight && <p className="text-xs text-destructive font-bold ml-2">{errors.pricePerNight}</p>}
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-2">Premium Amenities</Label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-4 p-5 bg-muted/20 rounded-[1.5rem] hover:bg-muted/40 transition-all cursor-pointer group border border-transparent hover:border-secondary/20 shadow-soft">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                          className="w-5 h-5 rounded-lg border-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                        />
                        <Label htmlFor={amenity} className="text-sm font-black cursor-pointer transition-colors group-hover:text-secondary uppercase tracking-widest text-[11px]">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-10">
                  <Button type="submit" className="w-full h-20 rounded-3xl font-black text-xs uppercase tracking-[0.3em] bg-secondary text-white shadow-glow hover:scale-[1.02] transition-transform active:scale-95" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : null}
                    Submit My Application
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BecomeHost;
