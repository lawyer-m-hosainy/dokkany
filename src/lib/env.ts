import { z } from 'zod';

const envSchema = z.object({
  // Database Connection (Required)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),

  // Application
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url().default('https://dokkany.shop'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://dokkany.shop'),

  // WhatsApp
  NEXT_PUBLIC_WHATSAPP_PHONE: z.string().default('201141973834'),
  NEXT_PUBLIC_WHATSAPP_DISPLAY: z.string().default('01141973834'),

  // WhatsApp Cloud API (Optional)
  WHATSAPP_CLOUD_API_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string().optional(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().optional(),

  // Telegram Notifications (Optional)
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),

  // Security & Admin Authentication (Required — no defaults)
  ADMIN_JWT_SECRET: z
    .string()
    .min(32, 'ADMIN_JWT_SECRET must be at least 32 characters'),
  ADMIN_DEFAULT_EMAIL: z.string().email('ADMIN_DEFAULT_EMAIL must be a valid email'),
  ADMIN_DEFAULT_PASSWORD: z.string().min(8, 'ADMIN_DEFAULT_PASSWORD must be at least 8 characters'),

  // Cloudinary (Optional)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Upstash Redis (Optional for rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
