import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type MultiSelectDropdownProps = {
  selectedValues: string[];
  setSelectedValues: (val: string[]) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  isDarkMode?: boolean;
};

export function MultiSelectDropdownCustom({
  selectedValues,
  setSelectedValues,
  options,
  placeholder = "Selecciona opciones",
  isDarkMode = false,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);

  return (
    <View style={{ marginBottom: 16, position: "relative", zIndex: open ? 5000 : 1 }}>
      <DropDownPicker
        open={open}
        value={selectedValues}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedValues}
        setItems={setItems}
        multiple={true}
        placeholder={placeholder}
        style={{
          backgroundColor: isDarkMode ? "#070a13" : "#F7F8F8",
          borderColor: "#ccc",
          borderRadius: 16,
        }}
        dropDownContainerStyle={{
          position: "absolute",
          top: 55,
          backgroundColor: isDarkMode ? "#070a13" : "#F7F8F8",
          borderColor: "#ccc",
          borderRadius: 16,
          maxHeight: 200,
          zIndex: 10000,
          elevation: 10,
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
        listMode="SCROLLVIEW"
        scrollViewProps={{ nestedScrollEnabled: true }}
      />

      {/* Etiquetas con seleccionados */}
      {selectedValues.length > 0 && (
        <View style={styles.selectedContainer}>
          {selectedValues.map((val) => {
            const label = items.find((i) => i.value === val)?.label || val;
            return (
              <View key={val} style={styles.chip}>
                <Text style={styles.chipText}>{label}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedValues(selectedValues.filter((v) => v !== val))
                  }
                >
                  <Feather name="x" size={14} color="#374151" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  chipText: {
    fontSize: 12,
    marginRight: 6,
    color: "#374151",
    fontFamily: "Poppins-Regular",
  },
});
s