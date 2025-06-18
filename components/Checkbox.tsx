import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!checked)}
      activeOpacity={0.8}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <View style={styles.innerCheck} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16, // equivalente a 4 * 4px
    height: 16,
    backgroundColor: "white",
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: "#a8a29e", // color similar a stone-400
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#2563eb", // azul para mostrar seleccionado, puedes cambiar
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: "white",
    borderRadius: 2,
  },
  label: { 
    fontFamily: "Poppins-Regular",
    marginLeft: 8,
    fontSize: 14,
    color: "#000",
  },
});
