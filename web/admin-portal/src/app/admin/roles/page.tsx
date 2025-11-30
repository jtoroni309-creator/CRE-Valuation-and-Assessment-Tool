'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

// Permission categories and their permissions
const permissionCategories = [
  {
    id: 'properties',
    name: 'Properties',
    description: 'Property management permissions',
    permissions: [
      { id: 'properties.view', name: 'View Properties', description: 'View property details and data' },
      { id: 'properties.create', name: 'Create Properties', description: 'Add new properties to the system' },
      { id: 'properties.edit', name: 'Edit Properties', description: 'Modify property information' },
      { id: 'properties.delete', name: 'Delete Properties', description: 'Remove properties from the system' },
    ],
  },
  {
    id: 'valuations',
    name: 'Valuations',
    description: 'Valuation workflow permissions',
    permissions: [
      { id: 'valuations.view', name: 'View Valuations', description: 'View valuation reports and data' },
      { id: 'valuations.create', name: 'Create Valuations', description: 'Initiate new valuations' },
      { id: 'valuations.approve', name: 'Approve Valuations', description: 'Review and approve valuations' },
      { id: 'valuations.ai', name: 'Use AI Features', description: 'Access AI-powered valuation tools' },
    ],
  },
  {
    id: 'assessments',
    name: 'Assessments',
    description: 'Tax assessment permissions',
    permissions: [
      { id: 'assessments.view', name: 'View Assessments', description: 'View assessment data' },
      { id: 'assessments.create', name: 'Create Assessments', description: 'Generate new assessments' },
      { id: 'assessments.finalize', name: 'Finalize Assessments', description: 'Lock and finalize assessments' },
      { id: 'assessments.bulk', name: 'Bulk Operations', description: 'Perform mass assessment operations' },
    ],
  },
  {
    id: 'appeals',
    name: 'Appeals',
    description: 'Appeal management permissions',
    permissions: [
      { id: 'appeals.view', name: 'View Appeals', description: 'View appeal cases' },
      { id: 'appeals.create', name: 'Create Appeals', description: 'File new appeals' },
      { id: 'appeals.review', name: 'Review Appeals', description: 'Review and process appeals' },
      { id: 'appeals.resolve', name: 'Resolve Appeals', description: 'Make final appeal decisions' },
    ],
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Reporting permissions',
    permissions: [
      { id: 'reports.view', name: 'View Reports', description: 'Access generated reports' },
      { id: 'reports.create', name: 'Generate Reports', description: 'Create new reports' },
      { id: 'reports.export', name: 'Export Reports', description: 'Download and export reports' },
      { id: 'reports.schedule', name: 'Schedule Reports', description: 'Set up automated report generation' },
    ],
  },
  {
    id: 'admin',
    name: 'Administration',
    description: 'System administration permissions',
    permissions: [
      { id: 'admin.users', name: 'Manage Users', description: 'Add, edit, and remove users' },
      { id: 'admin.roles', name: 'Manage Roles', description: 'Create and modify roles' },
      { id: 'admin.settings', name: 'System Settings', description: 'Configure system settings' },
      { id: 'admin.billing', name: 'Billing & Subscription', description: 'Manage billing and subscriptions' },
      { id: 'admin.audit', name: 'View Audit Logs', description: 'Access audit trail' },
      { id: 'admin.api', name: 'Manage API Keys', description: 'Create and manage API keys' },
    ],
  },
];

