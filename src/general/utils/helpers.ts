export const formatGreeting = (base: string, name?: string) => {
  if (!name) return base;
  return `${base} ${name}`;
};
