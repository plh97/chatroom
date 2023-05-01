interface LayoutProps {
  children?: React.ReactNode; // 👈️ for demo purposes
}

export function LayoutComponent(props: LayoutProps) {
  return (
    <div className="h-full flex">
      <SidebarComponent />
      <div className="flex flex-1 flex-col">{props.children}</div>
    </div>
  );
}
