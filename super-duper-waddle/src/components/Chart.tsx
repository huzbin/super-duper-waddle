import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@heroui/use-theme';

interface ChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  title: string;
  height?: number;
  dataKey: string;
  color?: string;
  unit?: string;
}

export default function Chart({ 
  data, 
  type, 
  title, 
  height = 300, 
  dataKey, 
  color,
  unit = '%'
}: ChartProps) {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const textColor = isDark ? '#d1d5db' : '#374151';
  const chartColor = color || (isDark ? '#60a5fa' : '#3b82f6');

  const formatTooltip = (value: any, name: string) => {
    if (typeof value === 'number') {
      return [`${value.toFixed(2)}${unit}`, name];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatXAxisLabel}
              stroke={textColor}
              fontSize={12}
            />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                color: textColor
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor} 
              fill={chartColor}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatXAxisLabel}
              stroke={textColor}
              fontSize={12}
            />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                color: textColor
              }}
            />
            <Bar dataKey={dataKey} fill={chartColor} />
          </BarChart>
        );
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatXAxisLabel}
              stroke={textColor}
              fontSize={12}
            />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                color: textColor
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}