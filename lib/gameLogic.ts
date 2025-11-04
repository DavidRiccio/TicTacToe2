export function calculateWinner(squares: string[], size: number): string | null {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - size; col++) {
      const firstIndex = row * size + col;
      const first = squares[firstIndex];
      if (!first) continue;

      let isWinning = true;
      for (let i = 1; i < size; i++) {
        if (squares[firstIndex + i] !== first) {
          isWinning = false;
          break;
        }
      }
      if (isWinning) return first;
    }
  }

  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - size; row++) {
      const firstIndex = row * size + col;
      const first = squares[firstIndex];
      if (!first) continue;

      let isWinning = true;
      for (let i = 1; i < size; i++) {
        if (squares[(row + i) * size + col] !== first) {
          isWinning = false;
          break;
        }
      }
      if (isWinning) return first;
    }
  }

  for (let startRow = 0; startRow <= size - size; startRow++) {
    for (let startCol = 0; startCol <= size - size; startCol++) {
      const firstIndex = startRow * size + startCol;
      const first = squares[firstIndex];
      if (!first) continue;

      let isWinning = true;
      for (let i = 1; i < size; i++) {
        if (squares[(startRow + i) * size + (startCol + i)] !== first) {
          isWinning = false;
          break;
        }
      }
      if (isWinning) return first;
    }
  }

  for (let startRow = size - 1; startRow >= size - 1; startRow--) {
    for (let startCol = 0; startCol <= size - size; startCol++) {
      const firstIndex = startRow * size + startCol;
      const first = squares[firstIndex];
      if (!first) continue;

      let isWinning = true;
      for (let i = 1; i < size; i++) {
        const newRow = startRow - i;
        const newCol = startCol + i;
        if (newRow < 0 || newCol >= size) {
          isWinning = false;
          break;
        }
        if (squares[newRow * size + newCol] !== first) {
          isWinning = false;
          break;
        }
      }
      if (isWinning) return first;
    }
  }

  return null;
}

export function getWinningLine(squares: string[], size: number): number[] | null {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - size; col++) {
      const firstIndex = row * size + col;
      const first = squares[firstIndex];
      if (!first) continue;

      const indices: number[] = [firstIndex];
      let isWinning = true;

      for (let i = 1; i < size; i++) {
        indices.push(firstIndex + i);
        if (squares[firstIndex + i] !== first) {
          isWinning = false;
          break;
        }
      }
      if (isWinning) return indices;
    }
  }

  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - size; row++) {
      const firstIndex = row * size + col;
      const first = squares[firstIndex];
      if (!first) continue;

      const indices: number[] = [firstIndex];
      let isWinning = true;

      for (let i = 1; i < size; i++) {
        const index = (row + i) * size + col;
        indices.push(index);
        if (squares[index] !== first) {
          isWinning = false;
          break;
        }
      }
      if (isWinning) return indices;
    }
  }

  for (let startRow = 0; startRow <= size - size; startRow++) {
    for (let startCol = 0; startCol <= size - size; startCol++) {
      const firstIndex = startRow * size + startCol;
      const first = squares[firstIndex];
      if (!first) continue;

      const indices: number[] = [firstIndex];
      let isWinning = true;

      for (let i = 1; i < size; i++) {
        const index = (startRow + i) * size + (startCol + i);
        indices.push(index);
        if (squares[index] !== first) {
          isWinning = false;
          break;
        }
      }
      if (isWinning) return indices;
    }
  }

  for (let startRow = size - 1; startRow >= size - 1; startRow--) {
    for (let startCol = 0; startCol <= size - size; startCol++) {
      const firstIndex = startRow * size + startCol;
      const first = squares[firstIndex];
      if (!first) continue;

      const indices: number[] = [firstIndex];
      let isWinning = true;

      for (let i = 1; i < size; i++) {
        const newRow = startRow - i;
        const newCol = startCol + i;
        if (newRow < 0 || newCol >= size) {
          isWinning = false;
          break;
        }
        const index = newRow * size + newCol;
        indices.push(index);
        if (squares[index] !== first) {
          isWinning = false;
          break;
        }
      }
      if (isWinning) return indices;
    }
  }

  return null;
}
