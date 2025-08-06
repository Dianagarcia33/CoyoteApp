import React from 'react';
import { KettlebellRating } from './KettlebellRating';

interface CalificacionesProps {
  promedio?: number;
  totalCalificaciones?: number;
  loading?: boolean;
  showText?: boolean;
}

export const CalificacionesComponent: React.FC<CalificacionesProps> = ({
  promedio = 0,
  totalCalificaciones = 0,
  loading = false,
  showText = true,
}) => {
  return (
    <KettlebellRating
      rating={promedio}
      totalRatings={totalCalificaciones}
      showText={showText}
      loading={loading}
      size="medium"
    />
  );
};
