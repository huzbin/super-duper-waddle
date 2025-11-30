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
    <div className="flex flex-col gap-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {themeLoading ? 'Loading...' : sitename}
          </h1>
          <p className="text-default-500 text-sm md:text-base">
            {themeLoading ? 'Loading site information...' : description}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card rounded-lg p-2 shadow-sm">
          <ThemeSwitch />
          <LanguageSwitch />
          <Chip
            color={isConnected ? "success" : "danger"}
            variant="flat"
            startContent={isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          >
            {isConnected ? t('dashboard.connected') : t('dashboard.disconnected')}
          </Chip>
          <Chip
            color="primary"
            variant="flat"
          >
            {onlineCount} / {totalNodes} {t('dashboard.online')}
          </Chip>
          {offlineCount > 0 && (
            <Chip
              color="danger"
              variant="flat"
            >
              {offlineCount} {t('dashboard.offline')}
            </Chip>
          )}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardBody className="p-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-default-500 text-sm font-medium">{t('dashboard.totalNodes')}</p>
                <p className="text-2xl md:text-3xl font-bold">{totalNodes}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full backdrop-blur-sm">
                <Server size={24} className="text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-success/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardBody className="p-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-default-500 text-sm font-medium">{t('dashboard.onlineNodes')}</p>
                <p className="text-2xl md:text-3xl font-bold text-success">{onlineCount}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-full backdrop-blur-sm">
                <Wifi size={24} className="text-success" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-danger/5 to-danger/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardBody className="p-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-default-500 text-sm font-medium">{t('dashboard.offlineNodes')}</p>
                <p className="text-2xl md:text-3xl font-bold text-danger">{offlineCount}</p>
              </div>
              <div className="p-3 bg-danger/10 rounded-full backdrop-blur-sm">
                <WifiOff size={24} className="text-danger" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-warning/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardBody className="p-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-default-500 text-sm font-medium">{t('dashboard.groups')}</p>
                <p className="text-2xl md:text-3xl font-bold">{groups.length}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-full backdrop-blur-sm">
                <Users size={24} className="text-warning" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Resource Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardBody className="p-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-default-500 text-sm font-medium">{t('dashboard.avgCpuUsage')}</p>
                <p className="text-2xl md:text-3xl font-bold">{avgCpuUsage}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full backdrop-blur-sm">
                <Cpu size={24} className="text-blue-500" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardBody className="p-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-default-500 text-sm font-medium">{t('dashboard.avgMemoryUsage')}</p>
                <p className="text-2xl md:text-3xl font-bold">{avgMemoryUsage}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full backdrop-blur-sm">
                <Database size={24} className="text-purple-500" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardBody className="p-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-default-500 text-sm font-medium">{t('dashboard.avgDiskUsage')}</p>
                <p className="text-2xl md:text-3xl font-bold">{avgDiskUsage}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full backdrop-blur-sm">
                <HardDrive size={24} className="text-green-500" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardBody className="p-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-default-500 text-sm font-medium">{t('dashboard.totalProcesses')}</p>
                <p className="text-2xl md:text-3xl font-bold">{totalProcesses}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full backdrop-blur-sm">
                <Activity size={24} className="text-orange-500" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-card rounded-xl p-4 shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="relative w-full sm:w-80 flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-default-400 transition-colors duration-300" size={18} />
          <Input
            placeholder={t('dashboard.searchPlaceholder')}
            className="pl-10 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 justify-start sm:justify-center">
          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-default-100 rounded-lg p-1 transition-all duration-300">
            <Button
              color={viewMode === "grid" ? "primary" : "default"}
              variant={viewMode === "grid" ? "solid" : "ghost"}
              onPress={() => handleViewModeChange("grid")}
              size="sm"
              startContent={<Grid3X3 size={16} />}
              className="rounded-md transition-all duration-300"
            >
              {t('dashboard.gridView')}
            </Button>
            <Button
              color={viewMode === "table" ? "primary" : "default"}
              variant={viewMode === "table" ? "solid" : "ghost"}
              onPress={() => handleViewModeChange("table")}
              size="sm"
              startContent={<Table size={16} />}
              className="rounded-md transition-all duration-300"
            >
              {t('dashboard.tableView')}
            </Button>
          </div>

          {/* Group Filter */}
          {groups.length > 0 && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  size="sm"
                  endContent={<ChevronDown size={14} className="transition-transform duration-300" />}
                  className="rounded-md transition-all duration-300 hover:shadow-sm"
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
                  <DropdownItem key={item.key} className="transition-all duration-200">{item.label}</DropdownItem>
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
                endContent={<ChevronDown size={14} className="transition-transform duration-300" />}
                startContent={
                  onlineFilter === "online" ? <UserCheck size={14} /> :
                    onlineFilter === "offline" ? <UserX size={14} /> :
                      <Users size={14} />
                }
                className="rounded-md transition-all duration-300 hover:shadow-sm"
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
              <DropdownItem key="all" startContent={<Users size={14} />} className="transition-all duration-200">
                {t('dashboard.allNodes', 'All Nodes')}
              </DropdownItem>
              <DropdownItem key="online" startContent={<UserCheck size={14} />} className="transition-all duration-200">
                {t('dashboard.onlineOnly', 'Online Only')}
              </DropdownItem>
              <DropdownItem key="offline" startContent={<UserX size={14} />} className="transition-all duration-200">
                {t('dashboard.offlineOnly', 'Offline Only')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Nodes Display */}
      {sortedNodes.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl shadow-md">
          <div className="text-default-500 space-y-3">
            <Server size={48} className="mx-auto opacity-50" />
            <h3 className="text-lg font-medium">{t('dashboard.noServers')}</h3>
            <p className="text-sm">{t('dashboard.noServersDescription')}</p>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
        <div className="bg-card rounded-xl shadow-md overflow-hidden">
          <NodesTable
            nodes={sortedNodes}
            statusData={statusData}
            onlineNodes={onlineNodes}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-sm text-default-500 mt-10 space-y-1">
        <div>
          {t('footer.poweredBy')}{" "}
          Theme{" "}
          <a 
            href="https://github.com/uvexz/komari-theme-hero" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
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
