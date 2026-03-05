import { useSelector } from "react-redux";
import { withGlobalLayout } from "../../utils/withGlobalLayout";
import React from "react";
import { RootState } from "@/store";
import Taro, { useDidShow } from "@tarojs/taro";

function CollectionPage() {

  return <div>CollectionPage</div>;
}

export default withGlobalLayout(CollectionPage);
