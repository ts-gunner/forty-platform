import { useState } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import HomeTab from "./HomeTab";

export default function Index() {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [searchValue, setSearchValue] = useState("");
  const searchValueChange = (val: string) => {
    setSearchValue(val);
  };
  return (
    <View>
      <HomeTab />
    </View>
  );
}
