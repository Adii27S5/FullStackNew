import { useState, useEffect } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Users, Star, Sparkles, TrendingUp, Inbox, Settings, Plus, Activity, MapPin } from "lucide-react";

// Mock assets
import jaipurHaveli from "@/assets/jaipur-haveli.jpg";

const HostDashboard = () => {
    const [activeTab, setActiveTab] = useState("listings");

    // State with localStorage persistence
    const [listings, setListings] = useState<any[]>(() => {
        const saved = localStorage.getItem('host_listings');
        return saved ? JSON.parse(saved) : [
            {
                id: "3",
                image: jaipurHaveli,
                title: "Heritage Palace Stay",
                location: "Jaipur, Rajasthan",
                price: 2800,
                rating: 4.7,
                bookings: 12,
                status: "Active"
            }
        ];
    });

    const [incomingBookings, setIncomingBookings] = useState<any[]>(() => {
        const saved = localStorage.getItem('host_bookings');
        return saved ? JSON.parse(saved) : [
            {
                id: "b2",
                guest: "Rohan Malhotra",
                place: "Heritage Palace Stay",
                date: "Mar 20 - Mar 22",
                amount: 5600,
                status: "Pending Approval"
            }
        ];
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('host_listings', JSON.stringify(listings));
    }, [listings]);

    useEffect(() => {
        localStorage.setItem('host_bookings', JSON.stringify(incomingBookings));
    }, [incomingBookings]);

    const stats = [
        { label: "Total Views", value: "8.4K", icon: Activity, color: "bg-secondary" },
        { label: "Bookings", value: "48", icon: Calendar, color: "bg-nature" },
        { label: "Revenue", value: "₹1.2L", icon: TrendingUp, color: "bg-primary" },
        { label: "Rating", value: "4.9", icon: Star, color: "bg-gold" }
    ];

    return (
        <div className="min-h-screen bg-muted/20 selection:bg-secondary/20">
            <NavigationHeader />
            <main className="pt-32 pb-16 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/5 rounded-full">
                                <Sparkles className="w-4 h-4 text-secondary" />
                                <span className="text-secondary font-black uppercase tracking-[0.2em] text-[10px]">Host Management Center</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-foreground leading-none">
                                Your Hospitality <br />
                                <span className="text-secondary italic">Empire.</span>
                            </h1>
                        </div>
                        <div className="flex bg-white dark:bg-card p-2 rounded-2xl shadow-soft border border-border/50">
                            {["listings", "bookings", "inbox"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-secondary text-white shadow-glow" : "text-muted-foreground hover:text-secondary"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, i) => (
                            <Card key={i} className="rounded-[2.5rem] border-border/50 shadow-soft overflow-hidden group hover:shadow-premium transition-all">
                                <CardContent className="p-8 flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-glow ${stat.color} group-hover:scale-110 transition-transform`}>
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

                    {activeTab === "listings" ? (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-display font-black">Your Properties</h2>
                                <Button className="h-14 px-8 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-xl flex items-center gap-3">
                                    <Plus className="w-5 h-5" />
                                    New Listing
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {listings.map((item) => (
                                    <Card key={item.id} className="group overflow-hidden rounded-[3rem] border-border/50 shadow-soft">
                                        <CardContent className="p-0 flex flex-col sm:flex-row">
                                            <div className="w-full sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                                            </div>
                                            <div className="p-8 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-2xl font-display font-black">{item.title}</h3>
                                                    <div className="bg-nature/10 text-nature px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{item.status}</div>
                                                </div>
                                                <p className="text-muted-foreground font-bold text-sm mb-6 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-secondary" />
                                                    {item.location}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</span>
                                                        <span className="text-xl font-display font-black text-secondary">₹{item.price}</span>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted"><Settings className="w-5 h-5 text-muted-foreground" /></Button>
                                                        <Button className="rounded-xl h-10 px-5 bg-muted/50 text-foreground font-bold text-xs">Edit</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-slide-up">
                            <h2 className="text-3xl font-display font-black">Incoming Bookings</h2>
                            <div className="bg-white dark:bg-card rounded-[3rem] border border-border/50 shadow-soft overflow-hidden">
                                <div className="p-8 overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border/50 text-left">
                                                <th className="pb-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Guest</th>
                                                <th className="pb-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Stay</th>
                                                <th className="pb-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Dates</th>
                                                <th className="pb-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                                                <th className="pb-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {incomingBookings.map((b) => (
                                                <tr key={b.id} className="group hover:bg-muted/30 transition-colors">
                                                    <td className="py-6 font-bold text-foreground flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-display font-black">
                                                            {b.guest.charAt(0)}
                                                        </div>
                                                        {b.guest}
                                                    </td>
                                                    <td className="py-6 font-bold text-muted-foreground">{b.place}</td>
                                                    <td className="py-6 font-bold text-muted-foreground">{b.date}</td>
                                                    <td className="py-6 font-display font-black text-secondary">₹{b.amount}</td>
                                                    <td className="py-6 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <Button variant="outline" className="h-10 px-6 rounded-xl border-2 border-nature text-nature font-black text-[10px] uppercase tracking-widest hover:bg-nature hover:text-white">Approve</Button>
                                                            <Button variant="ghost" className="h-10 px-6 rounded-xl text-destructive font-black text-[10px] uppercase tracking-widest hover:bg-destructive/10">Decline</Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HostDashboard;
