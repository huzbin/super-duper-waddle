import { lazy, Suspense } from 'react';
import { Spinner } from '@heroui/spinner';
import { BarChart3 } from 'lucide-react';

// Lazy load chart components to reduce initial bundle size
const Chart = lazy(() => import('./Chart'));

interface LazyChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  title: string;
  height?: number;
  dataKey: string;
  color?: string;
  unit?: string;
}

export function LazyChart(props: LazyChartProps) {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <BarChart3 size={32} className="text-default-400 animate-pulse" />
          <Spinner size="lg" />
        </div>
      }
    >
      <Chart {...props} />
    </Suspense>
  );
}