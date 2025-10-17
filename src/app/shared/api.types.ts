
export type ApiResponse<T> = { error: boolean; message?: string; data: T };
export type Role = 'PACIENTE' | 'MEDICO' | 'ADMIN';
