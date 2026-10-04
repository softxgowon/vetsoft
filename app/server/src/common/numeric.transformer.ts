import { ValueTransformer } from 'typeorm';

// postgres отдает numeric строкой, поэтому приводим к числу
export const numericTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value === null || value === undefined ? null : parseFloat(value)),
};
