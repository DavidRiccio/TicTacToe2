

# `StatsButton.tsx` - Documentación de Estado y Lógica

## Propiedades (Props) Recibidas

`deviceId` - `string`
**(Requerido)** El ID único del dispositivo del usuario. Es esencial, ya que se pasa directamente a la función `fetchStats` para que la API sepa de quién son las estadísticas que debe devolver.

```typescript
export const StatsButton: React.FC<StatsButtonProps> = ({ deviceId }) => {
  // ...
  const handlePress = async () => {
    // ...
    const data = await fetchStats(deviceId); // Se usa aquí
    // ...
  };
}
```

-----

## Estados (State)

Este componente gestiona cuatro piezas de estado para controlar el modal y el ciclo de vida de la petición de datos.

`showStats` - `boolean`
Controla si el `<Modal>` está visible o no. Se activa con `handlePress` y se desactiva con `handleClose`.

```typescript
const [showStats, setShowStats] = useState(false);

<Modal
  visible={showStats}
  // ...
/>
```

`stats` - `Stats | null`
Almacena los datos de estadísticas (`{ wins, losses, ratio }`) cuando la petición a `fetchStats` es exitosa. Es `null` al inicio y se limpia al cerrar el modal.

```typescript
interface Stats {
  wins: string;
  losses: string;
  ratio: string;
}
const [stats, setStats] = useState<Stats | null>(null);

// Se usa para el renderizado de éxito
{stats && !loading && (
  <View style={styles.statsContainer}>
    <Text>{stats.wins}</Text>
    {/* ...etc */}
  </View>
)}
```

`loading` - `boolean`
Bandera de carga. Se pone en `true` justo antes de hacer la petición a la API y en `false` cuando la petición termina (ya sea con éxito o error). Controla el `ActivityIndicator`.

```typescript
const [loading, setLoading] = useState(false);

// Se establece en 'handlePress'
const handlePress = async () => {
  setLoading(true);
  // ...
  try {
    // ...
  } catch (err) {
    // ...
  } finally {
    setLoading(false); // Se asegura de pararlo siempre
  }
};

// Se usa para renderizado
{loading && (
  <ActivityIndicator size="large" ... />
)}
```

`error` - `string | null`
Almacena un mensaje de error si la petición `fetchStats` falla dentro del bloque `catch`. Es `null` si no hay error.

```typescript
const [error, setError] = useState<string | null>(null);

// Se establece en 'handlePress'
try {
  // ...
} catch (err) {
  setError('Error al cargar estadísticas');
  console.error(err);
}

// Se usa para renderizado
{error && !loading && (
  <Text style={styles.errorText}>{error}</Text>
)}
```

-----

## Lógica de Funciones (Handlers)

`handlePress` - `async () => void`
La función principal, se activa al presionar el botón "Ver Estadísticas". Orquesta todo el proceso:

1.  Pone `showStats` en `true` para abrir el modal.
2.  Pone `loading` en `true` para mostrar el spinner.
3.  Limpia cualquier error anterior (`setError(null)`).
4.  Ejecuta `await fetchStats(deviceId)`.
5.  **Si tiene éxito:** Guarda los datos con `setStats(data)`.
6.  **Si falla:** Captura el error y lo guarda con `setError(...)`.
7.  **Finalmente:** Pone `loading` en `false` para ocultar el spinner.

`handleClose` - `() => void`
Se activa al presionar el botón "Cerrar" o al usar el gesto de cierre del modal. Su única función es **resetear el estado** a su valor inicial:

1.  Pone `showStats` en `false` para cerrar el modal.
2.  Limpia los datos (`setStats(null)`).
3.  Limpia los errores (`setError(null)`).

-----

## Flujo de Renderizado Condicional (Dentro del Modal)

El contenido del modal es dinámico y sigue un orden de prioridad estricto para asegurar que el usuario vea el estado correcto:

1.  **Si `loading` es `true`**: Se muestra el `<ActivityIndicator>`.
2.  **Si `error` no es `null` (y `loading` es `false`)**: Se muestra el mensaje de error.
3.  **Si `stats` no es `null` (y `loading` es `false`)**: Se muestra el contenedor de estadísticas con los datos (`stats.wins`, `stats.losses`, `stats.ratio`).

Esta lógica asegura que nunca se muestren los datos y el spinner al mismo tiempo, o un error y los datos juntos.