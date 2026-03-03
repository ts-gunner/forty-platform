import { useNavbar } from "../../context/NavbarContext";
import { View, Text } from "@tarojs/components";


export default function NavHeaderBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const {navBarHeight, headerHeight} = useNavbar()
  return (
    <View
      className="flex items-end"
      style={{
        height: `${navBarHeight}px`,
        background: "linear-gradient(180deg,#B3C2A3 0%,#DEECCF 100%)",
      }}
    >
      <View
        className="flex items-center"
        style={{
          height: `${headerHeight}px`,
        }}
      >
        {children}
      </View>
    </View>
  );
}
