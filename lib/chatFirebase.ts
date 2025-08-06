import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type ParticipanteChat = {
  id: string;
  nombre: string;
  avatar: string;
  role: 'entrenador' | 'cliente';
};

export const crearChat = async (
  entrenadorId: string,
  clienteId: string,
  entrenadorNombre: string,
  clienteNombre: string,
  entrenadorAvatar: string,
  clienteAvatar: string
): Promise<string> => {
  try {
    // Crear ID único para el chat combinando los IDs ordenados
    const ids = [entrenadorId, clienteId].sort();
    const chatId = `chat_${ids[0]}_${ids[1]}`;

    // Verificar si el chat ya existe
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      // Crear nuevo chat
      await setDoc(chatRef, {
        participantes: [entrenadorId, clienteId],
        entrenadorId: entrenadorId,
        clienteId: clienteId,
        entrenadorNombre: entrenadorNombre,
        clienteNombre: clienteNombre,
        entrenadorAvatar: entrenadorAvatar,
        clienteAvatar: clienteAvatar,
        ultimoMensaje: '',
        fechaUltimoMensaje: serverTimestamp(),
        fechaCreacion: serverTimestamp(),
        activo: true,
        mensajesSinLeer: {
          [entrenadorId]: 0,
          [clienteId]: 0
        }
      });
    } else {
      // Reactivar chat si estaba inactivo
      await updateDoc(chatRef, {
        activo: true,
        fechaUltimoAcceso: serverTimestamp()
      });
    }

    return chatId;
  } catch (error) {
    console.error('Error al crear/obtener chat:', error);
    throw new Error('No se pudo crear la conversación');
  }
};

export const actualizarUltimoMensaje = async (
  chatId: string,
  mensaje: string,
  remitenteId: string
): Promise<void> => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (chatDoc.exists()) {
      const data = chatDoc.data();
      const participantes = data.participantes || [];
      const mensajesSinLeer = data.mensajesSinLeer || {};
      
      // Incrementar mensajes sin leer para todos los participantes excepto el remitente
      participantes.forEach((participanteId: string) => {
        if (participanteId !== remitenteId) {
          mensajesSinLeer[participanteId] = (mensajesSinLeer[participanteId] || 0) + 1;
        }
      });

      await updateDoc(chatRef, {
        ultimoMensaje: mensaje,
        fechaUltimoMensaje: serverTimestamp(),
        mensajesSinLeer: mensajesSinLeer
      });
    }
  } catch (error) {
    console.error('Error al actualizar último mensaje:', error);
  }
};

export const marcarMensajesComoLeidos = async (
  chatId: string,
  usuarioId: string
): Promise<void> => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (chatDoc.exists()) {
      const data = chatDoc.data();
      const mensajesSinLeer = data.mensajesSinLeer || {};
      mensajesSinLeer[usuarioId] = 0;

      await updateDoc(chatRef, {
        mensajesSinLeer: mensajesSinLeer
      });
    }
  } catch (error) {
    console.error('Error al marcar mensajes como leídos:', error);
  }
};
