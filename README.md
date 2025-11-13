# Tic Tac Toe - React Native

Aplicación de Tres en Raya (Tic Tac Toe) desarrollada en React Native con soporte para partidas offline y online multijugador.

## 📋 Descripción

Juego de Tres en Raya con las siguientes características:

`Modo Offline:` Juego local en el mismo dispositivo para dos jugadores

`Modo Online:` Partidas multijugador contra otros dispositivos en tiempo real

`Tableros configurables:` Desde 3x3 hasta 7x7

`Sistema de puntuación:` Seguimiento de victorias y derrotas

`Interfaz responsiva:` Adaptable a diferentes tamaños de pantalla

## 🚀 Características

✅ **Modo offline y online**

✅ **Tableros de 3x3, 4x4, 5x5, 6x7, 7x7**

✅ **Detección automática de ganador y empate**

✅ **Resaltado de línea ganadora**

✅ **Sistema de estadísticas por dispositivo**

✅ **Sincronización en tiempo real en modo online**

✅ **Polling automático para actualización de estado**

✅ **UI moderna y limpia**

## 🏗️ Estructura del Proyecto

### Componentes Principales

`Game.tsx` - Componente principal que gestiona el estado del juego, modos offline/online y la lógica de coordinación

`Board.tsx` - Renderiza el tablero de juego con la matriz de cuadrados

`Square.tsx` - Componente individual de cada cuadrado del tablero

`ScoreBoard.tsx` - Muestra el marcador de victorias en modo offline

`PlayAgainButton.tsx` - Botón para reiniciar/rendirse en la partida

`Stats.tsx`- Botón y modal para ver estadísticas del jugador

`StatsView.tsx` - Vista detallada de estadísticas

## Utilidades

`conection.ts` - Funciones para comunicación con la API del servidor

`gameLogic.ts` - Lógica de detección de ganador y líneas ganadoras

## 🔌 API

El juego se conecta a un servidor Flask en [http://127.0.0.1:5000/](http://127.0.0.1:5000/) hecho por el profesor con los siguientes endpoints:

`POST /devices` - Registrar un nuevo dispositivo

` GET /devices/{id}/info  `- Obtener estadísticas del dispositivo

` POST /matches  `- Buscar/crear una partida online

` GET /matches/waiting-status  `- Verificar estado de búsqueda

` GET /matches/{match_id}  `- Obtener estado de la partida

`POST /matches/{match_id}/moves` - Realizar un movimiento

## 🎮 Flujo de Juego

### Modo Offline

Seleccionar tamaño del tablero (3x3 a 7x7)

Iniciar juego offline

Los jugadores alternan turnos en el mismo dispositivo

El juego detecta ganador o empate automáticamente

Se actualiza el marcador local

Modo Online
Seleccionar tamaño del tablero

Buscar partida online

El servidor empareja con otro jugador

El servidor asigna X u O a cada jugador

Los jugadores hacen movimientos cuando es su turno

El tablero se sincroniza automáticamente cada segundo

El juego detecta ganador o empate

## 🛠️ Tecnologías

`React Native` - Framework principal

`TypeScript` - Tipado estático

`React Hooks` - Gestión de estado

`Fetch API` - Comunicación con el servidor

`StyleSheet` - Estilos nativos

## 📱 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## 📚 Documentación de Componentes

Para más detalles sobre cada componente, consulta:

  * [`Game.tsx` - Documentación](./docs/Game.md)
  * [`Board.tsx` - Documentación](./docs/Board.md)
  * [`Square.tsx` - Documentación](./docs/Square.md)
  * [`ScoreBoard.tsx` - Documentación](./docs/ScoreBoard.md)
  * [`PlayAgainButton.tsx` - Documentación](./docs/PlayAgainButton.md)
  * [`Stats.tsx` - Documentación](./docs/Stats.md)
  * [`StatsView.tsx` - Documentación](./docs/StatsView.md)
  * [`Conexión API` - Documentación](./docs/conection.md)
  * [`Lógica del Juego` - Documentación](./docs/gameLogic.md)

## 🐛 Notas Técnicas

Sincronización Cliente-Servidor
El servidor maneja el tablero como una matriz 2D: board[fila][columna]. El cliente:

Recibe el board 2D del servidor

Lo aplana a 1D con .flat() para renderizar

Al hacer click, convierte el índice a coordenadas: row = floor(index/size), col = index % size

Envía al servidor: { device\_id, x: row, y: col }

El servidor actualiza board[x][y]

Polling
Búsqueda de partida: Polling cada 2 segundos a /matches/waiting-status

Durante partida: Polling cada 1 segundo a /matches/{match\_id} para sincronizar estado

# 📄 Licencia

Este proyecto fue desarrollado como práctica educativa