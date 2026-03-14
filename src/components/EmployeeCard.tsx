'use client';
import { Employee, api } from '@/lib/api';

interface Props {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: () => void;
}

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  INTERN:   { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  ENGINEER: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  ADMIN:    { bg: '#fefce8', text: '#b45309', border: '#fde68a' },
};

const AVATAR_COLORS: Record<string, { bg: string; color: string }> = {
  INTERN:   { bg: '#dcfce7', color: '#16a34a' },
  ENGINEER: { bg: '#dbeafe', color: '#2563eb' },
  ADMIN:    { bg: '#fef9c3', color: '#b45309' },
};

export default function EmployeeCard({ employee, onEdit, onDelete }: Props) {
  const initials = employee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const badge = ROLE_COLORS[employee.role];
  const avatar = AVATAR_COLORS[employee.role];

  const handleDelete = async () => {
    if (!confirm(`Delete ${employee.name}?`)) return;
    try {
      await api.delete(employee.id!);
      onDelete();
    } catch {
      alert('Failed to delete.');
    }
  };

  return (
    <div className="employee-card">
      <div className="card-top">
        <div className="card-avatar" style={{ background: avatar.bg, color: avatar.color }}>
          {initials}
        </div>
        <div className="card-info">
          <div className="card-name">{employee.name}</div>
          <div className="card-email">{employee.email}</div>
        </div>
        <div
          className="card-badge"
          style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}
        >
          {employee.role}
        </div>
      </div>
      <div className="card-divider" />
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(employee)}>Edit</button>
        <button className="btn-delete" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
