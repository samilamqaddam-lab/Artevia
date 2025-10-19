import {createClient} from './client';
import type {Database} from './types';
import {logger} from '@/lib/logger';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

/**
 * Get all orders for the current user
 */
export async function getOrders(): Promise<Order[]> {
  const supabase = createClient();

  const {data, error} = await supabase
    .from('orders')
    .select('*')
    .order('created_at', {ascending: false});

  if (error) {
    logger.error('Error fetching orders:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single order by ID
 */
export async function getOrder(id: string): Promise<Order | null> {
  const supabase = createClient();

  const {data, error} = await supabase.from('orders').select('*').eq('id', id).single();

  if (error) {
    logger.error('Error fetching order:', error);
    return null;
  }

  return data;
}

/**
 * Get order by order_id (CMD-xxx)
 */
export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  const supabase = createClient();

  const {data, error} = await supabase.from('orders').select('*').eq('order_id', orderId).single();

  if (error) {
    logger.error('Error fetching order by order_id:', error);
    return null;
  }

  return data;
}

/**
 * Create a new order
 */
export async function createOrder(
  order: Omit<OrderInsert, 'user_id' | 'created_at'>
): Promise<Order> {
  const supabase = createClient();

  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const {data, error} = await supabase
    .from('orders')
    .insert({
      ...order,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    logger.error('Error creating order:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing order (admin only - not exposed to users)
 */
export async function updateOrder(id: string, updates: OrderUpdate): Promise<Order> {
  const supabase = createClient();

  const {data, error} = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Error updating order:', error);
    throw error;
  }

  return data;
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(status: string): Promise<Order[]> {
  const supabase = createClient();

  const {data, error} = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', {ascending: false});

  if (error) {
    logger.error('Error fetching orders by status:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get order statistics for current user
 */
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  completed: number;
  totalAmount: number;
}> {
  const supabase = createClient();

  const {data, error} = await supabase.from('orders').select('status, total_amount');

  if (error) {
    logger.error('Error fetching order stats:', error);
    throw error;
  }

  const stats = {
    total: data.length,
    pending: data.filter((o) => o.status === 'pending-review' || o.status === 'processing').length,
    completed: data.filter((o) => o.status === 'completed').length,
    totalAmount: data.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
  };

  return stats;
}
