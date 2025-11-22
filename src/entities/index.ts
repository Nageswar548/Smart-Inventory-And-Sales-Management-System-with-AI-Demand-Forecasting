/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: demandforecasts
 * Interface for DemandForecasts
 */
export interface DemandForecasts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  productId?: string;
  /** @wixFieldType datetime */
  forecastGeneratedDate?: Date | string;
  /** @wixFieldType date */
  forecastPeriodStartDate?: Date | string;
  /** @wixFieldType date */
  forecastPeriodEndDate?: Date | string;
  /** @wixFieldType number */
  predictedDemandQuantity?: number;
  /** @wixFieldType number */
  confidenceLevel?: number;
}


/**
 * Collection ID: notifications
 * Interface for Notifications
 */
export interface Notifications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  notificationType?: string;
  /** @wixFieldType text */
  message?: string;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
  /** @wixFieldType boolean */
  isRead?: boolean;
  /** @wixFieldType text */
  priority?: string;
  /** @wixFieldType text */
  relatedItem?: string;
  /** @wixFieldType url */
  actionUrl?: string;
}


/**
 * Collection ID: products
 * Interface for Products
 */
export interface Products {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  productName?: string;
  /** @wixFieldType text */
  sku?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  price?: number;
  /** @wixFieldType number */
  currentStock?: number;
  /** @wixFieldType number */
  lowStockThreshold?: number;
  /** @wixFieldType image */
  productImage?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
}


/**
 * Collection ID: salesorders
 * Interface for SalesOrders
 */
export interface SalesOrders {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  orderNumber?: string;
  /** @wixFieldType datetime */
  orderDate?: Date | string;
  /** @wixFieldType text */
  customerName?: string;
  /** @wixFieldType number */
  totalAmount?: number;
  /** @wixFieldType text */
  orderStatus?: string;
  /** @wixFieldType text */
  paymentStatus?: string;
  /** @wixFieldType text */
  invoiceNumber?: string;
  /** @wixFieldType url */
  invoiceUrl?: string;
}


/**
 * Collection ID: users
 * Interface for Users
 */
export interface Users {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  passwordHash?: string;
  /** @wixFieldType text */
  role?: string;
  /** @wixFieldType text */
  firstName?: string;
  /** @wixFieldType text */
  lastName?: string;
  /** @wixFieldType datetime */
  lastLoginDate?: Date | string;
  /** @wixFieldType boolean */
  isActive?: boolean;
}
