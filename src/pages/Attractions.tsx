import { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import AttractionCard from '@/components/AttractionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Compass, MapPin, Sparkles } from 'lucide-react';

// Indian Assets
import jaipurHaveli from '@/assets/jaipur-haveli.jpg';
import manaliSnow from '@/assets/manali-snow.jpg';
import varanasiGhats from '@/assets/varanasi-ghats.jpg';
import keralaHouseboat from '@/assets/kerala-houseboat.jpg';

const Attractions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const attractions = [
    {
      id: '1',
      image: varanasiGhats,
      title: 'Prayer Ceremony',
      location: 'Dashashwamedh Ghat, Varanasi',
      duration: '1-2 hours',
      rating: 4.9,
      category: 'Cultural',
      description: 'Experience the spectacular spiritual ceremony at sunset on the banks of the Ganges.'
    },
    {
      id: '2',
      image: manaliSnow,
      title: 'Snow Valley Adventure',
      location: 'Manali, Himachal Pradesh',
      duration: '5-6 hours',
      rating: 4.8,
      category: 'Adventure',
      description: 'Experience paragliding, zorbing, and skiing in the majestic snowy landscapes.'
    },
    {
      id: '3',
      image: jaipurHaveli,
      title: 'Fort Exploration',
      location: 'Amer, Jaipur',
      duration: '3-4 hours',
      rating: 4.8,
      category: 'Heritage',
      description: 'Explore grand architecture, ornate rooms, and panoramic views from the historic fort.'
    },
    {
      id: '4',
      image: keralaHouseboat,
      title: 'Boat Safari',
      location: 'Alleppey, Kerala',
      duration: 'Half day',
      rating: 4.9,
      category: 'Nature',
      description: 'Glide through tranquil canals and lagoons, experiencing the unique backwater lifestyle.'
    }
  ];

  const categories = ['all', 'Cultural', 'Adventure', 'Nature', 'Heritage', 'Food'];

  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch = attraction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || attraction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-muted/30 selection:bg-secondary/20 font-sans">
      <NavigationHeader />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-nature/10 text-nature rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-nature/20">
              <Compass className="w-4 h-4" />
              <span>Curated Experiences</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9]">The Soul of <span className="text-secondary italic underline decoration-secondary/30">India.</span></h1>
            <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">"Every corner of India is a temple of culture, waiting to be rediscovered by those who seek the extraordinary."</p>
          </div>

          <div className="max-w-5xl mx-auto mb-20 space-y-12">
            <div className="relative group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-secondary w-6 h-6 group-focus-within:scale-110 transition-transform" />
              <Input
                placeholder="Find heritage walks, food tours, or spiritual ceremonies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-20 pl-18 pr-10 rounded-[2.5rem] bg-white dark:bg-card border-0 shadow-premium outline-none text-xl font-bold placeholder:text-muted-foreground/50 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-10 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all ${selectedCategory === category
                      ? 'bg-secondary text-white shadow-glow'
                      : 'bg-white dark:bg-card text-muted-foreground hover:bg-secondary/5 hover:text-secondary border border-border/50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredAttractions.map((attraction) => (
              <AttractionCard key={attraction.id} {...attraction} />
            ))}
          </div>

          {filteredAttractions.length === 0 && (
            <div className="text-center py-32 bg-white dark:bg-card rounded-[4rem] shadow-soft border border-border/50 max-w-4xl mx-auto">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <MapPin className="w-10 h-10 text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-4xl font-display font-black mb-4">No results found</h3>
              <p className="text-lg text-muted-foreground italic font-medium">Try a different search term or explore spiritual ceremonies.</p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all') }} variant="ghost" className="mt-8 text-secondary font-black uppercase tracking-widest text-[10px]">Clear all filters</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Attractions;
