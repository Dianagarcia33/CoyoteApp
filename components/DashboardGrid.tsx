import React from "react";
import { DashboardGridEntrenador } from "./DashboardGridEntrenador";
// Importa los otros grid cuando los tengas
// import { DashboardGridCliente } from "./DashboardGridCliente";
// import { DashboardGridGimnasio } from "./DashboardGridGimnasio";

interface DashboardGridProps {
  role: "entrenador" | "cliente" | "gimnasio" | "nutricionista";
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ role }) => {
  switch (role) {
    case "entrenador":
      return <DashboardGridEntrenador />;
    // case "cliente":
    //   return <DashboardGridCliente />;
    // case "gimnasio":
    //   return <DashboardGridGimnasio />;
    // case "nutricionista":
    //   return <DashboardGridNutricionista />;
    default:
      return null;
  }
};
