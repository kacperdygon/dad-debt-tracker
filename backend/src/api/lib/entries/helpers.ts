export function getDifferences(oldValue: Record<string, any>, newValue: Record<string, any>): {
  oldValue: Record<string, any>,
  newValue: Record<string, any>
}{
  const differences: Record<string, { oldValue: Record<string, any>; newValue: Record<string, any> }> = {};

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