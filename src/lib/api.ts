const BASE_URL = 'https://employee-api-v2.azurewebsites.net';

export type Role = 'INTERN' | 'ENGINEER' | 'ADMIN';

export interface Employee {
  id?: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export const api = {
  getAll: async (role?: Role): Promise<Employee[]> => {
    const url = role ? `${BASE_URL}/employees?role=${role}` : `${BASE_URL}/employees`;
    const res = await fetch(url, { cache: 'no-store' });
    return res.json();
  },

  create: async (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/employees/${id}`, { method: 'DELETE' });
  },
};