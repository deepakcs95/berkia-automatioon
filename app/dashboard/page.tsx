import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
export default async function Dashboard() {
  const projects = new Array(10).fill({
    name: "Project 1",
    url: "/",
    icon: () => <div>Icon</div>,
  });
  return (
    <SidebarProvider>
      <SidebarMenu>
        {projects.map((project, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>
              <a href={project.url}>
                <project.icon />
                <span>{project.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarProvider>
  );
}
