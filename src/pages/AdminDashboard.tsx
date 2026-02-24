import { useState, useEffect } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck, Sparkles, Activity, Users, Home, Compass,
    ArrowUpRight, AlertCircle, FileText, CheckCircle2,
    Trash2, Search, ShieldAlert,
    Clock, Check, X, Star,
    Ticket, MessageSquare, History, Phone, Mail, Eye,
    TrendingUp, Award, UserCheck, ThumbsUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
    const { toast } = useToast();
    const [activeView, setActiveView] = useState("overview"); // overview, tourists, guides, stays, tours, bookings, support, reviews
    const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
    const [detailedItem, setDetailedItem] = useState<{ type: string, data: any } | null>(null);

    // Platform Health Stats
    const stats = [
        { label: "Active Stays", value: "2.4K", icon: Home, color: "bg-secondary" },
        { label: "Verified Guides", value: "856", icon: Compass, color: "bg-nature" },
        { label: "Total Users", value: "1.2M", icon: Users, color: "bg-primary" },
        { label: "System Health", value: "99.9%", icon: Activity, color: "bg-gold" }
    ];

    // --- State with localStorage persistence ---

    // Activities/Reports (Main feed)
    const [reports, setReports] = useState<any[]>(() => {
        const saved = localStorage.getItem('admin_reports');
        return saved ? JSON.parse(saved) : [
            {
                id: "r1",
                title: "New Host Application",
                user: "Amit Verma",
                date: "2 mins ago",
                type: "Application",
                priority: "High",
                details: "Applicant Amit Verma submitted documentation for 'Haridwar Riverside Villa'. Background check initiated."
            }
        ];
    });

    // Managed Entities
    const [tourists, setTourists] = useState<any[]>(() => {
        const saved = localStorage.getItem('admin_tourists');
        return saved ? JSON.parse(saved) : [
            { id: "t1", name: "Rahul Sharma", email: "rahul@example.com", joined: "Jan 2026", bookings: 3, status: "Active" },
            { id: "t2", name: "Priya Das", email: "priya@example.com", joined: "Feb 2026", bookings: 1, status: "Active" }
        ];
    });

    const [guides, setGuides] = useState<any[]>(() => {
        const saved = localStorage.getItem('admin_guides');
        return saved ? JSON.parse(saved) : [
            { id: "g1", name: "Tenzing Rigzin", email: "tenzing@guide.in", location: "Manali", rating: 4.9, status: "Verified", specialized: ["Trekking", "Local Culture"] },
            { id: "g2", name: "Sunil K.", email: "sunil@guide.in", location: "Varanasi", rating: 4.7, status: "Verified", specialized: ["History", "Ghat Tours"] }
        ];
    });

    const [stays, setStays] = useState<any[]>(() => {
        const saved = localStorage.getItem('admin_stays');
        return saved ? JSON.parse(saved) : [
            { id: "s1", name: "Heritage Haveli", owner: "Arjun S.", location: "Jaipur", price: "₹2,900", status: "Active" }
        ];
    });

    const [tours, setTours] = useState<any[]>(() => {
        const saved = localStorage.getItem('guide_experiences');
        return saved ? JSON.parse(saved) : [];
    });

    const [bookings, setBookings] = useState<any[]>(() => {
        const saved = localStorage.getItem('admin_bookings');
        return saved ? JSON.parse(saved) : [
            { id: "b1", entity: "Heritage Haveli", user: "Rahul Sharma", userEmail: "rahul@example.com", date: "Apr 12, 2026", status: "Confirmed", amount: "₹8,700" },
            { id: "b2", entity: "Ghats Night Walk", user: "Rahul Sharma", userEmail: "rahul@example.com", date: "Apr 14, 2026", status: "Pending", amount: "₹1,500" }
        ];
    });

    const [reviews, setReviews] = useState<any[]>(() => {
        const saved = localStorage.getItem('admin_reviews');
        return saved ? JSON.parse(saved) : [
            { id: "rev1", user: "Rahul Sharma", target: "Heritage Haveli", type: "Stay", rating: 5, comment: "Breathtaking views and amazing hospitality!", date: "Yesterday" }
        ];
    });

    // --- Derived State ---
    const supportMessages = reports.filter(r => r.type === 'Support');

    // --- Persistence Effects ---
    useEffect(() => { localStorage.setItem('admin_reports', JSON.stringify(reports)); }, [reports]);
    useEffect(() => { localStorage.setItem('admin_tourists', JSON.stringify(tourists)); }, [tourists]);
    useEffect(() => { localStorage.setItem('admin_guides', JSON.stringify(guides)); }, [guides]);
    useEffect(() => { localStorage.setItem('admin_stays', JSON.stringify(stays)); }, [stays]);
    useEffect(() => { localStorage.setItem('guide_experiences', JSON.stringify(tours)); }, [tours]);
    useEffect(() => { localStorage.setItem('admin_bookings', JSON.stringify(bookings)); }, [bookings]);
    useEffect(() => { localStorage.setItem('admin_reviews', JSON.stringify(reviews)); }, [reviews]);

    // --- Handlers ---
    const handleDelete = (type: string, id: string) => {
        if (type === 'tourist') setTourists(prev => prev.filter(t => t.id !== id));
        if (type === 'guide') setGuides(prev => prev.filter(g => g.id !== id));
        if (type === 'stay') setStays(prev => prev.filter(s => s.id !== id));
        if (type === 'tour') setTours(prev => prev.filter(t => t.id !== id));
        if (type === 'booking') setBookings(prev => prev.filter(b => b.id !== id));
        if (type === 'review') setReviews(prev => prev.filter(r => r.id !== id));
        if (type === 'report' || type === 'support') setReports(prev => prev.filter(r => r.id !== id));

        toast({
            title: "Administrative Action",
            description: `Permanently removed ${type} record #${id}.`,
            variant: "destructive"
        });
    };

    const resolveReport = (id: string) => {
        setReports(prev => prev.filter(r => r.id !== id));
        setSelectedActivity(null);
        toast({ title: "Resolved", description: "Issue archived successfully." });
    };

    const approveApplication = (report: any) => {
        if (report.type === 'Support') {
            resolveReport(report.id);
            toast({ title: "Responded", description: "Inquiry marked as handled." });
            return;
        }

        if (report.tourId) {
            setTours(prev => prev.map(t => t.id === report.tourId ? { ...t, status: "Active" } : t));
            toast({ title: "Tour Approved", description: "Experience is now live for travelers." });
        } else if (report.applicationId) {
            // Logic for host app approval (already implemented in earlier phases)
        }
        resolveReport(report.id);
    };

    const updateBookingStatus = (id: string, status: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        toast({ title: "Status Updated", description: `Booking #${id} is now ${status}.` });
    };

    return (
        <div className="min-h-screen bg-muted/20 selection:bg-secondary/20 font-sans">
            <NavigationHeader />
            <main className="pt-32 pb-16 px-6">
                <div className="container mx-auto max-w-7xl animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/5 rounded-full border border-secondary/20">
                                <ShieldCheck className="w-4 h-4 text-secondary" />
                                <span className="text-secondary font-black uppercase tracking-[0.2em] text-[10px]">Master Administrative Hub</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-foreground leading-none">
                                Platform <br />
                                <span className="text-secondary italic">Access.</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap bg-white dark:bg-card p-2 rounded-3xl shadow-premium border border-border/50">
                            {[
                                { id: "overview", label: "Dashboard", icon: Activity },
                                { id: "tourists", label: "Users", icon: Users },
                                { id: "stays", label: "Stays", icon: Home },
                                { id: "tours", label: "Tours", icon: Compass },
                                { id: "bookings", label: "Bookings", icon: Ticket },
                                { id: "support", label: "Support", icon: MessageSquare },
                                { id: "reviews", label: "Feedback", icon: ThumbsUp }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveView(tab.id)}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === tab.id ? "bg-secondary text-white shadow-glow" : "text-muted-foreground hover:bg-muted/50"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Views */}
                    <div className="animate-scale-in">
                        {activeView === 'overview' && (
                            <div className="space-y-12">
                                <div className="grid lg:grid-cols-4 gap-6">
                                    {stats.map((stat, i) => (
                                        <Card key={i} className="rounded-[2.5rem] border-border/50 shadow-soft overflow-hidden group hover:shadow-premium transition-all">
                                            <CardContent className="p-8 flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-glow ${stat.color} group-hover:rotate-12 transition-all`}>
                                                    <stat.icon className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                                                    <h4 className="text-2xl font-display font-black">{stat.value}</h4>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <h2 className="text-3xl font-display font-black">Live Platform Feed</h2>
                                        <div className="space-y-4">
                                            {reports.length === 0 ? (
                                                <div className="p-20 text-center bg-white/50 rounded-[3rem] border border-dashed border-border/50">
                                                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                                    <p className="font-black text-muted-foreground uppercase tracking-widest text-xs italic">All systems Green</p>
                                                </div>
                                            ) : (
                                                reports.map((report) => (
                                                    <Card key={report.id} className="rounded-[2.5rem] bg-white border-border/50 shadow-soft hover:shadow-premium transition-all group cursor-pointer overflow-hidden border-l-4 border-l-secondary" onClick={() => setSelectedActivity(report)}>
                                                        <CardContent className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                                                                    {report.type === 'Support' ? <MessageSquare className="w-7 h-7" /> : <TrendingUp className="w-7 h-7" />}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-black text-xl group-hover:text-secondary transition-colors">{report.title}</h4>
                                                                    <p className="text-xs font-bold text-muted-foreground opacity-60 italic">Source: {report.user} • {report.date}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic ${report.type === 'Support' ? 'bg-nature/10 text-nature' : 'bg-secondary/10 text-secondary'
                                                                    }`}>{report.type}</div>
                                                                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                                                                    <ArrowUpRight className="w-6 h-6" />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <h2 className="text-3xl font-display font-black">Admin Intelligence</h2>
                                        <Card className="rounded-[3rem] p-10 bg-foreground text-background shadow-premium space-y-8 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-tricolor opacity-10" />
                                            <div className="relative z-10 space-y-8">
                                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                                                    <ShieldCheck className="w-10 h-10 text-nature" />
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <h3 className="text-3xl font-display font-black tracking-tighter">Ultimate Control</h3>
                                                    <p className="text-xs font-medium opacity-60 uppercase tracking-[0.2em] font-sans">Full Database Override Active</p>
                                                </div>
                                                <div className="space-y-3">
                                                    <Button className="w-full h-18 py-6 rounded-2xl bg-secondary text-white font-black text-[10px] uppercase tracking-widest shadow-glow hover:scale-[1.03] transition-transform">
                                                        <ShieldAlert className="w-6 h-6 mr-3" /> System Lockdown
                                                    </Button>
                                                    <Button variant="outline" className="w-full h-18 py-6 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest">
                                                        <History className="w-6 h-6 mr-3" /> Full Logs Access
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Data Tables */}
                        {activeView !== 'overview' && (
                            <div className="bg-white dark:bg-card rounded-[3.5rem] border border-border/50 shadow-premium overflow-hidden border-t-8 border-t-secondary animate-scale-in">
                                <div className="p-10 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-muted/10">
                                    <h2 className="text-4xl font-display font-black capitalize italic">{activeView} Central</h2>
                                    <div className="relative w-full sm:w-[400px]">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input type="text" placeholder={`Deep search in ${activeView}...`} className="w-full pl-16 h-16 rounded-3xl bg-white border-2 border-transparent focus:border-secondary transition-all outline-none font-bold shadow-soft" />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-muted/30">
                                                <th className="p-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground">Detailed Identity</th>
                                                <th className="p-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground">Metric Signature</th>
                                                <th className="p-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground text-center">Override</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {activeView === 'tourists' && tourists.map(tourist => (
                                                <tr key={tourist.id} className="hover:bg-muted/5 transition-colors group">
                                                    <td className="p-10">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary font-display font-black text-2xl border-2 border-primary/20">
                                                                {tourist.name[0]}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="font-black text-2xl group-hover:text-secondary transition-colors">{tourist.name}</div>
                                                                <div className="text-sm font-bold text-muted-foreground opacity-70 italic">{tourist.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-10">
                                                        <div className="flex items-center gap-4 text-sm font-black text-muted-foreground">
                                                            <div className="px-3 py-1 bg-muted/50 rounded-lg">JOINED: {tourist.joined}</div>
                                                            <Button variant="ghost" className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg italic hover:bg-secondary/20" onClick={() => setDetailedItem({ type: 'user_bookings', data: { user: tourist.name, email: tourist.email } })}>
                                                                VIEW {tourist.bookings} BOOKINGS <ArrowUpRight className="w-3 h-3 ml-2" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="p-10 text-center">
                                                        <Button variant="ghost" className="w-14 h-14 rounded-2xl text-destructive hover:bg-destructive/10" onClick={() => handleDelete('tourist', tourist.id)}>
                                                            <Trash2 className="w-7 h-7" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeView === 'stays' && stays.map(stay => (
                                                <tr key={stay.id} className="hover:bg-muted/5 transition-colors group">
                                                    <td className="p-10">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 flex items-center justify-center text-secondary border-2 border-secondary/20">
                                                                <Home className="w-8 h-8" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="font-black text-2xl group-hover:text-secondary transition-colors">{stay.name}</div>
                                                                <div className="text-sm font-bold text-muted-foreground opacity-70 italic font-sans">owned by {stay.owner}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-10">
                                                        <div className="flex items-center gap-4 text-sm font-black text-muted-foreground">
                                                            <div className="px-3 py-1 bg-muted/50 rounded-lg">{stay.location}</div>
                                                            <div className="px-3 py-1 bg-nature/10 text-nature rounded-lg">{stay.price} / night</div>
                                                            <Button variant="ghost" className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg" onClick={() => setDetailedItem({ type: 'stay_reviews', data: stay })}>
                                                                REVIEWS <Star className="w-3 h-3 ml-2 fill-current" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="p-10 text-center">
                                                        <Button variant="ghost" className="w-14 h-14 rounded-2xl text-destructive hover:bg-destructive/10" onClick={() => handleDelete('stay', stay.id)}>
                                                            <Trash2 className="w-7 h-7" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeView === 'bookings' && bookings.map(booking => (
                                                <tr key={booking.id} className="hover:bg-muted/5 transition-colors group">
                                                    <td className="p-10">
                                                        <div className="space-y-1">
                                                            <div className="font-black text-2xl group-hover:text-secondary transition-colors">{booking.entity}</div>
                                                            <div className="text-sm font-bold text-muted-foreground opacity-70 italic font-sans">Booked by {booking.user} ({booking.userEmail}) on {booking.date}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-10">
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-xl font-black text-nature">{booking.amount}</div>
                                                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${booking.status === 'Confirmed' ? 'bg-nature/10 text-nature' : 'bg-gold/10 text-gold'
                                                                }`}>{booking.status}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-10 text-center space-x-2">
                                                        <Button variant="ghost" className="w-12 h-12 rounded-xl text-nature hover:bg-nature/10" onClick={() => updateBookingStatus(booking.id, 'Confirmed')}>
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </Button>
                                                        <Button variant="ghost" className="w-12 h-12 rounded-xl text-destructive hover:bg-destructive/10" onClick={() => handleDelete('booking', booking.id)}>
                                                            <Trash2 className="w-6 h-6" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeView === 'support' && supportMessages.map(msg => (
                                                <tr key={msg.id} className="hover:bg-muted/5 transition-colors group">
                                                    <td className="p-10">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 rounded-[1.5rem] bg-nature/10 flex items-center justify-center text-nature border-2 border-nature/20">
                                                                <MessageSquare className="w-8 h-8" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="font-black text-2xl group-hover:text-secondary transition-colors">{msg.user}</div>
                                                                <div className="text-sm font-bold text-muted-foreground opacity-70 italic font-sans">{msg.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-10">
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-foreground text-sm leading-tight max-w-md truncate">
                                                                {(msg.details || "").replace('[Subject: ', '').split('] - Message: ')[0]}
                                                            </div>
                                                            <div className="text-xs font-bold text-muted-foreground italic font-sans">Received {msg.date}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-10 text-center space-x-2">
                                                        <Button variant="ghost" className="w-12 h-12 rounded-xl text-secondary hover:bg-secondary/10" onClick={() => setSelectedActivity(msg)}>
                                                            <Eye className="w-6 h-6" />
                                                        </Button>
                                                        <Button variant="ghost" className="w-12 h-12 rounded-xl text-destructive hover:bg-destructive/10" onClick={() => handleDelete('support', msg.id)}>
                                                            <Trash2 className="w-6 h-6" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeView === 'reviews' && reviews.map(rev => (
                                                <tr key={rev.id} className="hover:bg-muted/5 transition-colors group">
                                                    <td className="p-10">
                                                        <div className="space-y-1">
                                                            <div className="font-black text-2xl group-hover:text-secondary transition-colors">{rev.user}</div>
                                                            <div className="text-sm font-bold text-muted-foreground opacity-70 italic font-sans">Reviewed {rev.target} ({rev.type})</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-10">
                                                        <div className="space-y-2">
                                                            <div className="flex gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-gold text-gold' : 'text-muted'}`} />
                                                                ))}
                                                            </div>
                                                            <p className="text-xs font-bold text-muted-foreground italic max-w-sm line-clamp-1">"{rev.comment}"</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-10 text-center">
                                                        <Button variant="ghost" className="w-14 h-14 rounded-2xl text-destructive hover:bg-destructive/10" onClick={() => handleDelete('review', rev.id)}>
                                                            <Trash2 className="w-7 h-7" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {activeView === 'support' && supportMessages.length === 0 && (
                                    <div className="p-20 text-center bg-muted/5">
                                        <p className="font-black text-muted-foreground uppercase tracking-widest text-[10px] italic">No archived support inquiries found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Platform Activity Modal (Standard) */}
            {selectedActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in">
                    <div className="bg-white dark:bg-card p-16 rounded-[4rem] w-full max-w-3xl shadow-premium border-4 border-secondary/20 animate-scale-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-tricolor" />

                        <div className="space-y-12">
                            <div className="flex items-start justify-between">
                                <div className="space-y-4">
                                    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-soft ${selectedActivity.type === 'Support' ? 'bg-nature/10 text-nature' : 'bg-secondary/10 text-secondary'
                                        }`}>
                                        <AlertCircle className="w-4 h-4" /> {selectedActivity.type} Action Required
                                    </div>
                                    <h3 className="text-5xl font-display font-black tracking-tight leading-tight">{selectedActivity.title}</h3>
                                    <p className="text-lg text-muted-foreground font-bold italic font-sans flex items-center gap-3">
                                        <Mail className="w-5 h-5" /> {selectedActivity.email || selectedActivity.user}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedActivity(null)} className="p-4 bg-muted/50 rounded-3xl hover:bg-muted transition-all text-muted-foreground hover:rotate-90">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="bg-muted/30 p-12 rounded-[3.5rem] border-2 border-border/50 relative overflow-hidden group shadow-inner">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all" />
                                <span className="relative z-10 text-2xl font-medium leading-relaxed italic text-muted-foreground block font-sans">
                                    "{selectedActivity.details}"
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <Button variant="outline" className="h-20 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] border-2 border-muted-foreground/20 hover:bg-destructive hover:text-white hover:border-destructive transition-all" onClick={() => resolveReport(selectedActivity.id)}>
                                    <Trash2 className="w-6 h-6 mr-3" /> Discard
                                </Button>
                                <Button className={`h-20 rounded-[2.5rem] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-glow flex items-center justify-center gap-4 hover:scale-105 transition-all ${selectedActivity.type === 'Support' ? 'bg-nature' : 'bg-secondary'
                                    }`} onClick={() => approveApplication(selectedActivity)}>
                                    <CheckCircle2 className="w-7 h-7" /> {selectedActivity.type === 'Support' ? 'Resolved' : 'Authorize'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Deep Detail Modal (Cross-linking) */}
            {detailedItem && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-fade-in">
                    <div className="bg-white dark:bg-card p-16 rounded-[4rem] w-full max-w-4xl shadow-premium border-4 border-primary/20 animate-scale-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-3 bg-primary" />

                        <div className="space-y-12">
                            <div className="flex items-start justify-between">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                                        <TrendingUp className="w-4 h-4" /> Comprehensive Data Insight
                                    </div>
                                    <h3 className="text-5xl font-display font-black tracking-tight">
                                        {detailedItem.type === 'user_bookings' ? `${detailedItem.data.user}'s Timeline` : `Reviews for ${detailedItem.data.name}`}
                                    </h3>
                                </div>
                                <button onClick={() => setDetailedItem(null)} className="p-4 bg-muted/50 rounded-3xl hover:bg-muted transition-all">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="max-h-[50vh] overflow-y-auto pr-6 space-y-6">
                                {detailedItem.type === 'user_bookings' ? (
                                    bookings.filter(b => b.userEmail === detailedItem.data.email).map(b => (
                                        <div key={b.id} className="p-8 bg-muted/20 rounded-[2.5rem] border border-border/50 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-soft">
                                                    <Ticket className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-xl">{b.entity}</h4>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-sans">{b.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-2xl text-nature">{b.amount}</p>
                                                <p className="text-[10px] font-black uppercase text-gold">{b.status}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    reviews.filter(r => r.target === detailedItem.data.name).map(r => (
                                        <div key={r.id} className="p-8 bg-muted/20 rounded-[2.5rem] border border-border/50 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{r.user[0]}</div>
                                                    <div>
                                                        <h4 className="font-black text-lg">{r.user}</h4>
                                                        <div className="flex gap-1">
                                                            {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-muted-foreground uppercase opacity-60">{r.date}</span>
                                            </div>
                                            <p className="text-lg font-medium italic text-foreground/80 font-sans">"{r.comment}"</p>
                                        </div>
                                    ))
                                )}
                                {(detailedItem.type === 'user_bookings' && bookings.filter(b => b.userEmail === detailedItem.data.email).length === 0) && (
                                    <p className="text-center py-10 font-black text-muted-foreground uppercase tracking-widest text-xs">No bookings found for this explorer.</p>
                                )}
                            </div>

                            <Button className="w-full h-18 rounded-2xl bg-foreground text-background font-black text-[10px] uppercase tracking-widest" onClick={() => setDetailedItem(null)}>
                                Close Explorer View
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
