import { memo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { useTranslation } from "react-i18next";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Activity, 
  ArrowUp, 
  ArrowDown,
  Wifi
} from "lucide-react";
import type { NodeInfo, NodeStatus } from "@/types/komari";
import { formatPercentage, formatSpeed } from "@/utils/format";
import { getCountryCodeFromRegion, getFlagIconClass } from "@/utils/regionUtils";

interface NodesTableProps {
  nodes: NodeInfo[];
  statusData: Record<string, NodeStatus>;
  onlineNodes: string[];
}

function NodesTable({ nodes, statusData, onlineNodes }: NodesTableProps) {
  const { t } = useTranslation();
  
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "danger";
    if (percentage >= 75) return "warning";
    return "success";
  };

  return (
    <Table
      aria-label="Nodes monitoring table"
      isStriped
      className="w-full"
    >
      <TableHeader>
        <TableColumn>
          <div className="flex items-center gap-1">
            <Server size={14} />
            {t('table.name')}
          </div>
        </TableColumn>
        <TableColumn>{t('table.status')}</TableColumn>
        <TableColumn>
          <div className="flex items-center gap-1">
            <Cpu size={14} />
            {t('table.cpu')}
          </div>
        </TableColumn>
        <TableColumn>
          <div className="flex items-center gap-1">
            <MemoryStick size={14} />
            {t('table.ram')}
          </div>
        </TableColumn>
        <TableColumn>
          <div className="flex items-center gap-1">
            <HardDrive size={14} />
            {t('table.disk')}
          </div>
        </TableColumn>
        <TableColumn>
          <div className="flex items-center gap-1">
            <Wifi size={14} />
            {t('table.network')}
          </div>
        </TableColumn>
        <TableColumn>
          <div className="flex items-center gap-1">
            <Activity size={14} />
            {t('table.load')}
          </div>
        </TableColumn>
      </TableHeader>
      <TableBody>
        {nodes.map((node) => {
          const isOnline = onlineNodes.includes(node.uuid);
          const status = statusData[node.uuid];
          const cpuUsage = status?.cpu?.usage || 0;
          const ramUsage = status?.ram ? formatPercentage(status.ram.used, status.ram.total) : 0;
          const diskUsage = status?.disk ? formatPercentage(status.disk.used, status.disk.total) : 0;
          const countryCode = getCountryCodeFromRegion(node.region);

          return (
            <TableRow key={node.uuid}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-primary flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{node.name}</span>
                    <div className="flex items-center gap-1 text-xs text-default-500">
                      <span className={getFlagIconClass(countryCode)} />
                      <span>{node.os}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  color={isOnline ? "success" : "danger"}
                  variant="flat"
                  size="sm"
                >
                  {isOnline ? t('dashboard.online') : t('dashboard.offline')}
                </Chip>
              </TableCell>
              <TableCell>
                {isOnline && status ? (
                  <div className="flex flex-col gap-1 min-w-24">
                    <span className="text-xs">{cpuUsage.toFixed(1)}%</span>
                    <Progress
                      value={cpuUsage}
                      color={getStatusColor(cpuUsage)}
                      size="sm"
                    />
                  </div>
                ) : (
                  <span className="text-default-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {isOnline && status ? (
                  <div className="flex flex-col gap-1 min-w-24">
                    <span className="text-xs">{ramUsage}%</span>
                    <Progress
                      value={ramUsage}
                      color={getStatusColor(ramUsage)}
                      size="sm"
                    />
                  </div>
                ) : (
                  <span className="text-default-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {isOnline && status ? (
                  <div className="flex flex-col gap-1 min-w-24">
                    <span className="text-xs">{diskUsage}%</span>
                    <Progress
                      value={diskUsage}
                      color={getStatusColor(diskUsage)}
                      size="sm"
                    />
                  </div>
                ) : (
                  <span className="text-default-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {isOnline && status ? (
                  <div className="text-xs">
                    <div className="flex items-center gap-1">
                      <ArrowUp size={10} className="text-success" />
                      {formatSpeed(status.network.up)}
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowDown size={10} className="text-primary" />
                      {formatSpeed(status.network.down)}
                    </div>
                  </div>
                ) : (
                  <span className="text-default-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {isOnline && status ? (
                  <span className="text-xs">{status.load.load1.toFixed(2)}</span>
                ) : (
                  <span className="text-default-400">-</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(NodesTable, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.nodes) === JSON.stringify(nextProps.nodes) &&
    JSON.stringify(prevProps.statusData) === JSON.stringify(nextProps.statusData) &&
    JSON.stringify(prevProps.onlineNodes) === JSON.stringify(nextProps.onlineNodes)
  );
});
