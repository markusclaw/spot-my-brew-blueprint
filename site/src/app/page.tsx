'use client';

import { useState, useEffect } from 'react';
import BeerCard from '@/components/BeerCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Beer } from '@/types/beer';

export default function Home() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [filteredBeers, setFilteredBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const beersPerPage = 6;

  const [search, setSearch] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [abvRange, setAbvRange] = useState([0, 15]);
  const [ibuRange, setIbuRange] = useState([0, 100]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const res = await fetch('/api/beers');
        const data = await res.json();
        setBeers(data);
        setFilteredBeers(data);
      } catch (error) {
        console.error('Failed to fetch beers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeers();
  }, []);

  useEffect(() => {
    let filtered = beers;

    if (search) {
      filtered = filtered.filter(
        (beer) =>
          beer.name.toLowerCase().includes(search.toLowerCase()) ||
          beer.brewery.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedStyles.length > 0) {
      filtered = filtered.filter((beer) => selectedStyles.includes(beer.style));
    }

    if (selectedOrigins.length > 0) {
      filtered = filtered.filter((beer) => selectedOrigins.includes(beer.origin));
    }

    filtered = filtered.filter((beer) => beer.abv >= abvRange[0] && beer.abv <= abvRange[1]);
    filtered = filtered.filter((beer) => beer.ibu >= ibuRange[0] && beer.ibu <= ibuRange[1]);

    if (selectedColors.length > 0) {
      filtered = filtered.filter((beer) => selectedColors.includes(beer.color));
    }

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'abv-high':
        filtered.sort((a, b) => b.abv - a.abv);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredBeers(filtered);
    setCurrentPage(1);
  }, [beers, search, selectedStyles, selectedOrigins, abvRange, ibuRange, selectedColors, sortBy]);

  const totalPages = Math.ceil(filteredBeers.length / beersPerPage);
  const startIndex = (currentPage - 1) * beersPerPage;
  const paginatedBeers = filteredBeers.slice(startIndex, startIndex + beersPerPage);

  const clearFilters = () => {
    setSearch('');
    setSelectedStyles([]);
    setSelectedOrigins([]);
    setAbvRange([0, 15]);
    setIbuRange([0, 100]);
    setSelectedColors([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-amber-900">🍺 Spot My Brew</h1>
              <span className="text-sm text-gray-600">Craft Beer Discovery</span>
            </div>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition font-semibold">
              + Add Beer
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            selectedStyles={selectedStyles}
            setSelectedStyles={setSelectedStyles}
            selectedOrigins={selectedOrigins}
            setSelectedOrigins={setSelectedOrigins}
            abvRange={[abvRange[0], abvRange[1]]}
            setAbvRange={(val) => setAbvRange(val)}
            ibuRange={[ibuRange[0], ibuRange[1]]}
            setIbuRange={(val) => setIbuRange(val)}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            onClearFilters={clearFilters}
          />

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Beers in Repository</h2>
                <p className="text-gray-600">{filteredBeers.length} beers found</p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="recent">Sort by: Most Recent</option>
                <option value="name">Sort by: Name (A-Z)</option>
                <option value="abv-high">Sort by: ABV (High)</option>
                <option value="rating">Sort by: Rating</option>
              </select>
            </div>

            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading beers...</p>
              </div>
            )}

            {!loading && paginatedBeers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedBeers.map((beer) => (
                  <BeerCard key={beer.id} beer={beer} />
                ))}
              </div>
            )}

            {!loading && paginatedBeers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No beers match your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded ${
                      currentPage === page
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
