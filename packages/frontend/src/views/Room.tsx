import ContentComponent from "@/components/Content";
import ControlComponent from "@/components/Input";
import LayoutComponent from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";

export default function RoomPage() {
  useAuth();
  return (
    <LayoutComponent>
      <ContentComponent />
      <ControlComponent />
    </LayoutComponent>
  );
}
