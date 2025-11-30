// Filter and sorting showcase component
import { Users, UserCheck, UserX, Grid3X3, Table } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";

export function FilterShowcase() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Filter & Sorting Features</h2>
      
      {/* Sorting Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Sorting Logic</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Nodes:</span>
              <span>Sorted by weight (ascending) → name (A-Z)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Groups:</span>
              <span>Sorted alphabetically (A-Z)</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Filter Options */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Filter Options</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* View Mode Filters */}
            <div>
              <h4 className="font-medium mb-2">View Mode</h4>
              <div className="flex gap-2">
                <Button size="sm" startContent={<Grid3X3 size={16} />}>
                  Grid View
                </Button>
                <Button size="sm" variant="bordered" startContent={<Table size={16} />}>
                  Table View
                </Button>
              </div>
            </div>

            {/* Online Status Filters */}
            <div>
              <h4 className="font-medium mb-2">Online Status Filter</h4>
              <div className="flex gap-2">
                <Button size="sm" startContent={<Users size={16} />}>
                  All Nodes
                </Button>
                <Button size="sm" variant="bordered" startContent={<UserCheck size={16} />}>
                  Online Only
                </Button>
                <Button size="sm" variant="bordered" startContent={<UserX size={16} />}>
                  Offline Only
                </Button>
              </div>
            </div>

            {/* Group Filter */}
            <div>
              <h4 className="font-medium mb-2">Group Filter</h4>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="bordered">
                  All Groups
                </Button>
                <Button size="sm" variant="bordered">
                  Asia Pacific
                </Button>
                <Button size="sm" variant="bordered">
                  Europe
                </Button>
                <Button size="sm" variant="bordered">
                  North America
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Local Storage */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Persistent Settings</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-2 text-sm">
            <div><code>nodeViewMode</code>: Saves selected view mode (grid/table)</div>
            <div><code>nodeSelectedGroup</code>: Saves selected group filter</div>
            <div><code>nodeOnlineFilter</code>: Saves online status filter</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}