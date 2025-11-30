// Icon showcase component for testing
import { 
  Server, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Activity, 
  Clock, 
  ArrowUp, 
  ArrowDown,
  Zap,
  Database,
  Sun,
  Moon,
  Languages,
  Grid3X3,
  Table,
  ChevronDown,
  Wifi,
  WifiOff,
  BarChart3,
  X,
  Info
} from "lucide-react";

export function IconShowcase() {
  const icons = [
    { name: "Server", icon: Server },
    { name: "CPU", icon: Cpu },
    { name: "Hard Drive", icon: HardDrive },
    { name: "Memory", icon: MemoryStick },
    { name: "Activity", icon: Activity },
    { name: "Clock", icon: Clock },
    { name: "Arrow Up", icon: ArrowUp },
    { name: "Arrow Down", icon: ArrowDown },
    { name: "Zap", icon: Zap },
    { name: "Database", icon: Database },
    { name: "Sun", icon: Sun },
    { name: "Moon", icon: Moon },
    { name: "Languages", icon: Languages },
    { name: "Grid", icon: Grid3X3 },
    { name: "Table", icon: Table },
    { name: "Chevron Down", icon: ChevronDown },
    { name: "Wifi", icon: Wifi },
    { name: "Wifi Off", icon: WifiOff },
    { name: "Bar Chart", icon: BarChart3 },
    { name: "Close", icon: X },
    { name: "Info", icon: Info },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lucide Icons Showcase</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {icons.map(({ name, icon: Icon }) => (
          <div key={name} className="flex flex-col items-center gap-2 p-3 border rounded-lg">
            <Icon size={24} className="text-primary" />
            <span className="text-xs text-center">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}