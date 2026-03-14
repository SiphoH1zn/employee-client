'use client';
import { useState } from 'react';
import { Employee, Role, api } from '@/lib/api';

interface Props {
  employee?: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EmployeeForm({ employee, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(employee?.name || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [role, setRole] = useState<Role>(employee?.role || 'INTERN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (employee?.id) {
        await api.update(employee.id, { name, email, role });
      } else {
        await api.create({ name, email, role });
      }
      onSuccess();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
          className="form-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="e.g. John Doe"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="e.g. john@company.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Role</label>
        <select
          className="form-input"
          value={role}
          onChange={e => setRole(e.target.value as Role)}
        >
          <option value="INTERN">Intern</option>
          <option value="ENGINEER">Engineer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}