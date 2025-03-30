export function getDifferences(oldValue: Record<string, unknown>, newValue: Record<string, unknown>): {
  oldValue: Record<string, unknown>,
  newValue: Record<string, unknown>
}{
  for (const key in newValue) {
    if (oldValue[key] === newValue[key]) {
      oldValue[key] = undefined;
      newValue[key] = undefined;
    }
  }

  return {
    oldValue: oldValue,
    newValue: newValue
  };
}