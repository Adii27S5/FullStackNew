import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavigationHeader from '@/components/NavigationHeader';
import HomestayCard from '@/components/HomestayCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Sparkles, MapPin } from 'lucide-react';

// Indian Assets
import goaBeach from '@/assets/goa-beach.jpg';
import munnarTea from '@/assets/munnar-tea.jpg';
import jaipurHaveli from '@/assets/jaipur-haveli.jpg';
import manaliSnow from '@/assets/manali-snow.jpg';
import varanasiGhats from '@/assets/varanasi-ghats.jpg';
import keralaHouseboat from '@/assets/kerala-houseboat.jpg';

const Homestays = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const homestays = [
    {
      id: '1',
      image: manaliSnow,
      title: 'Himalayan Snow Palace',
      location: 'Old Manali, Himachal Pradesh',
      rating: 4.9,
      price: 2400,
      host: 'Tenzing Rigzin',
      guests: 4,
      amenities: ['WiFi', 'Mountain View', 'Local Cuisine', 'Bonfire'],
      category: 'Mountain'
    },
    {
      id: '2',
      image: keralaHouseboat,
      title: 'Luxury Houseboat',
      location: 'Alleppey, Kerala',
      rating: 4.8,
      price: 2800,
      host: 'Meera Nair',
      guests: 2,
      amenities: ['Sunset Deck', 'Traditional Food', 'AC Rooms'],
      category: 'Nature'
    },
    {
      id: '3',
      image: jaipurHaveli,
      title: 'Heritage Palace Stay',
      location: 'Amber, Jaipur',
      rating: 4.7,
      price: 2900,
      host: 'Arjun Shekhawat',
      guests: 3,
      amenities: ['Heritage Decor', 'Courtyard View', 'Folk Music'],
      category: 'Heritage'
    },
    {
      id: '4',
      image: goaBeach,
      title: 'Azure Palms Homestay',
      location: 'Anjuna, Goa',
      rating: 4.6,
      price: 1800,
      host: 'Joao Fernandes',
      guests: 2,
      amenities: ['Pool', 'Beach Access', 'Garden'],
      category: 'Beach'
    }
  ];

  const filteredHomestays = homestays.filter(stay => {
    const matchesSearch = stay.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      stay.location.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || stay.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-muted/30 selection:bg-secondary/20">
      <NavigationHeader />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20">
                <Sparkles className="w-3 h-3" />
                <span>Verified Stays</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter">Find your <br /><span className="text-secondary italic underline decoration-secondary/30">Sanctuary.</span></h1>
            </div>

            <div className="w-full md:w-[400px] relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-secondary transition-colors" />
              <Input
                placeholder="Search by city or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-card border-border/50 shadow-soft focus:shadow-premium transition-all font-bold"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-12">
            {['all', 'Heritage', 'Beach', 'Mountain', 'Nature'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedFilter === filter
                    ? 'bg-secondary text-white shadow-glow'
                    : 'bg-white dark:bg-card text-muted-foreground hover:bg-secondary/5 hover:text-secondary'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredHomestays.map((stay) => (
              <Link key={stay.id} to={`/homestay/${stay.id}`}>
                <HomestayCard {...stay} />
              </Link>
            ))}
          </div>

          {filteredHomestays.length === 0 && (
            <div className="text-center py-32 bg-white dark:bg-card rounded-[3rem] border border-border/50 shadow-soft">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-3xl font-display font-black mb-2">No homestays found</h3>
              <p className="text-muted-foreground font-medium italic">"Every trail in India leads somewhere special. Try another search."</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Homestays;
