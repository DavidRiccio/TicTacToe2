# `PlayAgainButton.tsx` - Documentación de Props y Lógica

El componente `PlayAgainButton` es un botón (`TouchableOpacity`) reutilizable que muestra un texto diferente dependiendo del estado del juego. Su función es dual: permite "Rendirse" (surrender) durante el juego o "Jugar de nuevo" (play again) una vez que la partida ha finalizado.

## Propiedades (Props) Recibidas

`onPress` - `() => void`
**(Requerido)** Es la función *callback* que se ejecuta cuando el usuario presiona el botón. El componente padre (`Game.tsx`, por ejemplo) es el que define la acción, como reiniciar el tablero o volver al menú principal.

```typescript
// En el componente padre, se le pasa la función de reseteo
<PlayAgainButton
  onPress={handleResetGame}
  ...
/>
```

`gameFinished` - `boolean` (Opcional)
Un booleano que indica si la partida ha terminado.

  * Si es `true`, el texto del botón será "Jugar de nuevo".
  * Si es `false` (o se omite), el texto será "Rendirse".

Este componente asigna un **valor por defecto** de `false` a esta prop si no se proporciona.

```typescript
// Se establece un valor por defecto en la desestructuración de props
export function PlayAgainButton({ onPress, gameFinished = false }: PlayAgainButtonProps) {
  // ...
}
```

-----

## Variables Calculadas (en tiempo de render)

Este componente no usa `useState` o `useEffect`, pero calcula una variable clave en cada renderizado basándose en sus props.

`buttonText` - `string`
Esta variable almacena el texto que se mostrará dentro del botón. Su valor se determina usando un operador ternario que comprueba la prop `gameFinished`.

```typescript
// Lógica de decisión del texto
const buttonText = gameFinished ? 'Jugar de nuevo' : 'Rendirse';

// Se utiliza para renderizar el texto del botón
return (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{buttonText}</Text>
  </TouchableOpacity>
);
```