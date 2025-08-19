import { ViewStyle } from "react-native";
import * as Crypto from "expo-crypto"; // ✅ Correct import

export type CreatePage = {
  key: number;
  style?: ViewStyle;
};

export const createPage = (key: number): CreatePage => {
  return {
    key,
    style: {
      flex: 1,
    },
  };
};

// ✅ Async function since hashing returns a promise
export async function generateHashedPassword(password: string) {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );

  return hash;
}
