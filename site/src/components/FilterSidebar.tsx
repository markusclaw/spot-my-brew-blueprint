const colorOptions = [
  { name: 'Pale', value: '#FFF44F' },
  { name: 'Golden', value: '#FFD54F' },
  { name: 'Amber', value: '#FFA726' },
  { name: 'Copper', value: '#D2691E' },
  { name: 'Red/Amber', value: '#CD5C5C' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Black', value: '#2C2C2C' },
  { name: 'Dark Brown', value: '#6D4C41' },
];

const styleOptions = ['IPA', 'Lager', 'Stout', 'Pilsner', 'Porter', 'Red Ale', 'Amber Ale', 'Pale Ale'];
const originOptions = ['Mexico', 'USA', 'Europe', 'Other'];

interface FilterSidebarProps {
  search: string;
  setSearch: (value: string) => void;
  selectedStyles: string[];
  setSelectedStyles: (value: string[]) => void;
  selectedOrigins: string[];
  setSelectedOrigins: (value: string[]) => void;
  abvRange: [number, number];
  setAbvRange: (value: [number, number]) => void;
  ibuRange: [number, number];
  setIbuRange: (value: [number, number]) => void;
  selectedColors: string[];
  setSelectedColors: (value: string[]) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  search,
  setSearch,
  selectedStyles,
  setSelectedStyles,
  selectedOrigins,
  setSelectedOrigins,
  abvRange,
  setAbvRange,
  ibuRange,
  setIbuRange,
  selectedColors,
  setSelectedColors,
  onClearFilters,
}: FilterSidebarProps) {
  const toggleStyle = (style: string) => {
    setSelectedStyles(
      selectedStyles.includes(style) ? selectedStyles.filter((s) => s !== style) : [...selectedStyles, style]
    );
  };

  const toggleOrigin = (origin: string) => {
    setSelectedOrigins(
      selectedOrigins.includes(origin)
        ? selectedOrigins.filter((o) => o !== origin)
        : [...selectedOrigins, origin]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(
      selectedColors.includes(color) ? selectedColors.filter((c) => c !== color) : [...selectedColors, color]
    );
  };

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow p-6 sticky top-24">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Beer name, brewery..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Beer Style</label>
          <div className="space-y-2">
            {styleOptions.map((style) => (
              <label key={style} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStyles.includes(style)}
                  onChange={() => toggleStyle(style)}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="ml-2 text-sm text-gray-700">{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Origin</label>
          <div className="space-y-2">
            {originOptions.map((origin) => (
              <label key={origin} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOrigins.includes(origin)}
                  onChange={() => toggleOrigin(origin)}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="ml-2 text-sm text-gray-700">{origin}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">ABV Range: {abvRange[1]}%</label>
          <input
            type="range"
            min="0"
            max="15"
            value={abvRange[1]}
            onChange={(e) => setAbvRange([abvRange[0], Number(e.target.value)])}
            className="w-full"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">IBU Range: {ibuRange[1]}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={ibuRange[1]}
            onChange={(e) => setIbuRange([ibuRange[0], Number(e.target.value)])}
            className="w-full"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Color</label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={`w-full aspect-square rounded-full border-2 transition ${
                  selectedColors.includes(color.name) ? 'border-gray-900 ring-2 ring-amber-400' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onClearFilters}
          className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition font-semibold"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}
