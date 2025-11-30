import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Progress } from '@heroui/progress';
import { Tabs, Tab } from '@heroui/tabs';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Server, 
  Info, 
  BarChart3
} from 'lucide-react';
import { LazyChart } from './LazyChart';
import { useThemeContext } from './ThemeProvider';
import type { NodeInfo, NodeStatus } from '@/types/komari';
import { formatBytes, formatPercentage, formatUptime, formatSpeed } from '@/utils/format';
import { getCountryCodeFromRegion, getFlagIconClass } from '@/utils/regionUtils';

interface NodeDetailsProps {
  node: NodeInfo;
  status?: NodeStatus;
  isOnline: boolean;
  onClose: () => void;
}

interface HistoryRecord {
  time: string;
  cpu: number;
  ram: number;
  disk: number;
  load: number;
  network_in: number;
  network_out: number;
}

export default function NodeDetails({ node, status, isOnline, onClose }: NodeDetailsProps) {
  const { t } = useTranslation();
  const { showCharts } = useThemeContext();
  const countryCode = getCountryCodeFromRegion(node.region);
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch historical data
  useEffect(() => {
    if (showCharts && selectedTab === 'charts') {
      fetchHistoryData();
    }
  }, [node.uuid, showCharts, selectedTab]);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recent/${node.uuid}`);
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        // Transform the data for charts
        const transformedData = result.data.map((item: any) => ({
          time: item.updated_at,
          cpu: item.cpu?.usage || 0,
          ram: item.ram ? formatPercentage(item.ram.used, item.ram.total) : 0,
          disk: item.disk ? formatPercentage(item.disk.used, item.disk.total) : 0,
          load: item.load?.load1 || 0,
          network_in: item.network?.down || 0,
          network_out: item.network?.up || 0,
        }));
        
        setHistoryData(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch history data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cpuUsage = status?.cpu?.usage || 0;
  const ramUsage = status?.ram ? formatPercentage(status.ram.used, status.ram.total) : 0;
  const diskUsage = status?.disk ? formatPercentage(status.disk.used, status.disk.total) : 0;
  const swapUsage = status?.swap && status.swap.total > 0
    ? formatPercentage(status.swap.used, status.swap.total)
    : 0;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "danger";
    if (percentage >= 75) return "warning";
    return "success";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Server size={24} className="text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{node.name}</h2>
              <div className="flex items-center gap-2 text-default-500">
                <span className={getFlagIconClass(countryCode)} />
                <span>{node.os}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip
              color={isOnline ? "success" : "danger"}
              variant="flat"
            >
              {isOnline ? t('dashboard.online') : t('dashboard.offline')}
            </Chip>
            <Button
              variant="light"
              onPress={onClose}
              className="text-default-500"
              isIconOnly
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardBody className="overflow-y-auto">
          <Tabs 
            selectedKey={selectedTab} 
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="w-full"
          >
            <Tab 
              key="overview" 
              title={
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  {t('node.overview', 'Overview')}
                </div>
              }
            >
              <div className="space-y-6">
                {/* System Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Server size={18} className="text-primary" />
                      <h3 className="text-lg font-semibold">{t('node.systemInfo', 'System Information')}</h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-default-500">{t('node.cpu')}:</span>
                        <p className="font-medium">{node.cpu_name}</p>
                      </div>
                      <div>
                        <span className="text-default-500">{t('node.cores')}:</span>
                        <p className="font-medium">{node.cpu_cores}</p>
                      </div>
                      <div>
                        <span className="text-default-500">{t('node.ram')}:</span>
                        <p className="font-medium">{formatBytes(node.mem_total)}</p>
                      </div>
                      <div>
                        <span className="text-default-500">{t('node.disk')}:</span>
                        <p className="font-medium">{formatBytes(node.disk_total)}</p>
                      </div>
                      <div>
                        <span className="text-default-500">GPU:</span>
                        <p className="font-medium">{node.gpu_name || 'None'}</p>
                      </div>
                      <div>
                        <span className="text-default-500">Arch:</span>
                        <p className="font-medium">{node.arch}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Current Status */}
                {isOnline && status && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">{t('node.currentStatus', 'Current Status')}</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        {/* CPU */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>{t('node.cpu')}</span>
                            <span className="font-medium">{cpuUsage.toFixed(1)}%</span>
                          </div>
                          <Progress
                            value={cpuUsage}
                            color={getStatusColor(cpuUsage)}
                            size="md"
                          />
                        </div>

                        {/* RAM */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>{t('node.ram')}</span>
                            <span className="font-medium">
                              {formatBytes(status.ram.used)} / {formatBytes(status.ram.total)} ({ramUsage}%)
                            </span>
                          </div>
                          <Progress
                            value={ramUsage}
                            color={getStatusColor(ramUsage)}
                            size="md"
                          />
                        </div>

                        {/* Disk */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>{t('node.disk')}</span>
                            <span className="font-medium">
                              {formatBytes(status.disk.used)} / {formatBytes(status.disk.total)} ({diskUsage}%)
                            </span>
                          </div>
                          <Progress
                            value={diskUsage}
                            color={getStatusColor(diskUsage)}
                            size="md"
                          />
                        </div>

                        {/* Swap */}
                        {status.swap.total > 0 && (
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>{t('node.swap')}</span>
                              <span className="font-medium">
                                {formatBytes(status.swap.used)} / {formatBytes(status.swap.total)} ({swapUsage}%)
                              </span>
                            </div>
                            <Progress
                              value={swapUsage}
                              color={getStatusColor(swapUsage)}
                              size="md"
                            />
                          </div>
                        )}

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-divider">
                          <div className="text-center">
                            <p className="text-default-500 text-sm">{t('node.load')}</p>
                            <p className="font-medium">{status.load.load1.toFixed(2)}</p>
                            <p className="text-xs text-default-400">
                              5m: {status.load.load5.toFixed(2)} | 15m: {status.load.load15.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-default-500 text-sm">{t('node.uptime')}</p>
                            <p className="font-medium">{formatUptime(status.uptime)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-default-500 text-sm">{t('node.processes')}</p>
                            <p className="font-medium">{status.process}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-default-500 text-sm">{t('node.connections')}</p>
                            <p className="font-medium">{status.connections.tcp}</p>
                          </div>
                        </div>

                        {/* Extended System Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-divider">
                          <div className="text-center">
                            <p className="text-default-500 text-sm">{t('node.cpuTemp')}</p>
                            <p className="font-medium">{status.cpu.temp ? `${status.cpu.temp}°C` : 'N/A'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-default-500 text-sm">{t('node.threads')}</p>
                            <p className="font-medium">{node.cpu_threads || node.cpu_cores}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-default-500 text-sm">{t('node.arch')}</p>
                            <p className="font-medium">{node.arch}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-default-500 text-sm">{t('node.hostname')}</p>
                            <p className="font-medium truncate max-w-[120px]">{node.hostname}</p>
                          </div>
                        </div>

                        {/* Network */}
                        <div className="pt-4 border-t border-divider">
                          <h4 className="font-medium mb-2">{t('node.network')}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-default-500 text-sm">↑ Upload</p>
                              <p className="font-medium">{formatSpeed(status.network.up)}</p>
                              <p className="text-xs text-default-400">
                                Total: {formatBytes(status.network.totalUp)}
                              </p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm">↓ Download</p>
                              <p className="font-medium">{formatSpeed(status.network.down)}</p>
                              <p className="text-xs text-default-400">
                                Total: {formatBytes(status.network.totalDown)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            {showCharts && (
              <Tab 
                key="charts" 
                title={
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    {t('node.charts', 'Charts')}
                  </div>
                }
              >
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <p>{t('common.loading', 'Loading...')}</p>
                    </div>
                  ) : historyData.length > 0 ? (
                    <>
                      <LazyChart
                        data={historyData}
                        type="area"
                        title={`${t('node.cpu')} Usage`}
                        dataKey="cpu"
                        color="#3b82f6"
                        unit="%"
                      />
                      <LazyChart
                        data={historyData}
                        type="area"
                        title={`${t('node.ram')} Usage`}
                        dataKey="ram"
                        color="#10b981"
                        unit="%"
                      />
                      <LazyChart
                        data={historyData}
                        type="line"
                        title={`${t('node.load')} Average`}
                        dataKey="load"
                        color="#f59e0b"
                        unit=""
                      />
                      <LazyChart
                        data={historyData}
                        type="bar"
                        title={`${t('node.network')} Traffic`}
                        dataKey="network_in"
                        color="#8b5cf6"
                        unit=" B/s"
                      />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-default-500">{t('node.noChartData', 'No chart data available')}</p>
                    </div>
                  )}
                </div>
              </Tab>
            )}
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}