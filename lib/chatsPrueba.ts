import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Función para crear chats de prueba en Firebase
export const crearChatsDePrueba = async (entrenadorId: string) => {
  try {
    console.log('Creando chats de prueba para entrenador:', entrenadorId);

    const ahora = new Date();
    const hace30min = new Date(ahora.getTime() - 30 * 60 * 1000);
    const hace1hora = new Date(ahora.getTime() - 60 * 60 * 1000);
    const hace3horas = new Date(ahora.getTime() - 3 * 60 * 60 * 1000);

    // Chat 1: Con Ana García (último mensaje recibido del cliente)
    const chat1Id = `chat_${entrenadorId}_ana_garcia`;
    await setDoc(doc(db, 'chats', chat1Id), {
      participantes: [entrenadorId, 'ana_garcia'],
      entrenadorId: entrenadorId,
      clienteId: 'ana_garcia',
      entrenadorNombre: 'Entrenador',
      clienteNombre: 'Ana García',
      entrenadorAvatar: 'https://ui-avatars.com/api/?name=Entrenador&background=random',
      clienteAvatar: 'https://ui-avatars.com/api/?name=Ana+Garcia&background=random',
      ultimoMensaje: '¡Hola! ¿Cómo va mi rutina de esta semana?',
      fechaUltimoMensaje: hace30min,
      fechaCreacion: serverTimestamp(),
      activo: true,
      mensajesSinLeer: {
        [entrenadorId]: 2,
        'ana_garcia': 0
      }
    });

    // Chat 2: Con Carlos López (último mensaje enviado por el entrenador)
    const chat2Id = `chat_${entrenadorId}_carlos_lopez`;
    await setDoc(doc(db, 'chats', chat2Id), {
      participantes: [entrenadorId, 'carlos_lopez'],
      entrenadorId: entrenadorId,
      clienteId: 'carlos_lopez',
      entrenadorNombre: 'Entrenador',
      clienteNombre: 'Carlos López',
      entrenadorAvatar: 'https://ui-avatars.com/api/?name=Entrenador&background=random',
      clienteAvatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=random',
      ultimoMensaje: 'Perfecto, nos vemos mañana a las 3pm 👍',
      fechaUltimoMensaje: hace1hora,
      fechaCreacion: serverTimestamp(),
      activo: true,
      mensajesSinLeer: {
        [entrenadorId]: 0,
        'carlos_lopez': 1
      }
    });

    // Chat 3: Con María Rodríguez (último mensaje enviado por el entrenador)
    const chat3Id = `chat_${entrenadorId}_maria_rodriguez`;
    await setDoc(doc(db, 'chats', chat3Id), {
      participantes: [entrenadorId, 'maria_rodriguez'],
      entrenadorId: entrenadorId,
      clienteId: 'maria_rodriguez',
      entrenadorNombre: 'Entrenador',
      clienteNombre: 'María Rodríguez',
      entrenadorAvatar: 'https://ui-avatars.com/api/?name=Entrenador&background=random',
      clienteAvatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=random',
      ultimoMensaje: '¡Excelente trabajo en la sesión de hoy! 💪',
      fechaUltimoMensaje: hace3horas,
      fechaCreacion: serverTimestamp(),
      activo: true,
      mensajesSinLeer: {
        [entrenadorId]: 0,
        'maria_rodriguez': 0
      }
    });

    // Crear mensajes de ejemplo para simular conversaciones reales
    // Mensaje enviado por el entrenador a Carlos
    await setDoc(doc(db, 'mensajes', `msg_${chat2Id}_${Date.now()}_1`), {
      chatId: chat2Id,
      mensaje: '¿Podemos cambiar la hora de mañana? Tengo una reunión.',
      remitenteId: 'carlos_lopez',
      remitenteNombre: 'Carlos López',
      timestamp: new Date(hace1hora.getTime() - 10 * 60 * 1000), // 10 min antes
      tipo: 'texto',
      leido: true
    });

    await setDoc(doc(db, 'mensajes', `msg_${chat2Id}_${Date.now()}_2`), {
      chatId: chat2Id,
      mensaje: 'Perfecto, nos vemos mañana a las 3pm 👍',
      remitenteId: entrenadorId,
      remitenteNombre: 'Entrenador',
      timestamp: hace1hora,
      tipo: 'texto',
      leido: false
    });

    // Mensaje enviado por el entrenador a María
    await setDoc(doc(db, 'mensajes', `msg_${chat3Id}_${Date.now()}_1`), {
      chatId: chat3Id,
      mensaje: 'Gracias por la sesión de hoy, me siento genial!',
      remitenteId: 'maria_rodriguez',
      remitenteNombre: 'María Rodríguez',
      timestamp: new Date(hace3horas.getTime() - 15 * 60 * 1000), // 15 min antes
      tipo: 'texto',
      leido: true
    });

    await setDoc(doc(db, 'mensajes', `msg_${chat3Id}_${Date.now()}_2`), {
      chatId: chat3Id,
      mensaje: '¡Excelente trabajo en la sesión de hoy! 💪',
      remitenteId: entrenadorId,
      remitenteNombre: 'Entrenador',
      timestamp: hace3horas,
      tipo: 'texto',
      leido: true
    });

    // Mensajes de Ana (solo recibidos)
    await setDoc(doc(db, 'mensajes', `msg_${chat1Id}_${Date.now()}_1`), {
      chatId: chat1Id,
      mensaje: 'Hola! ¿Cómo va todo?',
      remitenteId: 'ana_garcia',
      remitenteNombre: 'Ana García',
      timestamp: new Date(hace30min.getTime() - 5 * 60 * 1000), // 5 min antes
      tipo: 'texto',
      leido: false
    });

    await setDoc(doc(db, 'mensajes', `msg_${chat1Id}_${Date.now()}_2`), {
      chatId: chat1Id,
      mensaje: '¡Hola! ¿Cómo va mi rutina de esta semana?',
      remitenteId: 'ana_garcia',
      remitenteNombre: 'Ana García',
      timestamp: hace30min,
      tipo: 'texto',
      leido: false
    });

    console.log('Chats de prueba creados exitosamente con mensajes bidireccionales');
    return true;
  } catch (error) {
    console.error('Error al crear chats de prueba:', error);
    throw error;
  }
};

// Función para eliminar chats de prueba
export const eliminarChatsDePrueba = async (entrenadorId: string) => {
  try {
    const { deleteDoc, collection, query, where, getDocs } = await import('firebase/firestore');
    
    const chatIds = [
      `chat_${entrenadorId}_ana_garcia`,
      `chat_${entrenadorId}_carlos_lopez`,
      `chat_${entrenadorId}_maria_rodriguez`
    ];

    // Eliminar chats
    for (const chatId of chatIds) {
      await deleteDoc(doc(db, 'chats', chatId));
    }

    // Eliminar mensajes asociados
    for (const chatId of chatIds) {
      const mensajesQuery = query(
        collection(db, 'mensajes'),
        where('chatId', '==', chatId)
      );
      
      const mensajesSnapshot = await getDocs(mensajesQuery);
      const deletePromises = mensajesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }

    console.log('Chats de prueba y mensajes eliminados exitosamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar chats de prueba:', error);
    throw error;
  }
};
