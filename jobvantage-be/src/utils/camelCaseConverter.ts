// Utility function to convert snake_case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

export const convertKeysToCamelCase = <T>(input: Record<string, any>): T => {
  const output: Record<string, any> = {};

  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const camelCaseKey = toCamelCase(key);
      output[camelCaseKey] = input[key];
    }
  }

  return output as T;
};
