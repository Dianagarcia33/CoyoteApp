import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';


 
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const hours = [
  '06:00 AM','07:00 AM','08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM'
];

type Event = { hour: string; name: string };
type EventsMap = Record<string, Event[]>;

const events: EventsMap = {
  '2025-08-14': [
    { hour: '09:00 AM', name: 'Dana Villegas' },
    { hour: '12:00 PM', name: 'Nicolas Jaramillo' },
    { hour: '03:00 PM', name: 'Juana Castrillón' },
  ],
};

const getMarkedDates = (selectedDate: string) => ({
  [selectedDate]: {
    selected: true,
    selectedColor: '#FF6A3D',
    customStyles: {
      container: { borderRadius: 12 },
      text: { color: '#fff', fontWeight: 'bold' as const },
    },
  },
});

// const formatFecha = (dateStr: string) => {
//   const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
//   const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
//   const d = new Date(dateStr);
//   return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} ${d.getFullYear()}`;
// };

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('2025-08-14');
  const [allEvents, setAllEvents] = useState<EventsMap>(events);
  const [showList, setShowList] = useState(false);

  // Formatea la fecha y hora para la lista
  const formatListDate = (dateStr: string, hour: string) => {
    const d = new Date(dateStr);
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    // 14/08, 9:00 am
    const [year, month, day] = dateStr.split('-');
    return `${dias[d.getDay()]}, ${day}/${month}, ${hour.toLowerCase()}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 12 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222' }}>{showList ? 'Listado de citas' : 'Calendario'}</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 6 }}
          onPress={() => setShowList((v) => !v)}
        >
          <Ionicons name={showList ? 'calendar-outline' : 'menu'} size={22} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Vista de listado de citas */}
      {showList ? (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ paddingBottom: 24 }}>
          {Object.entries(allEvents).flatMap(([date, evs]) =>
            evs.map((ev, idx) => (
              <View
                key={date + ev.hour}
                style={{
                  backgroundColor: '#FFF3F0',
                  borderColor: '#FF6A3D',
                  borderWidth: 1,
                  borderRadius: 16,
                  marginHorizontal: 16,
                  marginBottom: 16,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#eee', overflow: 'hidden', marginRight: 10, alignItems: 'center', justifyContent: 'center' }}>
                  {/* Aquí podrías poner una imagen real si tienes la URL, por ahora solo un círculo de color */}
                  <Ionicons name="person-circle" size={48} color="#bdbdbd" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 2 }}>{ev.name}</Text>
                  <Text style={{ color: '#bdbdbd', fontSize: 14 }}>{formatListDate(date, ev.hour)}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <>
          {/* Calendario horizontal */}
          <Calendar
            current={selectedDate}
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates(selectedDate)}
            hideExtraDays
            theme={{
              backgroundColor: '#fff',
              calendarBackground: '#fff',
              textSectionTitleColor: '#bdbdbd',
              selectedDayBackgroundColor: '#FF6A3D',
              selectedDayTextColor: '#fff',
              todayTextColor: '#FF6A3D',
              dayTextColor: '#222',
              textDisabledColor: '#e0e0e0',
              monthTextColor: '#222',
              arrowColor: '#FF6A3D',
              textDayFontWeight: 'bold',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: 'bold',
              textDayFontSize: 15,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
            style={{ marginHorizontal: 0, marginBottom: 10 }}
            firstDay={1}
            enableSwipeMonths
            renderArrow={direction => (
              <Ionicons name={direction === 'left' ? 'chevron-back' : 'chevron-forward'} size={20} color="#FF6A3D" />
            )}
          />

          {/* Horas y eventos */}
          <ScrollView style={{ flex: 1, marginTop: 10 }} contentContainerStyle={{ paddingBottom: 80 }}>
            {hours.map(hour => {
              const event = (allEvents[selectedDate] ?? []).find((e) => e.hour === hour);
              return (
                <View key={hour} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginLeft: 20 }}>
                  <Text style={{ color: '#bdbdbd', width: 70 }}>{hour}</Text>
                  {event && (
                    <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: '#FF6A3D', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 18, marginLeft: 10 }}>
                      <Text style={{ color: '#FF6A3D', fontWeight: 'bold', fontSize: 15 }}>{event.name}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </>
      )}

      {/* Botón flotante */}
      {!showList && (
        <TouchableOpacity
          style={{ position: 'absolute', right: 24, bottom: 32, backgroundColor: '#FF6A3D', borderRadius: 28, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 4 }}
          onPress={() => {
            // Navegar a la nueva vista para agendar entreno
            router.push('/calendar/new');
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* El modal se reemplaza por una nueva vista para agendar entreno */}
    </View>
  );
}
