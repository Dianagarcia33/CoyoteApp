import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const debugChatsRecientes = async (userId: string) => {
  console.log('=== DEBUG CHATS RECIENTES ===');
  console.log('User ID:', userId);

  try {
    // 1. Verificar chats donde el usuario participa
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participantes', 'array-contains', userId)
    );
    
    const chatsSnapshot = await getDocs(chatsQuery);
    console.log('📊 Chats encontrados:', chatsSnapshot.size);
    
    const chatIds: string[] = [];
    chatsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`💬 Chat ${doc.id}:`, {
        participantes: data.participantes,
        clienteNombre: data.clienteNombre,
        ultimoMensaje: data.ultimoMensaje,
        fechaUltimoMensaje: data.fechaUltimoMensaje?.toDate(),
        activo: data.activo,
        mensajesSinLeer: data.mensajesSinLeer
      });
      chatIds.push(doc.id);
    });

    // 2. Verificar mensajes enviados por el usuario
    const mensajesEnviadosQuery = query(
      collection(db, 'mensajes'),
      where('remitenteId', '==', userId)
    );
    
    const mensajesEnviadosSnapshot = await getDocs(mensajesEnviadosQuery);
    console.log('📤 Mensajes enviados por usuario:', mensajesEnviadosSnapshot.size);
    
    const chatIdsConMensajes = new Set<string>();
    mensajesEnviadosSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`✉️ Mensaje enviado en chat ${data.chatId}:`, {
        mensaje: data.mensaje,
        timestamp: data.timestamp?.toDate(),
        remitenteNombre: data.remitenteNombre
      });
      chatIdsConMensajes.add(data.chatId);
    });

    // 3. Verificar si hay chats con mensajes que no aparecen en la colección chats
    chatIdsConMensajes.forEach(async (chatId) => {
      if (!chatIds.includes(chatId)) {
        console.log(`⚠️ Chat ${chatId} tiene mensajes pero no existe en colección chats`);
        
        // Intentar obtener el documento del chat
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (chatDoc.exists()) {
          console.log(`✅ Chat ${chatId} existe en Firebase:`, chatDoc.data());
        } else {
          console.log(`❌ Chat ${chatId} NO existe en Firebase`);
        }
      }
    });

    // 4. Verificar mensajes en chats conocidos
    if (chatIds.length > 0) {
      // Firestore tiene límite de 10 para queries 'in'
      const chatIdsLimited = chatIds.slice(0, 10);
      const mensajesQuery = query(
        collection(db, 'mensajes'),
        where('chatId', 'in', chatIdsLimited)
      );
      
      const mensajesSnapshot = await getDocs(mensajesQuery);
      console.log('📥 Mensajes totales en chats conocidos:', mensajesSnapshot.size);
      
      const mensajesPorChat = new Map<string, any[]>();
      mensajesSnapshot.forEach((doc) => {
        const data = doc.data();
        const chatId = data.chatId;
        
        if (!mensajesPorChat.has(chatId)) {
          mensajesPorChat.set(chatId, []);
        }
        mensajesPorChat.get(chatId)!.push(data);
      });
      
      // Mostrar resumen por chat
      mensajesPorChat.forEach((mensajes, chatId) => {
        const mensajesOrdenados = mensajes.sort((a, b) => 
          b.timestamp?.toDate().getTime() - a.timestamp?.toDate().getTime()
        );
        const ultimoMensaje = mensajesOrdenados[0];
        
        console.log(`📋 Chat ${chatId} - ${mensajes.length} mensajes, último:`, {
          mensaje: ultimoMensaje.mensaje,
          remitente: ultimoMensaje.remitenteNombre,
          fecha: ultimoMensaje.timestamp?.toDate()
        });
      });
    }

    // 5. Conclusiones del debug
    console.log('🔍 CONCLUSIONES:');
    console.log(`- Chats en colección 'chats': ${chatsSnapshot.size}`);
    console.log(`- Mensajes enviados por usuario: ${mensajesEnviadosSnapshot.size}`);
    console.log(`- Chats únicos con mensajes: ${chatIdsConMensajes.size}`);
    
    if (chatsSnapshot.size === 0 && mensajesEnviadosSnapshot.size > 0) {
      console.log('⚠️ PROBLEMA: Hay mensajes pero no hay chats en la colección chats');
    }
    
    if (chatsSnapshot.size > 0 && mensajesEnviadosSnapshot.size === 0) {
      console.log('ℹ️ INFO: Hay chats pero el usuario no ha enviado mensajes');
    }

    return {
      chatsEncontrados: chatsSnapshot.size,
      mensajesEnviados: mensajesEnviadosSnapshot.size,
      chatIds: chatIds,
      chatIdsConMensajes: Array.from(chatIdsConMensajes)
    };

  } catch (error) {
    console.error('❌ Error en debug:', error);
    throw error;
  }
};
