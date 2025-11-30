// Flag showcase component for testing flag-icons
import { getFlagIconClass } from "@/utils/regionUtils";

export function FlagShowcase() {
  const testRegions = [
    { region: "🇺🇸 United States", expected: "us" },
    { region: "🇨🇳 China", expected: "cn" },
    { region: "🇯🇵 Japan", expected: "jp" },
    { region: "🇰🇷 South Korea", expected: "kr" },
    { region: "🇬🇧 United Kingdom", expected: "gb" },
    { region: "🇩🇪 Germany", expected: "de" },
    { region: "🇫🇷 France", expected: "fr" },
    { region: "🇨🇦 Canada", expected: "ca" },
    { region: "🇦🇺 Australia", expected: "au" },
    { region: "🇸🇬 Singapore", expected: "sg" },
    { region: "🇭🇰 Hong Kong", expected: "hk" },
    { region: "🇹🇼 Taiwan", expected: "tw" },
    { region: "🇮🇳 India", expected: "in" },
    { region: "🇧🇷 Brazil", expected: "br" },
    { region: "🇷🇺 Russia", expected: "ru" },
    { region: "🇳🇱 Netherlands", expected: "nl" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Flag Icons Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testRegions.map(({ region, expected }) => (
          <div key={region} className="flex items-center gap-3 p-3 border rounded-lg">
            <span className={getFlagIconClass(expected)} />
            <div>
              <div className="font-medium">{region}</div>
              <div className="text-xs text-default-500">Code: {expected}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Language Flags</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <span className={getFlagIconClass('us')} />
            <span>English</span>
          </div>
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <span className={getFlagIconClass('cn')} />
            <span>中文</span>
          </div>
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <span className={getFlagIconClass('jp')} />
            <span>日本語</span>
          </div>
        </div>
      </div>
    </div>
  );
}