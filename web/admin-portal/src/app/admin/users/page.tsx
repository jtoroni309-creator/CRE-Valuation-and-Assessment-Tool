'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from '@/components/ui/Table';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';

// User roles with permissions
const roles = [
  { id: 'admin', name: 'Administrator', description: 'Full system access', color: 'destructive' },
  { id: 'manager', name: 'Manager', description: 'Team and project management', color: 'warning' },
  { id: 'appraiser', name: 'Appraiser', description: 'Valuation and assessment access', color: 'primary' },
  { id: 'analyst', name: 'Analyst', description: 'Read and analyze data', color: 'secondary' },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access', color: 'ghost' },
];

// Mock users data
const mockUsers = [
  {
    id: 'USR-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    status: 'active',
    department: 'Executive',
    lastActive: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-01T00:00:00Z',
    avatar: null,
    mfaEnabled: true,
    properties: 245,
  },
  {
    id: 'USR-002',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'manager',
    status: 'active',
    department: 'Valuations',
    lastActive: '2024-01-15T09:45:00Z',
    createdAt: '2023-07-15T00:00:00Z',
    avatar: null,
    mfaEnabled: true,
    properties: 128,
  },
  {
    id: 'USR-003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'appraiser',
    status: 'active',
    department: 'Valuations',
    lastActive: '2024-01-15T08:20:00Z',
    createdAt: '2023-08-20T00:00:00Z',
    avatar: null,
    mfaEnabled: false,
    properties: 89,
  },
  {
    id: 'USR-004',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'analyst',
    status: 'inactive',
    department: 'Research',
    lastActive: '2024-01-10T14:00:00Z',
    createdAt: '2023-09-10T00:00:00Z',
    avatar: null,
    mfaEnabled: false,
    properties: 45,
  },
  {
    id: 'USR-005',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    role: 'appraiser',
    status: 'pending',
    department: 'Assessments',
    lastActive: null,
    createdAt: '2024-01-14T00:00:00Z',
    avatar: null,
    mfaEnabled: false,
    properties: 0,
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { success, error } = useToast();

  // Form state for inviting users
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: '',
    department: '',
  });

  const handleInviteUser = () => {
    if (!inviteForm.email || !inviteForm.role) {
      error('Missing Information', 'Please fill in all required fields');
      return;
    }
    success('Invitation Sent', `Invitation email sent to ${inviteForm.email}`);
    setInviteModal(false);
    setInviteForm({ email: '', name: '', role: '', department: '' });
  };

  const handleUpdateUser = () => {
    success('User Updated', 'User information has been updated successfully');
    setEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      success('User Removed', 'User has been removed from the system');
    }
    setDeleteModal(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (user: typeof mockUsers[0]) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    success('Status Updated', `User is now ${newStatus}`);
  };

  const getRoleBadge = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? (
      <Badge variant={role.color as any}>{role.name}</Badge>
    ) : (
      <Badge variant="ghost">Unknown</Badge>
    );
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and access permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<DownloadIcon className="h-4 w-4" />}>
            Export Users
          </Button>
          <Button onClick={() => setInviteModal(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
            Invite User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          change={{ value: 3, label: 'this month' }}
          trend="up"
          icon={<UsersIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Active Users"
          value={activeUsers.toString()}
          change={{ value: 2 }}
          trend="up"
          icon={<UserCheckIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Invites"
          value={pendingUsers.toString()}
          icon={<UserPlusIcon className="h-5 w-5" />}
        />
        <StatCard
          title="MFA Enabled"
          value={`${Math.round((users.filter(u => u.mfaEnabled).length / users.length) * 100)}%`}
          change={{ value: 15, label: 'adoption' }}
          trend="up"
          icon={<ShieldIcon className="h-5 w-5" />}
        />
      </div>

      {/* Users Table */}
      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold">All Users</h2>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search users..."
                className="w-64"
                leftIcon={<SearchIcon className="h-4 w-4" />}
              />
              <Select
                options={[
                  { value: 'all', label: 'All Roles' },
                  ...roles.map(r => ({ value: r.id, label: r.name })),
                ]}
                placeholder="Role"
                className="w-36"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'pending', label: 'Pending' },
                ]}
                placeholder="Status"
                className="w-32"
              />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>MFA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <span className="font-medium">{user.properties}</span>
                  <span className="text-muted-foreground text-xs ml-1">assigned</span>
                </TableCell>
                <TableCell>
                  {user.mfaEnabled ? (
                    <Badge variant="success" size="sm">Enabled</Badge>
                  ) : (
                    <Badge variant="ghost" size="sm">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'inactive'}
                    label={user.status}
                  />
                </TableCell>
                <TableCell>
                  {user.lastActive ? (
                    <span className="text-sm text-muted-foreground">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Never</span>
                  )}
                </TableCell>
                <TableCell>
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="icon-sm">
                        <DotsIcon className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownItem
                      icon={<EyeIcon className="h-4 w-4" />}
                      onClick={() => setSelectedUser(user)}
                    >
                      View Details
                    </DropdownItem>
                    <DropdownItem
                      icon={<EditIcon className="h-4 w-4" />}
                      onClick={() => { setSelectedUser(user); setEditModal(true); }}
                    >
                      Edit User
                    </DropdownItem>
                    <DropdownItem
                      icon={user.status === 'active' ? <UserMinusIcon className="h-4 w-4" /> : <UserCheckIcon className="h-4 w-4" />}
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </DropdownItem>
                    <DropdownItem
                      icon={<KeyIcon className="h-4 w-4" />}
                    >
                      Reset Password
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                      icon={<TrashIcon className="h-4 w-4" />}
                      destructive
                      onClick={() => { setSelectedUser(user); setDeleteModal(true); }}
                    >
                      Remove User
                    </DropdownItem>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
          totalItems={users.length}
          pageSize={10}
          onPageSizeChange={() => {}}
        />
      </Card>

      {/* Invite User Modal */}
      <Modal isOpen={inviteModal} onClose={() => setInviteModal(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Invite New User</ModalTitle>
          <ModalDescription>
            Send an invitation to add a new user to your organization
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@company.com"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              required
            />
            <Input
              label="Full Name"
              placeholder="Enter user's full name"
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Role"
                options={roles.map(r => ({ value: r.id, label: r.name }))}
                placeholder="Select role"
                value={inviteForm.role}
                onChange={(value) => setInviteForm({ ...inviteForm, role: value })}
              />
              <Select
                label="Department"
                options={[
                  { value: 'executive', label: 'Executive' },
                  { value: 'valuations', label: 'Valuations' },
                  { value: 'assessments', label: 'Assessments' },
                  { value: 'research', label: 'Research' },
                  { value: 'operations', label: 'Operations' },
                ]}
                placeholder="Select department"
                value={inviteForm.department}
                onChange={(value) => setInviteForm({ ...inviteForm, department: value })}
              />
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-medium mb-2">Role Permissions</h4>
              {inviteForm.role && (
                <div className="text-sm text-muted-foreground">
                  <p><strong>{roles.find(r => r.id === inviteForm.role)?.name}:</strong></p>
                  <p className="mt-1">{roles.find(r => r.id === inviteForm.role)?.description}</p>
                </div>
              )}
              {!inviteForm.role && (
                <p className="text-sm text-muted-foreground">Select a role to see permissions</p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setInviteModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleInviteUser} leftIcon={<MailIcon className="h-4 w-4" />}>
            Send Invitation
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelectedUser(null); }} size="lg">
        <ModalHeader>
          <ModalTitle>Edit User</ModalTitle>
          <ModalDescription>
            Update user information and permissions
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={selectedUser.name} size="lg" />
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  defaultValue={selectedUser.name}
                />
                <Input
                  label="Email Address"
                  type="email"
                  defaultValue={selectedUser.email}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Role"
                  options={roles.map(r => ({ value: r.id, label: r.name }))}
                  defaultValue={selectedUser.role}
                />
                <Select
                  label="Department"
                  options={[
                    { value: 'Executive', label: 'Executive' },
                    { value: 'Valuations', label: 'Valuations' },
                    { value: 'Assessments', label: 'Assessments' },
                    { value: 'Research', label: 'Research' },
                    { value: 'Operations', label: 'Operations' },
                  ]}
                  defaultValue={selectedUser.department}
                />
              </div>
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.mfaEnabled ? 'MFA is currently enabled' : 'MFA is not enabled'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {selectedUser.mfaEnabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setEditModal(false); setSelectedUser(null); }}>
            Cancel
          </Button>
          <Button onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelectedUser(null); }} size="sm">
        <ModalHeader>
          <ModalTitle>Remove User</ModalTitle>
          <ModalDescription>
            Are you sure you want to remove this user? This action cannot be undone.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          {selectedUser && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <Avatar name={selectedUser.name} size="sm" />
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setDeleteModal(false); setSelectedUser(null); }}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteUser}>
            Remove User
          </Button>
        </ModalFooter>
      </Modal>

      {/* User Details Drawer/Modal */}
      {selectedUser && !editModal && !deleteModal && (
        <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} size="lg">
          <ModalHeader>
            <ModalTitle>User Details</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar name={selectedUser.name} size="xl" />
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    <StatusBadge
                      status={selectedUser.status === 'active' ? 'success' : 'inactive'}
                      label={selectedUser.status}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card variant="filled" padding="md">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedUser.department}</p>
                </Card>
                <Card variant="filled" padding="md">
                  <p className="text-sm text-muted-foreground">Properties Assigned</p>
                  <p className="font-medium">{selectedUser.properties}</p>
                </Card>
                <Card variant="filled" padding="md">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </Card>
                <Card variant="filled" padding="md">
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-medium">
                    {selectedUser.lastActive
                      ? new Date(selectedUser.lastActive).toLocaleString()
                      : 'Never'}
                  </p>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-3">Security</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <ShieldIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Additional security layer</p>
                      </div>
                    </div>
                    <Badge variant={selectedUser.mfaEnabled ? 'success' : 'ghost'}>
                      {selectedUser.mfaEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
            <Button onClick={() => { setEditModal(true); }}>
              Edit User
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

// Icons
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function UserCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );
}

function UserMinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
