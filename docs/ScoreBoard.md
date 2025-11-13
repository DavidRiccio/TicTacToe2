# `ScoreBoard.tsx` - Documentación de Props y Lógica

El componente `ScoreBoard` muestra las puntuaciones de 'X' y 'O'. Su característica principal es que tiene **dos modos de visualización** (grande o compacto) que se controlan mediante una prop.

## Propiedades (Props) Recibidas

`scores` - `Score` ( `{ x: number, o: number }` )
**(Requerido)** Un objeto que contiene el número de victorias para el jugador 'X' y el jugador 'O'. El componente usa estos valores para mostrarlos en la UI.

```typescript
// Accede a las puntuaciones para mostrarlas
<Text style={styles.scoreCardValue}>{scores.x}</Text>
// ...
<Text style={styles.scoreCardValue}>{scores.o}</Text>
```

`small` - `boolean` (Opcional)
Una bandera booleana que cambia drásticamente el renderizado del componente.

  * Si `small` es `true`, renderiza una versión compacta (ej. "X 1 vs O 0").
  * Si `small` es `false` o `undefined`, renderiza la versión grande por defecto, con dos tarjetas separadas.

<!-- end list -->

```typescript
// Esta prop controla la lógica principal del componente
export function ScoreBoard({ scores, small }: ScoreBoardProps) {
  if (small) {
    // Renderiza la versión compacta
  }

  // Renderiza la versión grande (por defecto)
}
```

-----

## Lógica Interna y Flujo de Renderizado

Este componente no tiene estado interno (`useState`). Su única lógica es una **bifurcación condicional (if-else)** basada en la prop `small`. Un solo componente devuelve uno de dos bloques JSX completamente diferentes.

### Flujo 1: Versión Compacta (`small = true`)

Si la prop `small` se pasa como `true`, el componente renderiza un `View` simple con el estilo `styles.scoreCompact`.

```typescript
if (small) {
  return (
    <View style={styles.scoreCompact}>
      <View style={styles.scoreCompactItem}>
        <Text style={styles.scoreCompactLabel}>X</Text>
        <Text style={styles.scoreCompactValue}>{scores.x}</Text>
      </View>
      <Text style={styles.scoreCompactDivider}>vs</Text>
      <View style={styles.scoreCompactItem}>
        <Text style={styles.scoreCompactLabel}>O</Text>
        <Text style={styles.scoreCompactValue}>{scores.o}</Text>
      </View>
    </View>
  );
}
```

### Flujo 2: Versión Grande (Por defecto, `small = false`)

Si la prop `small` es `false` o no se proporciona, el componente renderiza la vista de tarjetas grande por defecto.

```typescript
// Este es el 'else' implícito
return (
  <View style={styles.scoreBoard}>
    {/* Tarjeta para X */}
    <View style={styles.scoreCard}>
      <Text style={styles.scoreCardLabel}>Jugador X</Text>
      <Text style={styles.scoreCardValue}>{scores.x}</Text>
    </View>
    
    {/* Divisor visual */}
    <View style={styles.scoreDivider} />
    
    {/* Tarjeta para O */}
    <View style={styles.scoreCard}>
      <Text style={styles.scoreCardLabel}>Jugador O</Text>
      <Text style={styles.scoreCardValue}>{scores.o}</Text>
    </View>
  </View>
);
```