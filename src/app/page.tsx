'use client';
import { useEffect, useState } from 'react';
import { Employee, Role, api } from '@/lib/api';
import EmployeeCard from '@/components/EmployeeCard';
import EmployeeForm from '@/components/EmployeeForm';
import Modal from '@/components/Modal';

const ROLES: { value: Role | ''; label: string }[] = [
  { value: '', label: 'All Employees' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'ENGINEER', label: 'Engineer' },
  { value: 'ADMIN', label: 'Admin' },
];

const ROLE_COLORS: Record<string, string> = {
  INTERN: '#6ee7b7',
  ENGINEER: '#93c5fd',
  ADMIN: '#c9a84c',
};

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | undefined>();

  const fetchEmployees = async (role?: Role | '') => {
    setLoading(true);
      try {
    const data = await api.getAll((role || undefined) as Role | undefined);
    setEmployees(Array.isArray(data) ? data : []);
  } catch {
    setEmployees([]);
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => { fetchEmployees(roleFilter); }, [roleFilter]);

  const handleSuccess = () => {
    setShowModal(false);
    setRoleFilter('');
    fetchEmployees('');
  };

  const counts = {
    total: employees.length,
    INTERN: employees.filter(e => e.role === 'INTERN').length,
    ENGINEER: employees.filter(e => e.role === 'ENGINEER').length,
    ADMIN: employees.filter(e => e.role === 'ADMIN').length,
  };

  const pageTitle = roleFilter === '' ? 'All Employees' : `${roleFilter.charAt(0) + roleFilter.slice(1).toLowerCase()}s`;

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">Employee<br /><span>Portal</span></div>
        <div className="sidebar-subtitle">Team Management</div>

        {/* Stats */}
        <div className="sidebar-section-label">Overview</div>
        <div className="stats-box">
          <div className="stats-total">{counts.total}</div>
          <div className="stats-total-label">Total Employees</div>
          {(['INTERN', 'ENGINEER', 'ADMIN'] as Role[]).map(r => (
            <div className="stats-row" key={r}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="stats-dot" style={{ background: ROLE_COLORS[r] }} />
                <span className="stats-role-name">{r}</span>
              </div>
              <span className="stats-role-count">{counts[r]}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="sidebar-section-label">Filter by Role</div>
        {ROLES.map(r => (
          <button
            key={r.value}
            className={`filter-btn ${roleFilter === r.value ? 'active' : ''}`}
            onClick={() => setRoleFilter(r.value)}
          >
            {r.label}
          </button>
        ))}

        <button
          className="add-btn"
          onClick={() => { setEditEmployee(undefined); setShowModal(true); }}
        >
          + Add Employee
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        <h1 className="page-title">{pageTitle}</h1>
        <p className="page-subtitle">
          {loading ? 'Loading...' : `${employees.length} ${employees.length === 1 ? 'person' : 'people'}`}
        </p>

        {loading ? (
          <div className="cards-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" />)}
          </div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <p style={{ fontSize: '0.9rem' }}>No employees found</p>
          </div>
        ) : (
          <div className="cards-grid">
            {employees.map(emp => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onEdit={e => { setEditEmployee(e); setShowModal(true); }}
                onDelete={() => fetchEmployees(roleFilter)}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <Modal
          title={editEmployee ? 'Edit Employee' : 'New Employee'}
          onClose={() => setShowModal(false)}
        >
          <EmployeeForm
            employee={editEmployee}
            onSuccess={handleSuccess}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}