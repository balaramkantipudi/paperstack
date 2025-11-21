import { NextApiRequest } from 'next';
import { supabaseAdmin } from './supabase';
import { User } from '@supabase/supabase-js';

interface SubscriptionPlan {
  document_limit: number;
  user_limit: number;
}

interface OrganizationSubscription {
  status: string;
  plan: SubscriptionPlan;
}

interface Organization {
  id: string;
  name: string;
  subscription: OrganizationSubscription[];
}

interface OrganizationMembership {
  organization_id: string;
  role: string;
  organizations: Organization;
}

export interface AuthenticatedUser extends User {
  organization_id: string;
  role: string;
  organization: Organization;
}

interface AuthResult {
  user: AuthenticatedUser | null;
  error: string | null;
}

export async function getUser(req: NextApiRequest): Promise<AuthResult> {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return { user: null, error: 'No token provided' };
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return { user: null, error: 'Invalid token' };
    }

    // Get user's organization membership
    const { data: membership, error: membershipError } = await (supabaseAdmin as any)
      .from('organization_members')
      .select(`
        organization_id,
        role,
        organizations (
          id,
          name,
          subscription:organization_subscriptions (
            status,
            plan:subscription_plans (
              document_limit,
              user_limit
            )
          )
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return { user: null, error: 'User not associated with any organization' };
    }

    return {
      user: {
        ...user,
        organization_id: membership.organization_id,
        role: membership.role,
        organization: membership.organizations
      } as AuthenticatedUser,
      error: null
    };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}

export async function requireAuth(req: NextApiRequest): Promise<AuthenticatedUser> {
  const { user, error } = await getUser(req);

  if (!user) {
    throw new Error(error || 'Authentication required');
  }

  return user;
}
