import { memo } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { useTranslation } from "react-i18next";
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
  Database
} from "lucide-react";
import type { NodeInfo, NodeStatus } from "@/types/komari";
import { formatBytes, formatPercentage, formatUptime, formatSpeed } from "@/utils/format";
import { getCountryCodeFromRegion, getFlagIconClass } from "@/utils/regionUtils";

interface NodeCardProps {
  node: NodeInfo;
  status?: NodeStatus;
  isOnline: boolean;
  onClick?: () => void;
}

function NodeCard({ node, status, isOnline, onClick }: NodeCardProps) {
  const { t } = useTranslation();
  const cpuUsage = status?.cpu?.usage || 0;
  const countryCode = getCountryCodeFromRegion(node.region);
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

  // Helper function to format the CPU name
  const formatCpuName = (name: string) => {
    if (name.includes("AMD")) return "AMD";
    if (name.includes("Intel")) return "Intel";
    if (name.includes("QEMU")) return "QEMU";
    return name;
  };

  return (
    <Card
      className="w-full cursor-pointer"
      shadow="sm"
      isHoverable
      isPressable
      onPress={onClick}
    >
      <CardHeader className="flex justify-between items-start pb-0">
        <div className="flex items-start gap-2">
          <Server size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-semibold text-left">{node.name}</h4>
            <div className="flex items-center gap-1 text-xs text-default-500">
              <span className={getFlagIconClass(countryCode)} />
              <span>{node.os}</span>
            </div>
          </div>
        </div>
        <Chip
          color={isOnline ? "success" : "danger"}
          variant="flat"
          size="sm"
        >
          {isOnline ? t('dashboard.online') : t('dashboard.offline')}
        </Chip>
      </CardHeader>

      <CardBody className="gap-3">
        {/* System Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Cpu size={12} className="text-default-400" />
            <span className="text-default-500">{t('node.cpu')}:</span> {formatCpuName(node.cpu_name)}
          </div>
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-default-400" />
            <span className="text-default-500">{t('node.cores')}:</span> {node.cpu_cores}
          </div>
          <div className="flex items-center gap-1">
            <MemoryStick size={12} className="text-default-400" />
            <span className="text-default-500">{t('node.ram')}:</span> {formatBytes(node.mem_total)}
          </div>
          <div className="flex items-center gap-1">
            <HardDrive size={12} className="text-default-400" />
            <span className="text-default-500">{t('node.disk')}:</span> {formatBytes(node.disk_total)}
          </div>
          {/* GPU Info */}
          {node.gpu_name && (
            <div className="flex items-center gap-1 col-span-1">
              <Activity size={12} className="text-default-400" />
              <span className="text-default-500">GPU:</span> {node.gpu_name.includes('NVIDIA') ? 'NVIDIA' : 
                                                              node.gpu_name.includes('AMD') ? 'AMD' : 
                                                              node.gpu_name.includes('Intel') ? 'Intel' : 'GPU'}
            </div>
          )}
          {/* IP Address */}
          <div className="flex items-center gap-1 col-span-1">
            <Wifi size={12} className="text-default-400" />
            <span className="text-default-500">IP:</span> {node.ip}
          </div>
        </div>

        {isOnline && status && (
          <>
            {/* CPU Usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Cpu size={12} className="text-primary" />
                  <span>{t('node.cpu')}</span>
                </div>
                <span className="font-medium">{cpuUsage.toFixed(1)}%</span>
              </div>
              <Progress
                value={cpuUsage}
                color={getStatusColor(cpuUsage)}
                size="sm"
              />
            </div>

            {/* RAM Usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <MemoryStick size={12} className="text-primary" />
                  <span>{t('node.ram')}</span>
                </div>
                <span className="font-medium">
                  {formatBytes(status.ram.used)} / {formatBytes(status.ram.total)}
                </span>
              </div>
              <Progress
                value={ramUsage}
                color={getStatusColor(ramUsage)}
                size="sm"
              />
            </div>

            {/* Disk Usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <HardDrive size={12} className="text-primary" />
                  <span>{t('node.disk')}</span>
                </div>
                <span className="font-medium">
                  {formatBytes(status.disk.used)} / {formatBytes(status.disk.total)}
                </span>
              </div>
              <Progress
                value={diskUsage}
                color={getStatusColor(diskUsage)}
                size="sm"
              />
            </div>

            {/* Swap Usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Database size={12} className="text-primary" />
                  <span>{t('node.swap')}</span>
                </div>
                <span className="font-medium">
                  {status.swap.total > 0
                    ? `${formatBytes(status.swap.used)} / ${formatBytes(status.swap.total)}`
                    : 'NULL'}
                </span>
              </div>
              <Progress
                value={swapUsage}
                color={getStatusColor(swapUsage)}
                size="sm"
              />
            </div>

            {/* Network Info */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-divider">
              <div className="flex items-center gap-1">
                <ArrowUp size={10} className="text-success" />
                <span>{formatSpeed(status.network.up)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDown size={10} className="text-primary" />
                <span>{formatSpeed(status.network.down)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity size={10} className="text-warning" />
                <span className="text-default-500">{t('node.load')}:</span> {status.load.load1.toFixed(2)}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={10} className="text-default-400" />
                <span className="text-default-500">{t('node.uptime')}:</span> {formatUptime(status.uptime)}
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(NodeCard, (prevProps, nextProps) => {
  return (
    prevProps.node.uuid === nextProps.node.uuid &&
    prevProps.isOnline === nextProps.isOnline &&
    prevProps.onClick === nextProps.onClick &&
    JSON.stringify(prevProps.status) === JSON.stringify(nextProps.status)
  );
});
