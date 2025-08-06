import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../app/context/AuthContext";

type Props = {
  isDarkMode?: boolean;
};

export const UserInfo: React.FC<Props> = ({ isDarkMode = false }) => {
  const { user } = useAuth();

  if (!user) return null;

  const textColor = isDarkMode ? "#FFFFFF" : "#111827";
  const subTextColor = isDarkMode ? "#FFFFFF" : "#111827";

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
         
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: 20,
            color: textColor, 
          }}
        >
          Hola, {user.name}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
         
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 14,  
            marginTop: -10,
            color: subTextColor,
          }}
        >
          Rol: {user.role}
        </Text>
      </View>
    </View>
  );
};
