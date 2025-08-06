import React from "react";
import { DashboardGridCliente } from "./DashboardGridCliente";
import { DashboardGridEntrenador } from "./DashboardGridEntrenador";
import { DashboardGridGym } from "./DashboardGridGym";
import { DashboardGridNutricionista } from "./DashboardGridNutricionista";
// import { DashboardGridGimnasio } from "./DashboardGridGimnasio";

interface DashboardGridProps {
  role: "entrenador" | "cliente" | "gimnasio" | "nutricionista";
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ role }) => {
  switch (role) {
    case "entrenador":
      return <DashboardGridEntrenador />;
    case "cliente":
      return <DashboardGridCliente/>;
    case "gimnasio":
      return <DashboardGridGym />;
    case "nutricionista":
      return <DashboardGridNutricionista />;
    default:
      return null;
  }
};
