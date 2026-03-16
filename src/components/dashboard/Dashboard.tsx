import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";

const projects = [
  {
    name: "Sentinel",
    status: "Active",
    members: 5,
    progress: 82,
  },
  {
    name: "Nimbus",
    status: "Paused",
    members: 3,
    progress: 47,
  },
  {
    name: "Aurora",
    status: "Active",
    members: 8,
    progress: 61,
  },
];

const statusColor: Record<string, "default" | "secondary" | "destructive"> = {
  Active: "default",
  Paused: "secondary",
  Stopped: "destructive",
};

export function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Overview</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Team dashboard
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input placeholder="Search projects" className="max-w-sm" />
          <Button className="w-full sm:w-auto" variant="default">
            New project
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{projects.length}</p>
            <p className="mt-2 text-sm text-slate-500">
              Projects currently running in the workspace.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-slate-600">Updated just now</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">14</p>
            <p className="mt-2 text-sm text-slate-500">
              Total number of people with access to this workspace.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-slate-600">Updated 2 minutes ago</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">2</p>
            <p className="mt-2 text-sm text-slate-500">
              Deployments currently in progress.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-slate-600">Last run 1h ago</p>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <p className="text-sm text-slate-500">
            Track progress and status across your active workstreams.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.name}>
                  <TableCell className="font-medium text-slate-900">{project.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor[project.status] ?? "default"}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.members}</TableCell>
                  <TableCell>
                    <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-slate-900"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{project.progress}%</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
