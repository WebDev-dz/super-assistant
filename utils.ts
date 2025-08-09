import { ViewStyle } from "react-native";

export type CreatePage = {
  key: number;
  style?: ViewStyle;
};

export const createPage = (key: number): CreatePage => {
  return {
    key: key,
    style: {
      flex: 1,
     
    },
  };
};