import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!checked)}
      activeOpacity={0.8}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <View style={styles.innerCheck} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    backgroundColor: "white",
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: "#a8a29e",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#2563eb",
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: "white",
    borderRadius: 2,
  },
});
