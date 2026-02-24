import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavigationHeader from '@/components/NavigationHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Heart, Star, MapPin, Users, Wifi, ChevronLeft, Calendar, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

// India Optimized Assets
import manaliSnow from '@/assets/manali-snow.jpg';
import keralaHouseboat from '@/assets/kerala-houseboat.jpg';
import jaipurHaveli from '@/assets/jaipur-haveli.jpg';
import goaBeach from '@/assets/goa-beach.jpg';
import varanasiGhats from '@/assets/varanasi-ghats.jpg';
import munnarTea from '@/assets/munnar-tea.jpg';

const HomestayDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useAppContext();
  const { toast } = useToast();
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Mock data mapping (Localized to Bharat)
  const homestayData: Record<string, any> = {
    '1': {
      id: '1',
      image: manaliSnow,
      title: 'Himalayan Snow Palace',
      location: 'Old Manali, Himachal Pradesh',
      price: 2400,
      host: 'Tenzing Rigzin',
      rating: 4.9,
      reviews: 127,
      description: 'Experience authentic mountain life in our traditional homestay. Wake up to stunning Himalayan views and enjoy home-cooked meals made with organic vegetables from our garden.'
    },
    '2': {
      id: '2',
      image: keralaHouseboat,
      title: 'Luxury Houseboat',
      location: 'Alleppey, Kerala',
      price: 2800,
      host: 'Meera Nair',
      rating: 4.8,
      reviews: 215,
      description: 'Cruise through the serene backwaters of Alleppey in our premium houseboat. Experience the magic of sunset and traditional Kerala cuisine.'
    },
    '3': {
      id: '3',
      image: jaipurHaveli,
      title: 'Heritage Palace Stay',
      location: 'Amber, Jaipur',
      price: 2900,
      host: 'Arjun Shekhawat',
      rating: 4.7,
      reviews: 184,
      description: 'Live like royalty in this restored 18th-century Haveli. Featuring traditional Rajasthani architecture, ornate courtyards, and warm heritage hospitality.'
    },
    '4': {
      id: '4',
      image: goaBeach,
      title: 'Azure Palms Homestay',
      location: 'Anjuna, Goa',
      price: 1800,
      host: 'Joao Fernandes',
      rating: 4.6,
      reviews: 98,
      description: 'A charming Portuguese-style villa nestled among palm trees. Just a short walk from Anjuna beach, offering high-speed wifi and authentic Goan fish curry.'
    },
    '5': {
      id: '5',
      image: varanasiGhats,
      title: 'Ganges View Heritage',
      location: 'Dashashwamedh Ghat, Varanasi',
      price: 1200,
      host: 'Pandit Sharma',
      rating: 5.0,
      reviews: 312,
      description: 'Witness the eternal Aarti from your private balcony. This 200-year-old property offers the most spiritual stay in the heart of ancient Varanasi.'
    },
    '6': {
      id: '6',
      image: munnarTea,
      title: 'Emerald Tea Plantation',
      location: 'Munnar, Kerala',
      price: 1800,
      host: 'Kurian Philip',
      rating: 4.8,
      reviews: 156,
      description: 'Wake up in the clouds surrounded by sprawling tea estates. Enjoy fresh-plucked tea and misty mornings in our colonial-style bungalow.'
    }
  };

  const homestay = homestayData[id || ''] || homestayData['1'];
  const favorite = isFavorite(homestay.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(homestay.id);
      toast({ title: "Removed from favorites", description: "You can find it back in your favorites page." });
    } else {
      addFavorite(homestay);
      toast({ title: "Added to favorites", description: "This homestay has been saved to your profile." });
    }
  };

  const { user } = useAuth(); // Import useAuth if needed, it's missing in imports

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Identification Required", description: "Please login to reserve your sanctuary.", variant: "destructive" });
      navigate('/auth');
      return;
    }

    const userName = localStorage.getItem('user_name') || user.email?.split('@')[0] || "Explorer";
    const userEmail = user.email;
    const bookingId = `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // 1. Persist to Admin Activity Feed
    const adminReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
    adminReports.unshift({
      id: `act_${bookingId}`,
      title: "New Reservation Confirmed",
      user: userName,
      date: "Just now",
      type: "Activity",
      details: `${userName} (${userEmail}) booked '${homestay.title}' in ${homestay.location}. Total Amount: ₹${homestay.price * 3} (mock 3 nights).`,
      email: userEmail
    });
    localStorage.setItem('admin_reports', JSON.stringify(adminReports.slice(0, 50)));

    // 2. Persist to Global Bookings (for Admin list)
    const allBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
    allBookings.unshift({
      id: bookingId,
      entity: homestay.title,
      user: userName,
      userEmail: userEmail,
      date: new Date().toLocaleDateString(),
      status: "Confirmed",
      amount: `₹${homestay.price * 3}`
    });
    localStorage.setItem('admin_bookings', JSON.stringify(allBookings));

    // 3. Persist specifically for the Tourist Dashboard
    const userBookings = JSON.parse(localStorage.getItem('tourist_bookings') || '[]');
    userBookings.unshift({
      id: bookingId,
      homestayId: homestay.id,
      image: homestay.image,
      title: homestay.title,
      location: homestay.location,
      date: `${checkIn} - ${checkOut}`,
      startISO: new Date(checkIn).toISOString(),
      time: "15:00",
      status: "Confirmed",
      host: homestay.host,
      userEmail: userEmail
    });
    localStorage.setItem('tourist_bookings', JSON.stringify(userBookings));

    toast({
      title: "Booking Request Sent!",
      description: `Your request for ${homestay.title} has been received. ${homestay.host} will contact you shortly.`,
    });

    // Redirect to tourist dashboard to see booking
    setTimeout(() => navigate('/tourist-dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-secondary/20">
      <NavigationHeader />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/homestays" className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary mb-8 transition-colors font-bold uppercase tracking-widest text-[10px]">
            <ChevronLeft className="w-4 h-4" />
            Back to listings
          </Link>

          <div className="relative h-[60vh] rounded-[3rem] overflow-hidden shadow-premium mb-12 border border-border/50 group">
            <img
              src={homestay.image}
              alt={homestay.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <Button
              variant="outline"
              size="icon"
              className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border-white/30 rounded-2xl hover:bg-white/40 shadow-xl transition-all"
              onClick={handleFavoriteToggle}
            >
              <Heart className={`w-5 h-5 transition-all ${favorite ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} />
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-secondary font-black tracking-[0.2em] uppercase text-[10px]">
                  <MapPin className="w-4 h-4" />
                  <span>{homestay.location}</span>
                </div>
                <h1 className="text-6xl font-display font-black tracking-tighter leading-none">{homestay.title}</h1>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-1.5 bg-secondary/5 px-4 py-2 rounded-2xl">
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-black text-foreground text-xl">{homestay.rating}</span>
                    <span className="text-xs text-muted-foreground opacity-60">/ 5.0</span>
                  </div>
                  <Badge variant="outline" className="border-nature/30 text-nature px-4 py-2 font-black rounded-xl uppercase tracking-widest text-[10px] bg-nature/5">Prime Host</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Users, label: `4 Guests`, sub: "Capacity" },
                  { icon: MapPin, label: `2 Bedrooms`, sub: "Luxury" },
                  { icon: Star, label: `1 Bathroom`, sub: "Private" },
                  { icon: Wifi, label: "Fast WiFi", sub: "Connected" }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-card rounded-[2rem] border border-border/50 shadow-soft text-center space-y-3 group hover:shadow-premium transition-all">
                    <item.icon className="w-8 h-8 mx-auto text-secondary group-hover:scale-110 transition-transform" />
                    <div className="font-black text-sm text-foreground">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-50">{item.sub}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-display font-black">About this home</h2>
                <p className="text-xl text-muted-foreground leading-relaxed italic border-l-8 border-secondary/10 pl-8">
                  "{homestay.description}"
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-secondary" /> Premium Amenities
                </h2>
                <div className="flex flex-wrap gap-3">
                  {['WiFi', 'Mountain View', 'Local Meals', 'Trekking Guide', 'Hot Shower', 'Garden'].map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-muted/50 border-0 hover:bg-secondary/10 hover:text-secondary transition-colors">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-[3rem] p-10 shadow-premium sticky top-32 border border-border/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full -mr-24 -mt-24 blur-3xl" />

                <div className="relative z-10 mb-10 pb-10 border-b border-border/50">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground mb-4">Request Reservation</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-display font-black text-secondary">₹{homestay.price}</span>
                    <span className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">/ night</span>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="relative z-10 space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Duration</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full px-5 h-14 rounded-2xl border-2 border-muted bg-muted/20 focus:border-secondary outline-none transition-all text-xs font-black uppercase"
                          required
                        />
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full px-5 h-14 rounded-2xl border-2 border-muted bg-muted/20 focus:border-secondary outline-none transition-all text-xs font-black uppercase"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Accommodation</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-5 h-14 rounded-2xl border-2 border-muted bg-muted/20 focus:border-secondary outline-none appearance-none font-black text-xs uppercase"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button type="submit" className="w-full h-18 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-secondary text-white shadow-glow hover:scale-[1.02] transition-transform">
                    <Calendar className="w-5 h-5 mr-3" />
                    Reserve Now
                  </Button>
                </form>

                <div className="relative z-10 mt-10 pt-10 border-t border-border/50">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center border-2 border-secondary/20 font-display font-black text-secondary text-2xl">
                      {homestay.host.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-sm">Hosted by {homestay.host}</div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-nature">Verified Local Expert</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomestayDetails;
