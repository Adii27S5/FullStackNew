import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NavigationHeader from "@/components/NavigationHeader";
import HeroSection from "@/components/HeroSection";
import HomestayCard from "@/components/HomestayCard";
import AttractionCard from "@/components/AttractionCard";
import StatsSection from "@/components/StatsSection";
import DestinationsSection from "@/components/DestinationsSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Home, Sparkles, Globe, Heart } from "lucide-react";

// India Assets
import manaliSnow from "@/assets/manali-snow.jpg";
import jaipurHaveli from "@/assets/jaipur-haveli.jpg";
import varanasiGhats from "@/assets/varanasi-ghats.jpg";
import keralaHouseboat from "@/assets/kerala-houseboat.jpg";
import goaBeach from "@/assets/goa-beach.jpg";
import munnarTea from "@/assets/munnar-tea.jpg";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const role = localStorage.getItem('user_role');

      // Hardcoded Admin check
      if (user.email === "aditya@gmail.com") {
        navigate("/admin-dashboard");
        return;
      }

      if (role) {
        const rolePaths: Record<string, string> = {
          tourist: "/tourist-dashboard",
          host: "/host-dashboard",
          guide: "/guide-dashboard",
          admin: "/admin-dashboard"
        };
        navigate(rolePaths[role] || "/tourist-dashboard");
      }
    }
  }, [user, loading, navigate]);
  const featuredStays = [
    {
      id: "3",
      image: jaipurHaveli,
      title: "Heritage Palace Stay",
      location: "Jaipur, Rajasthan",
      rating: 4.7,
      price: 2800,
      host: "Arjun Shekhawat",
      guests: 3,
      amenities: ["Heritage Decor", "Courtyard View", "Folk Music"]
    },
    {
      id: "4",
      image: goaBeach,
      title: "Azure Palms Homestay",
      location: "Anjuna, Goa",
      rating: 4.6,
      price: 1800,
      host: "Joao Fernandes",
      guests: 2,
      amenities: ["Pool", "Beach Access", "Garden"]
    },
    {
      id: "2",
      image: keralaHouseboat,
      title: "Luxury Houseboat Stay",
      location: "Alleppey, Kerala",
      rating: 4.8,
      price: 2800,
      host: "Meera Nair",
      guests: 2,
      amenities: ["Sunset Deck", "Traditional Food", "AC Rooms"]
    }
  ];

  const mustVisits = [
    {
      id: "ghat",
      image: varanasiGhats,
      title: "Evening Prayer Ceremony",
      location: "Varanasi, UP",
      duration: "Evening",
      rating: 5.0,
      category: "Spiritual",
      description: "Witness the magnificent spiritual spectacle that illuminates the sacred river every evening."
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-secondary/20">
      <NavigationHeader />
      <HeroSection />
      <StatsSection />
      <DestinationsSection />

      {/* Featured Homestays Section */}
      <section className="py-32 px-4 bg-white dark:bg-card/30 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/5 rounded-full">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-black uppercase tracking-[0.2em] text-[10px]">Premium Curations</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-foreground leading-[0.85]">
              Heritage <span className="text-secondary italic">Stays</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto font-medium">
              Handpicked heritage homestays that tell the story of India's rich architecture and warm hospitality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredStays.map((stay, index) => (
              <div key={stay.id} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                <Link to={`/homestay/${stay.id}`}>
                  <HomestayCard {...stay} />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link to="/homestays">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-foreground text-background font-black text-lg hover:bg-secondary hover:text-white transition-all shadow-xl group">
                Explore More Stays
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Local Attractions Section */}
      <section className="py-32 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-5xl md:text-7xl font-display font-black text-foreground tracking-tighter leading-none">
                Experience <br />
                <span className="text-nature italic">India</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                From the spiritual ghats of Varanasi to the tea estates of Munnar, discover India through the eyes of locals.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Star, text: "Curated by Local Guides" },
                  { icon: MapPin, text: "Hidden Gems of India" },
                  { icon: Heart, text: "Authentic Cultural Experiences" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold text-foreground/80">
                    <div className="w-10 h-10 bg-nature/10 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-nature" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
              <Link to="/attractions">
                <Button variant="outline" className="h-14 px-8 rounded-xl border-2 border-nature/20 text-nature font-black hover:bg-nature hover:text-white transition-all">
                  Browse All Tours
                </Button>
              </Link>
            </div>

            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-8">
                {mustVisits.map((attraction, index) => (
                  <AttractionCard key={index} {...attraction} />
                ))}
                <div className="bg-white dark:bg-card/50 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-soft border border-border/50 group hover:shadow-premium transition-all">
                  <div className="w-20 h-20 bg-nature/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="w-10 h-10 text-nature" />
                  </div>
                  <h3 className="text-2xl font-display font-black mb-4">Tea Estate Walks</h3>
                  <p className="text-muted-foreground mb-8 font-medium italic">"Walk through emerald blankets of tea plantations..."</p>
                  <Button variant="ghost" className="text-nature font-black uppercase tracking-widest text-xs">Book Tour →</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Community Section */}
      <section className="py-32 px-4 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto relative z-10 text-center space-y-12">
          <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-none mb-10">
            Be Part of our <br />
            <span className="text-background italic underline decoration-background/30">Community</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Travel", desc: "Unlock authentic Indian stays", link: "/homestays", icon: MapPin },
              { title: "Host", desc: "Share your heritage", link: "/become-host", icon: Home },
              { title: "Guide", desc: "Tell your local story", link: "/contact", icon: Sparkles }
            ].map((role, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 hover:bg-white/20 transition-all text-center group cursor-pointer">
                <role.icon className="w-12 h-12 mx-auto mb-6 text-white group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-display font-black mb-2">{role.title}</h3>
                <p className="text-white/70 font-medium mb-8">{role.desc}</p>
                <Link to={role.link}>
                  <Button className="bg-white text-secondary font-black px-8 rounded-xl h-12">Join Now</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16">
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-display font-black text-white">TourNest</span>
              </div>
              <p className="text-white/60 text-lg font-medium leading-relaxed italic">
                Connecting the world through the authentic hospitality of India.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h5 className="font-black uppercase tracking-widest text-xs text-secondary">Discover</h5>
                <div className="flex flex-col gap-2 font-bold text-white/70">
                  <Link to="/homestays" className="hover:text-white transition-colors">Homestays</Link>
                  <Link to="/attractions" className="hover:text-white transition-colors">Attractions</Link>
                </div>
              </div>
              <div className="space-y-4">
                <h5 className="font-black uppercase tracking-widest text-xs text-secondary">Community</h5>
                <div className="flex flex-col gap-2 font-bold text-white/70">
                  <Link to="/become-host" className="hover:text-white transition-colors">Become a Host</Link>
                  <Link to="/contact" className="hover:text-white transition-colors">Join as Guide</Link>
                </div>
              </div>
              <div className="space-y-4">
                <h5 className="font-black uppercase tracking-widest text-xs text-secondary">Support</h5>
                <div className="flex flex-col gap-2 font-bold text-white/70">
                  <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs font-bold uppercase tracking-widest">
            <p>© 2026 TourNest India. All Rights Reserved.</p>
            <div className="flex gap-6">
              <span>Instagram</span>
              <span>LinkedIn</span>
              <span>Twitter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;