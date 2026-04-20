import { Beer } from '@/types/beer';

const colorMap: Record<string, string> = {
  'Pale': '#FFF44F',
  'Golden': '#FFD54F',
  'Amber': '#FFA726',
  'Copper': '#D2691E',
  'Red/Amber': '#CD5C5C',
  'Brown': '#8B4513',
  'Black': '#2C2C2C',
  'Dark Brown': '#6D4C41',
};

export default function BeerCard({ beer }: { beer: Beer }) {
  const bgColor = colorMap[beer.color] || '#FFD54F';

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 transition transform hover:scale-105 hover:shadow-lg">
      <div
        className="h-32 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
        }}
      >
        <div
          className="rounded-full border-4 border-gray-200"
          style={{
            backgroundColor: bgColor,
            width: '80px',
            height: '80px',
          }}
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{beer.name}</h3>
        <p className="text-sm text-amber-700 font-semibold mb-3">{beer.brewery}</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xs font-bold rounded px-2 py-1 inline-block">
              {beer.abv.toFixed(1)}% ABV
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-white text-xs font-bold rounded px-2 py-1 inline-block">
              {beer.ibu} IBU
            </div>
          </div>
          <div className="text-center">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block">
              🇲🇽 {beer.origin}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{beer.description}</p>

        <div className="border-t border-gray-200 pt-3 mb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Style:</span>
              <p className="font-semibold text-gray-900">{beer.style}</p>
            </div>
            <div>
              <span className="text-gray-600">Color:</span>
              <p className="font-semibold text-gray-900">{beer.color}</p>
            </div>
          </div>
        </div>

        {beer.rating && (
          <div className="text-xs text-gray-600 mb-3">
            ⭐ {beer.rating.toFixed(1)} ({beer.reviews || 0} reviews)
          </div>
        )}

        <div className="flex gap-2">
          <button className="flex-1 bg-amber-100 text-amber-700 py-2 rounded font-semibold hover:bg-amber-200 transition text-sm">
            View Details
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-semibold hover:bg-gray-200 transition text-sm">
            Rate
          </button>
        </div>
      </div>
    </div>
  );
}