// Predefined roles with their permissions
const mockRoles = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    color: 'destructive',
    userCount: 2,
    isSystem: true,
    permissions: permissionCategories.flatMap(c => c.permissions.map(p => p.id)),
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Team management and approval capabilities',
    color: 'warning',
    userCount: 5,
    isSystem: true,
    permissions: [
      'properties.view', 'properties.create', 'properties.edit',
      'valuations.view', 'valuations.create', 'valuations.approve', 'valuations.ai',
      'assessments.view', 'assessments.create',
      'appeals.view', 'appeals.create', 'appeals.review',
      'reports.view', 'reports.create', 'reports.export',
      'admin.users',
    ],
  },
  {
    id: 'appraiser',
    name: 'Appraiser',
    description: 'Valuation and assessment operations',
    color: 'primary',
    userCount: 15,
    isSystem: true,
    permissions: [
      'properties.view', 'properties.create', 'properties.edit',
      'valuations.view', 'valuations.create', 'valuations.ai',
      'assessments.view', 'assessments.create',
      'appeals.view', 'appeals.create',
      'reports.view', 'reports.create',
    ],
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Data analysis and reporting',
    color: 'secondary',
    userCount: 8,
    isSystem: true,
    permissions: [
      'properties.view',
      'valuations.view',
      'assessments.view',
      'appeals.view',
      'reports.view', 'reports.create', 'reports.export',
    ],
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to data',
    color: 'ghost',
    userCount: 12,
    isSystem: true,
    permissions: [
      'properties.view',
      'valuations.view',
      'assessments.view',
      'appeals.view',
      'reports.view',
    ],
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(mockRoles);
  const [selectedRole, setSelectedRole] = useState<typeof mockRoles[0] | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { success, error } = useToast();

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const handleCreateRole = () => {
    if (!newRole.name) {
      error('Missing Information', 'Please enter a role name');
      return;
    }
    const role = {
      id: newRole.name.toLowerCase().replace(/\s+/g, '-'),
      ...newRole,
      color: 'secondary',
      userCount: 0,
      isSystem: false,
    };
    setRoles([...roles, role]);
    success('Role Created', `"${newRole.name}" role has been created`);
    setCreateModal(false);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  const handleUpdatePermissions = () => {
    if (selectedRole) {
      success('Permissions Updated', `Permissions for "${selectedRole.name}" have been saved`);
      setEditMode(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    if (editMode && selectedRole) {
      const hasPermission = selectedRole.permissions.includes(permissionId);
      const newPermissions = hasPermission
        ? selectedRole.permissions.filter(p => p !== permissionId)
        : [...selectedRole.permissions, permissionId];
      setSelectedRole({ ...selectedRole, permissions: newPermissions });
    } else if (createModal) {
      const hasPermission = newRole.permissions.includes(permissionId);
      setNewRole({
        ...newRole,
        permissions: hasPermission
          ? newRole.permissions.filter(p => p !== permissionId)
          : [...newRole.permissions, permissionId],
      });
    }
  };

  const toggleAllInCategory = (categoryId: string) => {
    const category = permissionCategories.find(c => c.id === categoryId);
    if (!category) return;

    const categoryPermissionIds = category.permissions.map(p => p.id);
    const target = editMode && selectedRole ? selectedRole : newRole;
    const allSelected = categoryPermissionIds.every(id => target.permissions.includes(id));

    if (editMode && selectedRole) {
      const newPermissions = allSelected
        ? selectedRole.permissions.filter(p => !categoryPermissionIds.includes(p))
        : [...new Set([...selectedRole.permissions, ...categoryPermissionIds])];
      setSelectedRole({ ...selectedRole, permissions: newPermissions });
    } else if (createModal) {
      const newPermissions = allSelected
        ? newRole.permissions.filter(p => !categoryPermissionIds.includes(p))
        : [...new Set([...newRole.permissions, ...categoryPermissionIds])];
      setNewRole({ ...newRole, permissions: newPermissions });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Define access levels and permissions for your organization
          </p>
        </div>
        <Button onClick={() => setCreateModal(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
          Create Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            variant="elevated"
            padding="lg"
            className={`cursor-pointer transition-all ${selectedRole?.id === role.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => { setSelectedRole(role); setEditMode(false); }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{role.name}</h3>
                  {role.isSystem && (
                    <Badge variant="ghost" size="sm">System</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              </div>
              <Badge variant={role.color as any}>{role.userCount} users</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {role.permissions.length} permissions
              </span>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Role Details Panel */}
      {selectedRole && (
        <Card variant="elevated" padding="none">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{selectedRole.name}</h2>
                  <Badge variant={selectedRole.color as any}>{selectedRole.userCount} users</Badge>
                  {selectedRole.isSystem && (
                    <Badge variant="ghost" size="sm">System Role</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{selectedRole.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <Button variant="ghost" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdatePermissions}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(true)}
                    disabled={selectedRole.isSystem && selectedRole.id === 'admin'}
                  >
                    Edit Permissions
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-6">
              {permissionCategories.map((category) => {
                const categoryPermissions = category.permissions.map(p => p.id);
                const selectedCount = categoryPermissions.filter(id => selectedRole.permissions.includes(id)).length;
                const allSelected = selectedCount === categoryPermissions.length;

                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      {editMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAllInCategory(category.id)}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.permissions.map((permission) => {
                        const hasPermission = selectedRole.permissions.includes(permission.id);
                        return (
                          <div
                            key={permission.id}
                            className={`
                              flex items-center gap-3 p-3 rounded-lg border transition-colors
                              ${hasPermission ? 'border-primary/50 bg-primary/5' : 'border-border'}
                              ${editMode ? 'cursor-pointer hover:border-primary' : ''}
                            `}
                            onClick={() => editMode && togglePermission(permission.id)}
                          >
                            <div className={`
                              h-5 w-5 rounded flex items-center justify-center shrink-0
                              ${hasPermission ? 'bg-primary text-primary-foreground' : 'border-2 border-muted'}
                            `}>
                              {hasPermission && <CheckIcon className="h-3 w-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{permission.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{permission.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Create Role Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} size="xl">
        <ModalHeader>
          <ModalTitle>Create New Role</ModalTitle>
          <ModalDescription>
            Define a custom role with specific permissions
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Role Name"
                placeholder="e.g., Senior Appraiser"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
              <Input
                label="Description"
                placeholder="Brief description of this role"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium mb-4">Assign Permissions</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {permissionCategories.map((category) => {
                  const categoryPermissions = category.permissions.map(p => p.id);
                  const selectedCount = categoryPermissions.filter(id => newRole.permissions.includes(id)).length;
                  const allSelected = selectedCount === categoryPermissions.length;

                  return (
                    <div key={category.id} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{category.name}</h5>
                          <Badge variant="ghost" size="sm">{selectedCount}/{categoryPermissions.length}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAllInCategory(category.id)}
                        >
                          {allSelected ? 'None' : 'All'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {category.permissions.map((permission) => {
                          const hasPermission = newRole.permissions.includes(permission.id);
                          return (
                            <div
                              key={permission.id}
                              className={`
                                flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                                ${hasPermission ? 'bg-primary/10' : 'hover:bg-muted'}
                              `}
                              onClick={() => togglePermission(permission.id)}
                            >
                              <div className={`
                                h-4 w-4 rounded flex items-center justify-center shrink-0
                                ${hasPermission ? 'bg-primary text-primary-foreground' : 'border border-muted-foreground'}
                              `}>
                                {hasPermission && <CheckIcon className="h-2.5 w-2.5" />}
                              </div>
                              <span className="text-sm">{permission.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setCreateModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateRole}>
            Create Role
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
