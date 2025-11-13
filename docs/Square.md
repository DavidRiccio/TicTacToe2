

# `Square.tsx` - Documentación de Props y Lógica

El componente `Square` es la unidad fundamental del tablero. Es, literalmente, la "casilla" en la que se puede hacer clic. Es un componente `TouchableOpacity` que muestra un valor (`'X'` o `'O'`) y puede cambiar su apariencia si forma parte de una línea ganadora.

## Propiedades (Props) Recibidas

`value` - `string`
**(Requerido)** El contenido textual a mostrar dentro de la casilla. Típicamente será `'X'`, `'O'`, o un string vacío (`''`).

```typescript
<Text style={[styles.text, { fontSize }]}>{value}</Text>
```

`onPress` - `() => void`
**(Requerido)** La función *callback* que se ejecuta cuando el usuario presiona la casilla.

```typescript
<TouchableOpacity
  onPress={onPress}
  ...
/>
```

`size` - `number`
**(Requerido)** El valor numérico para el `width` (ancho) y `height` (alto) de la casilla. Esto asegura que sea un cuadrado perfecto.

```typescript
<TouchableOpacity
  style={[styles.square, { width: size, height: size }, ...]}
  ...
/>
```

`fontSize` - `number`
**(Requerido)** El tamaño de la fuente para el `value` ('X' o 'O').

```typescript
<Text style={[styles.text, { fontSize }]}>{value}</Text>
```

`isWinning` - `boolean` (Opcional)
Una bandera booleana que indica si esta casilla específica es parte de la línea ganadora. Si es `true`, se aplicará un estilo visual diferente (fondo verde).

```typescript
<TouchableOpacity
  style={[..., isWinning && styles.winning]}
  ...
/>
```

-----

## Lógica Interna y Flujo de Renderizado

Este componente no tiene estado interno (`useState` o `useEffect`). Su "lógica" principal reside en cómo **combina dinámicamente los estilos** basándose en las props recibidas.

### Lógica de Estilos del `TouchableOpacity`

El estilo del `TouchableOpacity` (la casilla en sí) se construye usando un **array de estilos**. React Native los fusiona de izquierda a derecha.

```typescript
style={[
  styles.square,
  { width: size, height: size },
  isWinning && styles.winning
]}
```

1.  **`styles.square`**: Es el estilo base. Define el fondo blanco, el borde gris, el centrado, etc.
2.  **`{ width: size, height: size }`**: Es un objeto de estilo "en línea" (inline). Toma la prop `size` y la aplica al `width` y `height`, haciendo que la casilla sea responsiva al tamaño que le pasa el `Board`.
3.  **`isWinning && styles.winning`**: Es un **cortocircuito lógico** para estilos condicionales.
      * Si `isWinning` es `true`, la expresión se resuelve como `styles.winning` (el objeto de estilo verde), que se añade al array y se fusiona, sobrescribiendo el fondo y el borde.
      * Si `isWinning` es `false`, la expresión se resuelve como `false`, y React Native lo ignora por completo. No se añade ningún estilo extra.

### Lógica de Estilos del `Text`

El componente `Text` interno usa la misma técnica de array de estilos para aplicar el tamaño de fuente dinámico.

```typescript
style={[
  styles.text,
  { fontSize }
]}
```

1.  **`styles.text`**: El estilo base para el texto (color, `fontWeight`).
2.  **`{ fontSize }`**: El objeto de estilo en línea (es una abreviatura de `{ fontSize: fontSize }`) que aplica la prop `fontSize`.