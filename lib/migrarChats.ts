import { get, ref } from 'firebase/database';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, rtdb } from './firebase';

export const migrarChatsRealtimeAFirestore = async (entrenadorId: string) => {
  console.log('=== MIGRACIÓN REALTIME DB → FIRESTORE ===');
  console.log('Entrenador ID:', entrenadorId);

  try {
    // 1. Obtener todos los chats de Realtime Database
    const chatsRef = ref(rtdb, 'chats');
    const snapshot = await get(chatsRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No hay chats en Realtime Database');
      return { migrados: 0, errores: 0 };
    }

    const chatsData = snapshot.val();
    console.log('📊 Chats encontrados en Realtime Database:', Object.keys(chatsData).length);

    let migrados = 0;
    let errores = 0;

    // 2. Procesar cada chat
    for (const [chatKey, chatData] of Object.entries(chatsData)) {
      try {
        console.log(`📝 Procesando chat: ${chatKey}`);
        const messages = (chatData as any).messages || {};
        const messageArray = Object.values(messages);

        if (messageArray.length === 0) {
          console.log(`⏭️ Chat ${chatKey} sin mensajes, saltando...`);
          continue;
        }

        // Obtener último mensaje
        const ultimoMensaje = messageArray
          .sort((a: any, b: any) => b.createdAt - a.createdAt)[0] as any;

        // Inferir IDs de participantes desde el chat key y mensajes
        // El chat key suele ser algo como "carlos_lopez" en el código actual
        const clienteId = chatKey.replace(/[^\w]/g, '_');
        const chatId = `chat_${entrenadorId}_${clienteId}`;

        // Obtener nombres de los mensajes
        const clienteNombre = obtenerNombreDeKey(chatKey);
        
        // Crear documento de chat en Firestore
        const chatFirestore = {
          participantes: [entrenadorId, clienteId],
          entrenadorId: entrenadorId,
          clienteId: clienteId,
          entrenadorNombre: 'Entrenador',
          clienteNombre: clienteNombre,
          entrenadorAvatar: `https://ui-avatars.com/api/?name=Entrenador&background=random`,
          clienteAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(clienteNombre)}&background=random`,
          ultimoMensaje: ultimoMensaje.text || 'Mensaje',
          fechaUltimoMensaje: new Date(ultimoMensaje.createdAt),
          fechaCreacion: serverTimestamp(),
          activo: true,
          mensajesSinLeer: {
            [entrenadorId]: 0,
            [clienteId]: 0
          },
          // Metadata de migración
          migradoDesdeRealtime: true,
          fechaMigracion: serverTimestamp(),
          chatKeyOriginal: chatKey
        };

        // Guardar en Firestore
        await setDoc(doc(db, 'chats', chatId), chatFirestore);
        
        // Migrar mensajes individuales
        let mensajesMigrados = 0;
        for (const [messageKey, messageData] of Object.entries(messages)) {
          try {
            const mensaje = messageData as any;
            const mensajeFirestore = {
              chatId: chatId,
              mensaje: mensaje.text || '',
              remitenteId: mensaje.sender === 'me' ? entrenadorId : clienteId,
              remitenteNombre: mensaje.sender === 'me' ? 'Entrenador' : clienteNombre,
              timestamp: new Date(mensaje.createdAt),
              tipo: 'texto',
              leido: true, // Asumir que mensajes antiguos están leídos
              // Metadata de migración
              migradoDesdeRealtime: true,
              messageKeyOriginal: messageKey
            };

            const mensajeId = `msg_${chatId}_${mensaje.createdAt}_migrado`;
            await setDoc(doc(db, 'mensajes', mensajeId), mensajeFirestore);
            mensajesMigrados++;
          } catch (msgError) {
            console.warn(`⚠️ Error migrando mensaje en chat ${chatKey}:`, msgError);
          }
        }

        console.log(`✅ Chat ${chatKey} migrado: ${mensajesMigrados} mensajes`);
        migrados++;

      } catch (chatError) {
        console.error(`❌ Error migrando chat ${chatKey}:`, chatError);
        errores++;
      }
    }

    console.log(`🎉 Migración completada: ${migrados} chats migrados, ${errores} errores`);
    return { migrados, errores };

  } catch (error) {
    console.error('❌ Error en migración:', error);
    throw error;
  }
};

// Función helper para obtener nombre legible desde chat key
const obtenerNombreDeKey = (chatKey: string): string => {
  // Convertir "carlos_lopez" → "Carlos López"
  return chatKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const verificarChatsRealtime = async () => {
  console.log('=== VERIFICACIÓN REALTIME DATABASE ===');
  
  try {
    const chatsRef = ref(rtdb, 'chats');
    const snapshot = await get(chatsRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No hay datos en Realtime Database');
      return { chats: 0, mensajes: 0 };
    }

    const chatsData = snapshot.val();
    const chatKeys = Object.keys(chatsData);
    console.log('📊 Chats en Realtime Database:', chatKeys.length);

    let totalMensajes = 0;
    chatKeys.forEach(chatKey => {
      const messages = chatsData[chatKey].messages || {};
      const messageCount = Object.keys(messages).length;
      totalMensajes += messageCount;
      console.log(`💬 Chat '${chatKey}': ${messageCount} mensajes`);
      
      // Mostrar algunos mensajes de ejemplo
      const messageArray = Object.values(messages).slice(0, 2);
      messageArray.forEach((msg: any, index) => {
        console.log(`  ${index + 1}. [${msg.sender}]: ${msg.text}`);
      });
    });

    console.log(`📈 Total: ${chatKeys.length} chats, ${totalMensajes} mensajes`);
    return { chats: chatKeys.length, mensajes: totalMensajes };

  } catch (error) {
    console.error('❌ Error verificando Realtime Database:', error);
    throw error;
  }
};
