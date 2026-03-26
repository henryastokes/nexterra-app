import {
  UserPermission,
  Permission,
  PermissionCondition,
  UserRole,
  AuditEvent,
} from './types';

const generateId = () => `perm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export interface RoleDefinition {
  role: UserRole;
  displayName: string;
  description: string;
  permissions: Permission[];
  inheritsFrom?: UserRole[];
}

const DEFAULT_ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'admin',
    displayName: 'Administrator',
    description: 'Full access to all DAO operations',
    permissions: [
      { action: '*', resource: '*' },
    ],
  },
  {
    role: 'member',
    displayName: 'Member',
    description: 'Standard DAO member with voting rights',
    permissions: [
      { action: 'read', resource: 'proposal' },
      { action: 'vote', resource: 'proposal' },
      { action: 'read', resource: 'report' },
      { action: 'read', resource: 'ledger' },
    ],
  },
  {
    role: 'proposer',
    displayName: 'Proposer',
    description: 'Can create and manage proposals',
    permissions: [
      { action: 'create', resource: 'proposal' },
      { action: 'update', resource: 'proposal' },
      { action: 'submit', resource: 'proposal' },
    ],
    inheritsFrom: ['member'],
  },
  {
    role: 'voter',
    displayName: 'Voter',
    description: 'Can vote on proposals',
    permissions: [
      { action: 'vote', resource: 'proposal' },
      { action: 'delegate', resource: 'vote' },
    ],
    inheritsFrom: ['member'],
  },
  {
    role: 'funder',
    displayName: 'Funder',
    description: 'Can deposit funds and view financial data',
    permissions: [
      { action: 'deposit', resource: 'escrow' },
      { action: 'read', resource: 'treasury' },
      { action: 'read', resource: 'disbursement' },
    ],
    inheritsFrom: ['member'],
  },
  {
    role: 'auditor',
    displayName: 'Auditor',
    description: 'Read-only access to all data for auditing',
    permissions: [
      { action: 'read', resource: '*' },
      { action: 'export', resource: '*' },
    ],
  },
  {
    role: 'observer',
    displayName: 'Observer',
    description: 'Limited read-only access',
    permissions: [
      { action: 'read', resource: 'proposal' },
      { action: 'read', resource: 'report' },
    ],
  },
];

export class PermissionManager {
  private userPermissions: Map<string, UserPermission> = new Map();
  private roleDefinitions: Map<UserRole, RoleDefinition> = new Map();
  private daoId: string;

  constructor(daoId: string, customRoles?: RoleDefinition[]) {
    this.daoId = daoId;
    
    DEFAULT_ROLE_DEFINITIONS.forEach(def => {
      this.roleDefinitions.set(def.role, def);
    });

    if (customRoles) {
      customRoles.forEach(def => {
        this.roleDefinitions.set(def.role, def);
      });
    }

    console.log(`[PermissionManager] Initialized for DAO: ${daoId}`);
  }

  grantRole(params: {
    userId: string;
    userAddress: string;
    role: UserRole;
    grantedBy: string;
    expiresAt?: string;
    metadata?: Record<string, unknown>;
  }): UserPermission | null {
    const roleDefinition = this.roleDefinitions.get(params.role);
    if (!roleDefinition) {
      console.error(`[PermissionManager] Unknown role: ${params.role}`);
      return null;
    }

    const permissions = this.resolvePermissions(params.role);

    const permission: UserPermission = {
      userId: params.userId,
      userAddress: params.userAddress,
      role: params.role,
      permissions,
      grantedAt: new Date().toISOString(),
      grantedBy: params.grantedBy,
      expiresAt: params.expiresAt,
      isActive: true,
      metadata: params.metadata,
    };

    this.userPermissions.set(params.userAddress, permission);
    console.log(`[PermissionManager] Granted role ${params.role} to ${params.userId}`);
    return permission;
  }

  revokeRole(userAddress: string): boolean {
    const permission = this.userPermissions.get(userAddress);
    if (!permission) {
      console.error(`[PermissionManager] No permission found for: ${userAddress}`);
      return false;
    }

    permission.isActive = false;
    console.log(`[PermissionManager] Revoked role from ${userAddress}`);
    return true;
  }

  updateRole(userAddress: string, newRole: UserRole, updatedBy: string): UserPermission | null {
    const existing = this.userPermissions.get(userAddress);
    if (!existing) {
      console.error(`[PermissionManager] No permission found for: ${userAddress}`);
      return null;
    }

    const roleDefinition = this.roleDefinitions.get(newRole);
    if (!roleDefinition) {
      console.error(`[PermissionManager] Unknown role: ${newRole}`);
      return null;
    }

    existing.role = newRole;
    existing.permissions = this.resolvePermissions(newRole);
    existing.grantedBy = updatedBy;
    existing.grantedAt = new Date().toISOString();

    console.log(`[PermissionManager] Updated role for ${userAddress} to ${newRole}`);
    return existing;
  }

  private resolvePermissions(role: UserRole): Permission[] {
    const roleDefinition = this.roleDefinitions.get(role);
    if (!roleDefinition) return [];

    const permissions = [...roleDefinition.permissions];

    if (roleDefinition.inheritsFrom) {
      roleDefinition.inheritsFrom.forEach(inheritedRole => {
        const inheritedPerms = this.resolvePermissions(inheritedRole);
        inheritedPerms.forEach(perm => {
          if (!permissions.some(p => p.action === perm.action && p.resource === perm.resource)) {
            permissions.push(perm);
          }
        });
      });
    }

    return permissions;
  }

  checkPermission(userAddress: string, action: string, resource: string): boolean {
    const permission = this.userPermissions.get(userAddress);
    if (!permission || !permission.isActive) {
      return false;
    }

    if (permission.expiresAt && new Date(permission.expiresAt) < new Date()) {
      permission.isActive = false;
      return false;
    }

    return permission.permissions.some(p => {
      const actionMatch = p.action === '*' || p.action === action;
      const resourceMatch = p.resource === '*' || p.resource === resource;

      if (!actionMatch || !resourceMatch) return false;

      if (p.conditions) {
        return this.evaluateConditions(p.conditions, { action, resource });
      }

      return true;
    });
  }

  private evaluateConditions(
    conditions: PermissionCondition[],
    context: Record<string, unknown>
  ): boolean {
    return conditions.every(condition => {
      const fieldValue = context[condition.field];

      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        default:
          return false;
      }
    });
  }

  getUserPermission(userAddress: string): UserPermission | null {
    return this.userPermissions.get(userAddress) || null;
  }

  getUsersByRole(role: UserRole): UserPermission[] {
    return Array.from(this.userPermissions.values()).filter(
      p => p.role === role && p.isActive
    );
  }

  getAllUsers(): UserPermission[] {
    return Array.from(this.userPermissions.values());
  }

  getActiveUsers(): UserPermission[] {
    return Array.from(this.userPermissions.values()).filter(p => p.isActive);
  }

  getRoleDefinition(role: UserRole): RoleDefinition | null {
    return this.roleDefinitions.get(role) || null;
  }

  getAllRoles(): RoleDefinition[] {
    return Array.from(this.roleDefinitions.values());
  }

  addCustomRole(definition: RoleDefinition): void {
    this.roleDefinitions.set(definition.role, definition);
    console.log(`[PermissionManager] Added custom role: ${definition.role}`);
  }

  generateAuditEvent(
    userAddress: string,
    action: 'granted' | 'revoked' | 'updated',
    actor: string
  ): AuditEvent | null {
    const permission = this.userPermissions.get(userAddress);
    
    return {
      id: `audit-${Date.now()}`,
      daoId: this.daoId,
      type: action === 'granted' ? 'permission_granted' : 
            action === 'revoked' ? 'permission_revoked' : 'role_changed',
      actor,
      actorAddress: '',
      actorRole: 'admin',
      timestamp: new Date().toISOString(),
      description: `Role ${action} for ${permission?.userId || userAddress}`,
      details: {
        userAddress,
        role: permission?.role,
        action,
      },
    };
  }
}

export const createPermissionManager = (
  daoId: string,
  customRoles?: RoleDefinition[]
): PermissionManager => {
  return new PermissionManager(daoId, customRoles);
};
