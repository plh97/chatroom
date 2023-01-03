export function RoomPage() {
  useAuth();
  return (
    <LayoutComponent>
      <ContentComponent />
      <ControlComponent />
    </LayoutComponent>
  );
}
