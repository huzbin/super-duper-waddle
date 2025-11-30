import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import NodeCard from "@/components/NodeCard";
import NodesTable from "@/components/NodesTable";
import NodeDetails from "@/components/NodeDetails";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useThemeContext } from "@/components/ThemeProvider";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { useTranslation } from "react-i18next";
import { Grid3X3, Table, ChevronDown, Wifi, WifiOff, Users, UserCheck, UserX, Server, Search, Cpu, Database, HardDrive, Activity } from "lucide-react";
import type { NodeInfo } from "@/types/komari";

type ViewMode = "grid" | "table";
type OnlineFilter = "all" | "online" | "offline";

export default function Dashboard() {
  const [nodes, setNodes] = useState<NodeInfo[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [onlineFilter, setOnlineFilter] = useState<OnlineFilter>("all");
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { t } = useTranslation();
  const { defaultViewMode, refreshInterval } = useThemeContext();
  const { sitename, description, loading: themeLoading } = useThemeSettings();
  const { data: statusData, online: onlineNodes, isConnected } = useWebSocket("/api/clients", refreshInterval * 1000);

  // Fetch nodes data
  useEffect(() => {
    fetch("/api/nodes")
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success" && result.data) {
          const nodesData = result.data;
          setNodes(nodesData);

          // Extract unique groups and sort them alphabetically
          const uniqueGroups = Array.from(
            new Set(nodesData.map((node: NodeInfo) => node.group).filter(Boolean))
          ) as string[];
          setGroups(uniqueGroups.sort((a, b) => a.localeCompare(b)));
        }
      })
      .catch((error) => {
        console.error("Failed to fetch nodes:", error);
      });

    // Load saved preferences from localStorage, fallback to theme default
    const savedViewMode = localStorage.getItem("nodeViewMode");
    if (savedViewMode === "grid" || savedViewMode === "table") {
      setViewMode(savedViewMode);
    } else {
      setViewMode(defaultViewMode);
    }

    const savedGroup = localStorage.getItem("nodeSelectedGroup");
    if (savedGroup) {
      setSelectedGroup(savedGroup);
    }

    const savedOnlineFilter = localStorage.getItem("nodeOnlineFilter");
    if (savedOnlineFilter === "all" || savedOnlineFilter === "online" || savedOnlineFilter === "offline") {
      setOnlineFilter(savedOnlineFilter);
    }
  }, []);

  // Save view mode preference
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("nodeViewMode", mode);
  };

  // Save group preference
  const handleGroupChange = (group: string) => {
    setSelectedGroup(group);
    localStorage.setItem("nodeSelectedGroup", group);
  };

  // Save online filter preference
  const handleOnlineFilterChange = (filter: OnlineFilter) => {
    setOnlineFilter(filter);
    localStorage.setItem("nodeOnlineFilter", filter);
  };

  // Filter nodes by selected group, online status, and search query
  const filteredNodes = nodes.filter((node) => {
    // Filter by search query (name, ip, hostname)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      if (!node.name.toLowerCase().includes(query) && 
          !node.ip.toLowerCase().includes(query) && 
          !(node.hostname && node.hostname.toLowerCase().includes(query))) {
        return false;
      }
    }

    // Filter by group
    if (selectedGroup !== "all" && node.group !== selectedGroup) {
      return false;
    }

    // Filter by online status
    const isNodeOnline = onlineNodes.includes(node.uuid);
    if (onlineFilter === "online" && !isNodeOnline) {
      return false;
    }
    if (onlineFilter === "offline" && isNodeOnline) {
      return false;
    }

    return true;
  });

  // Sort nodes by weight (ascending) and then by name
  const sortedNodes = [...filteredNodes].sort((a, b) => {
    if (a.weight !== b.weight) {
      return a.weight - b.weight; // Changed to ascending order
    }
    return a.name.localeCompare(b.name);
  });

  // Calculate statistics
  const totalNodes = nodes.length;
  const onlineCount = onlineNodes.length;
  const offlineCount = totalNodes - onlineCount;
  
  // Calculate average resource usage for online nodes
  const onlineNodeData = nodes.filter(node => onlineNodes.includes(node.uuid));
  const avgCpuUsage = onlineNodeData.length > 0 
    ? Math.round(onlineNodeData.reduce((sum, node) => sum + (node.status?.cpu_usage || 0), 0) / onlineNodeData.length)
    : 0;
  const avgMemoryUsage = onlineNodeData.length > 0
    ? Math.round(onlineNodeData.reduce((sum, node) => sum + ((node.status?.memory_used || 0) / (node.status?.memory_total || 1) * 100), 0) / onlineNodeData.length)
    : 0;
  const avgDiskUsage = onlineNodeData.length > 0
    ? Math.round(onlineNodeData.reduce((sum, node) => sum + ((node.status?.disk_used || 0) / (node.status?.disk_total || 1) * 100), 0) / onlineNodeData.length)
    : 0;
  const totalProcesses = onlineNodeData.reduce((sum, node) => sum + (node.status?.processes || 0), 0);

  // Update document title with sitename from API
  useEffect(() => {
    if (sitename) {
      document.title = sitename;
    }
  }, [sitename]);

  // Handle node selection
  const handleNodeClick = useCallback((node: NodeInfo) => {
    setSelectedNode(node);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {themeLoading ? 'Loading...' : sitename}
          </h1>
          <p className="text-default-500 mt-1">
            {themeLoading ? 'Loading site information...' : description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <LanguageSwitch />
          <Chip
            color={isConnected ? "success" : "danger"}
            variant="flat"
            startContent={isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          >
            {isConnected ? t('dashboard.connected') : t('dashboard.disconnected')}
          </Chip>
          <Chip color="primary" variant="flat">
            {onlineCount} / {totalNodes} {t('dashboard.online')}
          </Chip>
          {offlineCount > 0 && (
            <Chip color="danger" variant="flat">
              {offlineCount} {t('dashboard.offline')}
            </Chip>
          )}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">{t('dashboard.totalNodes')}</p>
                <p className="text-2xl font-bold">{totalNodes}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Server size={20} className="text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">{t('dashboard.onlineNodes')}</p>
                <p className="text-2xl font-bold text-success">{onlineCount}</p>
              </div>
              <div className="p-2 bg-success/10 rounded-full">
                <Wifi size={20} className="text-success" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">{t('dashboard.offlineNodes')}</p>
                <p className="text-2xl font-bold text-danger">{offlineCount}</p>
              </div>
              <div className="p-2 bg-danger/10 rounded-full">
                <WifiOff size={20} className="text-danger" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">{t('dashboard.groups')}</p>
                <p className="text-2xl font-bold">{groups.length}</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-full">
                <Users size={20} className="text-warning" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Resource Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">{t('dashboard.avgCpuUsage')}</p>
                <p className="text-2xl font-bold">{avgCpuUsage}%</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Cpu size={20} className="text-blue-500" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">{t('dashboard.avgMemoryUsage')}</p>
                <p className="text-2xl font-bold">{avgMemoryUsage}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Database size={20} className="text-purple-500" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">{t('dashboard.avgDiskUsage')}</p>
                <p className="text-2xl font-bold">{avgDiskUsage}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <HardDrive size={20} className="text-green-500" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">{t('dashboard.totalProcesses')}</p>
                <p className="text-2xl font-bold">{totalProcesses}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Activity size={20} className="text-orange-500" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-default-400" size={18} />
          <Input
            placeholder={t('dashboard.searchPlaceholder')}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            color={viewMode === "grid" ? "primary" : "default"}
            variant={viewMode === "grid" ? "solid" : "bordered"}
            onPress={() => handleViewModeChange("grid")}
            size="sm"
            startContent={<Grid3X3 size={16} />}
          >
            {t('dashboard.gridView')}
          </Button>
          <Button
            color={viewMode === "table" ? "primary" : "default"}
            variant={viewMode === "table" ? "solid" : "bordered"}
            onPress={() => handleViewModeChange("table")}
            size="sm"
            startContent={<Table size={16} />}
          >
            {t('dashboard.tableView')}
          </Button>
        </div>

        <div className="flex gap-2">
          {/* Group Filter */}
          {groups.length > 0 && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  size="sm"
                  endContent={<ChevronDown size={14} />}
                >
                  {t('dashboard.group')}: {selectedGroup === "all" ? t('dashboard.allGroups') : selectedGroup}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Group selection"
                selectionMode="single"
                selectedKeys={[selectedGroup]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleGroupChange(selectedKey);
                }}
                items={[{ key: "all", label: t('dashboard.allGroups') }, ...groups.map(g => ({ key: g, label: g }))]}
              >
                {(item: { key: string; label: string }) => (
                  <DropdownItem key={item.key}>{item.label}</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}

          {/* Online Status Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                size="sm"
                endContent={<ChevronDown size={14} />}
                startContent={
                  onlineFilter === "online" ? <UserCheck size={14} /> :
                    onlineFilter === "offline" ? <UserX size={14} /> :
                      <Users size={14} />
                }
              >
                {onlineFilter === "all" ? t('dashboard.allNodes', 'All Nodes') :
                  onlineFilter === "online" ? t('dashboard.onlineOnly', 'Online Only') :
                    t('dashboard.offlineOnly', 'Offline Only')}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Online status filter"
              selectionMode="single"
              selectedKeys={[onlineFilter]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as OnlineFilter;
                handleOnlineFilterChange(selectedKey);
              }}
            >
              <DropdownItem key="all" startContent={<Users size={14} />}>
                {t('dashboard.allNodes', 'All Nodes')}
              </DropdownItem>
              <DropdownItem key="online" startContent={<UserCheck size={14} />}>
                {t('dashboard.onlineOnly', 'Online Only')}
              </DropdownItem>
              <DropdownItem key="offline" startContent={<UserX size={14} />}>
                {t('dashboard.offlineOnly', 'Offline Only')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Nodes Display */}
      {sortedNodes.length === 0 ? (
        <div className="text-center py-12 text-default-500">
          {t('dashboard.noServers')}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedNodes.map((node) => (
            <NodeCard
              key={node.uuid}
              node={node}
              status={statusData[node.uuid]}
              isOnline={onlineNodes.includes(node.uuid)}
              onClick={() => handleNodeClick(node)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <NodesTable
            nodes={sortedNodes}
            statusData={statusData}
            onlineNodes={onlineNodes}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-sm text-default-500 mt-8 space-y-1">
        <div>
          {t('footer.poweredBy')}{" "}
          Theme{" "}
          <a 
            href="https://github.com/uvexz/komari-theme-hero" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Hero
          </a>
        </div>
      </footer>

      {/* Node Details Modal */}
      {selectedNode && (
        <NodeDetails
          node={selectedNode}
          status={statusData[selectedNode.uuid]}
          isOnline={onlineNodes.includes(selectedNode.uuid)}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}
