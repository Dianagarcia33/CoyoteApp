import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type SelectDropdownCustomProps = {
  value: string;
  setValue: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  isDarkMode?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode; // <-- ícono a la izquierda
};

export function SelectDropdownCustom({
  value,
  setValue,
  options,
  placeholder = "Yo soy",
  isDarkMode = false,
  errorMessage,
  icon,
}: SelectDropdownCustomProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);

  return (
    <View style={{ width: "100%", marginBottom: 10, zIndex: 50 }}>
      {/* Contenedor horizontal para ícono + dropdown */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? "#070a13" : "#F7F8F8",
            borderColor: errorMessage ? "#ef4444" : "transparent",
          },
        ]}
      >
        {/* Ícono a la izquierda */}
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        {/* Dropdown toma el resto del espacio */}
        <View style={{ flex: 1 }}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={placeholder}
            style={[
              styles.dropdown,
              {
                backgroundColor: isDarkMode ? "#070a13" : "#F7F8F8",
                borderColor: "transparent",
              },
            ]}
            dropDownContainerStyle={{
              backgroundColor: isDarkMode ? "#070a13" : "#F7F8F8",
              borderColor: "#ccc",

              maxHeight: 200,
              borderRadius: 16,
            }}
            textStyle={{
              fontFamily: "Poppins-Regular",
              color: isDarkMode ? "#F9FAFB" : "#374151",
              fontSize: 14,
            }}
            placeholderStyle={{
              color: isDarkMode ? "#9CA3AF" : "#A1A1AA",
              fontFamily: "Poppins-Regular",
            }}
            listItemLabelStyle={{
              fontFamily: "Poppins-Regular",
            }}
            arrowIconStyle={{
              tintColor: isDarkMode ? "#F9FAFB" : "#374151",
            }}
            listMode="FLATLIST" 
            scrollViewProps={{ nestedScrollEnabled: true }}  
            dropDownDirection="AUTO"  
            zIndex={open ? 5000 : 1}  
            zIndexInverse={1000}  
          />
        </View>
      </View>

      {errorMessage && (
        <Text
          style={{
            marginTop: 4,
            color: "#ef4444",
            fontSize: 12,
            fontWeight: "600",
            fontFamily: "Poppins-Regular",
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 10,
  },
  dropdown: {
    borderRadius: 16,
    paddingHorizontal: 0, // para que no haya padding extra dentro del dropdown
  },
});
