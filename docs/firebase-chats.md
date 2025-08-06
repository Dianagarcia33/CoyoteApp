# Estructura de Datos para Chats en Firebase

## 1. Colección: `chats`

Cada documento representa una conversación entre un entrenador y un cliente.

### Estructura del documento:

```javascript
{
  // ID del documento: "chat_[userId1]_[userId2]" (IDs ordenados)
  participantes: ["123", "456"], // Array con IDs de entrenador y cliente
  entrenadorId: "123",
  clienteId: "456", 
  entrenadorNombre: "Juan Pérez",
  clienteNombre: "María García",
  entrenadorAvatar: "https://...",
  clienteAvatar: "https://...",
  ultimoMensaje: "Hola, ¿cómo estás?",
  fechaUltimoMensaje: timestamp,
  fechaCreacion: timestamp,
  activo: true,
  mensajesSinLeer: {
    "123": 0, // mensajes sin leer para el entrenador
    "456": 2  // mensajes sin leer para el cliente
  }
}
```

## 2. Colección: `mensajes`

Cada documento representa un mensaje individual.

### Estructura del documento:

```javascript
{
  chatId: "chat_123_456",
  mensaje: "Hola, ¿cómo va tu entrenamiento?",
  remitenteId: "123",
  remitenteNombre: "Juan Pérez", 
  timestamp: timestamp,
  tipo: "texto", // "texto", "imagen", "audio", etc.
  leido: false,
  // Para mensajes con archivos:
  archivo: {
    url: "https://...",
    tipo: "imagen",
    nombre: "foto.jpg"
  }
}
```

## 3. Configuración de Seguridad en Firebase (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a chats solo a los participantes
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participantes;
    }
    
    // Permitir acceso a mensajes solo a participantes del chat
    match /mensajes/{messageId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/chats/$(resource.data.chatId)) &&
        request.auth.uid in get(/databases/$(database)/documents/chats/$(resource.data.chatId)).data.participantes;
    }
  }
}
```

## 4. Cómo crear un chat de ejemplo en Firebase Console

### 1. Ir a Firebase Console → Firestore Database
### 2. Crear colección "chats"
### 3. Agregar documento con ID: "chat_1_2" (ejemplo)
### 4. Agregar campos:

```json
{
  "participantes": ["1", "2"],
  "entrenadorId": "1",
  "clienteId": "2",
  "entrenadorNombre": "Juan Entrenador",
  "clienteNombre": "Ana Cliente",
  "entrenadorAvatar": "https://ui-avatars.com/api/?name=Juan&background=random",
  "clienteAvatar": "https://ui-avatars.com/api/?name=Ana&background=random",
  "ultimoMensaje": "¡Hola! ¿Listo para entrenar?",
  "fechaUltimoMensaje": "Timestamp",
  "fechaCreacion": "Timestamp", 
  "activo": true,
  "mensajesSinLeer": {
    "1": 0,
    "2": 1
  }
}
```

## 5. Uso en la aplicación

La aplicación ahora:

1. **Muestra chats reales de Firebase** en lugar de datos estáticos
2. **Actualiza en tiempo real** cuando hay nuevos mensajes
3. **Muestra badge con mensajes sin leer** 
4. **Ordena por fecha del último mensaje**
5. **Funciona con cualquier número de conversaciones**

## 6. Funciones disponibles:

- `useChatsRecientes()` - Hook para obtener chats en tiempo real
- `crearChat()` - Crear nueva conversación
- `actualizarUltimoMensaje()` - Actualizar último mensaje
- `marcarMensajesComoLeidos()` - Marcar como leído

## 7. Para probar:

1. Crear algunos chats de ejemplo en Firebase Console
2. Usar el ID del usuario logueado como entrenadorId
3. Los chats aparecerán automáticamente en la pantalla
