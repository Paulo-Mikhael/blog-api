export type FieldParams<T> = {
  field: keyof T; // Garante que o valor recebido é uma chave do objeto
  value: unknown;
};
