import { useState, useEffect } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Compass, Sparkles, MapPin, Star, Plus, Settings,
    MessageSquare, ArrowUpRight, BarChart, Users,
    X, Clock, IndianRupee, Image as ImageIcon, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GuideDashboard = () => {
    const { toast } = useToast();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [newTour, setNewTour] = useState({
        title: "",
        location: "",
        price: 1500,
        description: "",
        duration: "3 Hours",
        category: "Spiritual"
    });

    // State with localStorage persistence
    const [experiences, setExperiences] = useState<any[]>(() => {
        const saved = localStorage.getItem('guide_experiences');
        return saved ? JSON.parse(saved) : [
            {
                id: "e1",
                title: "Varanasi Morning Exploration",
                location: "Kashi, Uttar Pradesh",
                price: 1200,
                bookings: 84,
                rating: 4.9,
                status: "High Demand"
            }
        ];
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('guide_experiences', JSON.stringify(experiences));
    }, [experiences]);

    const handleCreateTour = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock delay for premium feel
        setTimeout(() => {
            const tourId = `exp_${Math.random().toString(36).substr(2, 9)}`;
            const tourData = {
                ...newTour,
                id: tourId,
                bookings: 0,
                rating: 0,
                status: "Pending Review"
            };

            // 1. Save to experiences
            setExperiences(prev => [tourData, ...prev]);

            // 2. Inject into Admin Activity Feed
            const adminReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
            const newReport = {
                id: `r_${tourId}`,
                title: "New Experience Listed",
                user: "Guide-Team",
                date: "Just now",
                type: "Review",
                priority: "Normal",
                details: `New tour proposal: '${tourData.title}' in ${tourData.location}. Expected reward: ₹${tourData.price}.`,
                tourId: tourId
            };
            localStorage.setItem('admin_reports', JSON.stringify([newReport, ...adminReports]));

            setIsSubmitting(false);
            setIsCreateModalOpen(false);
            setNewTour({ title: "", location: "", price: 1500, description: "", duration: "3 Hours", category: "Spiritual" });

            toast({
                title: "Experience Created!",
                description: "Your tour is now under review by our Admin team.",
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-muted/20 selection:bg-secondary/20 font-sans">
            <NavigationHeader />
            <main className="pt-32 pb-16 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/5 rounded-full">
                                <Sparkles className="w-4 h-4 text-secondary" />
                                <span className="text-secondary font-black uppercase tracking-[0.2em] text-[10px]">Guide Story Studio</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-foreground leading-none">
                                Your Story <br />
                                <span className="text-secondary italic">Studio.</span>
                            </h1>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="h-16 px-10 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest shadow-glow hover:scale-105 transition-transform flex items-center gap-3"
                        >
                            <Plus className="w-6 h-6" />
                            Create New Tour
                        </Button>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Stats Hub */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="rounded-[2.5rem] border-border/50 shadow-soft overflow-hidden group hover:shadow-premium transition-all">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 bg-nature rounded-2xl flex items-center justify-center text-white shadow-glow">
                                            <BarChart className="w-6 h-6" />
                                        </div>
                                        <ArrowUpRight className="w-6 h-6 text-muted-foreground opacity-30" />
                                    </div>
                                    <div>
                                        <h4 className="text-4xl font-display font-black">₹42.5K</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Earnings this Month</p>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-nature w-[70%]" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[2.5rem] border-border/50 shadow-soft overflow-hidden group hover:shadow-premium transition-all">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-glow">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <ArrowUpRight className="w-6 h-6 text-muted-foreground opacity-30" />
                                    </div>
                                    <div>
                                        <h4 className="text-4xl font-display font-black">1.2K</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">People Guided</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-8 bg-foreground text-background rounded-[3rem] shadow-premium space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <h3 className="text-2xl font-display font-black leading-tight relative">Insight of the Day</h3>
                                <p className="text-sm font-medium opacity-70 italic leading-relaxed relative">
                                    "Heritage walks are trending! Travelers are looking for stories about ancient architecture in your region."
                                </p>
                                <Button className="w-full bg-white text-foreground font-black text-[10px] uppercase tracking-widest rounded-xl h-12 relative">View Hub</Button>
                            </div>
                        </div>

                        {/* Active Experiences */}
                        <div className="lg:col-span-3 space-y-8 animate-scale-in">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-display font-black">Active Experiences</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-xl border-border/50"><Settings className="w-5 h-5 text-muted-foreground" /></Button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {experiences.map((exp) => (
                                    <Card key={exp.id} className="group overflow-hidden rounded-[3rem] border-border/50 shadow-soft hover:shadow-premium transition-all border-2 hover:border-secondary/20 bg-white dark:bg-card">
                                        <CardContent className="p-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                                                    <Compass className="w-8 h-8" />
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${exp.status === 'High Demand' ? 'bg-nature/10 text-nature' : 'bg-secondary/10 text-secondary'
                                                    }`}>
                                                    {exp.status}
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-10">
                                                <h3 className="text-3xl font-display font-black leading-tight group-hover:text-secondary transition-colors line-clamp-2">{exp.title}</h3>
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold">
                                                    <MapPin className="w-4 h-4 text-secondary" />
                                                    {exp.location}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border/50">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Bookings</p>
                                                    <p className="text-2xl font-display font-black">{exp.bookings}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Guide Reward</p>
                                                    <p className="text-2xl font-display font-black text-secondary">₹{exp.price}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mt-10">
                                                <Button className="flex-1 h-14 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest shadow-glow hover:scale-105 transition-transform active:scale-95">Manage Experience</Button>
                                                <Button variant="ghost" className="h-14 w-15 rounded-2xl hover:bg-muted/50"><MessageSquare className="w-6 h-6 text-muted-foreground" /></Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Tour Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-in">
                    <div className="bg-white dark:bg-card p-12 rounded-[3.5rem] w-full max-w-2xl shadow-premium border border-border/50 animate-scale-in relative overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-tricolor" />

                        <div className="space-y-10">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/5 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary">
                                        <Plus className="w-3 h-3" /> New Experience
                                    </div>
                                    <h3 className="text-4xl font-display font-black tracking-tight">Design Your Tour</h3>
                                    <p className="text-muted-foreground font-bold text-sm italic">Share a piece of your world with travelers.</p>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-3 bg-muted/50 rounded-2xl hover:bg-muted transition-all text-muted-foreground">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTour} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Experience Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Midnight Heritage Walk in Hampi"
                                        value={newTour.title}
                                        onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                                        className="w-full h-16 px-6 rounded-2xl bg-muted/20 border-2 border-transparent focus:border-secondary outline-none transition-all font-bold text-lg"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="City, State"
                                                value={newTour.location}
                                                onChange={(e) => setNewTour({ ...newTour, location: e.target.value })}
                                                className="w-full h-16 pl-14 px-6 rounded-2xl bg-muted/20 border-2 border-transparent focus:border-secondary outline-none transition-all font-bold text-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Price per Person (INR)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-nature" />
                                            <input
                                                type="number"
                                                required
                                                value={newTour.price}
                                                onChange={(e) => setNewTour({ ...newTour, price: parseInt(e.target.value) || 0 })}
                                                className="w-full h-16 pl-14 px-6 rounded-2xl bg-muted/20 border-2 border-transparent focus:border-secondary outline-none transition-all font-bold text-lg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Story & Description</label>
                                    <textarea
                                        required
                                        placeholder="Describe the hidden alleys, the food, and the legends you'll share..."
                                        rows={4}
                                        value={newTour.description}
                                        onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                                        className="w-full p-8 rounded-[2.5rem] bg-muted/20 border-2 border-transparent focus:border-secondary outline-none transition-all font-medium text-lg resize-none italic leading-relaxed"
                                    />
                                </div>

                                <div className="pt-6">
                                    <Button type="submit" disabled={isSubmitting} className="w-full h-20 rounded-3xl bg-secondary text-white font-black text-xs uppercase tracking-[0.3em] shadow-glow hover:scale-[1.02] transition-transform active:scale-95">
                                        {isSubmitting ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            "Launch My Experience"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuideDashboard;
