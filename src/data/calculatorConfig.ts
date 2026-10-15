/**
 * Project Cost Calculator Configuration File
 * 
 * Website Owner Note:
 * Update your baseline service pricing, add-on rates, currency symbol,
 * and contact info below without touching the calculator UI code.
 */

export interface PricingServiceConfig {
  id: string;
  name: string;
  tagline: string;
  iconName: 'Globe' | 'Mic' | 'Video' | 'Palette' | 'Box' | 'Cpu';
  basePrice: number; // in default currency (PKR)
  minPriceVariance: number; // e.g. 0.90 for -10%
  maxPriceVariance: number; // e.g. 1.20 for +20%
  thirdPartyNotice?: string;
}

export const CALCULATOR_CONFIG = {
  // Currency & Formatting
  currency: {
    code: 'PKR',
    symbol: 'PKR ',
    locale: 'en-PK',
  },

  // Notice status: Set to false once official final rates are locked in
  isPreliminaryEstimate: true,
  preliminaryNotice: 'PRELIMINARY ESTIMATE NOTICE: The displayed ranges represent baseline benchmark pricing. Exact investment and turnaround are confirmed following a brief project scoping discussion.',

  // Owner contact details for inquiry routing
  contact: {
    whatsappNumber: '+92 318 4498716',
    whatsappRaw: '923184498716',
    email: 'moeezi396@gmail.com',
    ownerName: 'Moeez',
  },

  // 1. SERVICES BASE CONFIG
  services: {
    website: {
      id: 'website',
      name: 'Website Development',
      tagline: 'Modern, high-conversion web platforms, landing pages & custom web apps.',
      iconName: 'Globe',
      basePrice: 40000, // PKR
      minPriceVariance: 0.9,
      maxPriceVariance: 1.25,
      types: [
        { id: 'landing-page', label: 'Landing Page', priceAdd: 0, defaultPages: 1 },
        { id: 'business-website', label: 'Business Website', priceAdd: 20000, defaultPages: 5 },
        { id: 'portfolio', label: 'Personal / Agency Portfolio', priceAdd: 10000, defaultPages: 3 },
        { id: 'ecommerce', label: 'E-commerce Store', priceAdd: 45000, defaultPages: 8 },
        { id: 'web-app', label: 'Full-Stack Web Application', priceAdd: 75000, defaultPages: 10 },
      ],
      pricePerPage: 4000, // PKR per additional page
      complexity: [
        { id: 'basic', label: 'Basic', description: 'Clean, clean layout with standard animations', multiplier: 1.0 },
        { id: 'professional', label: 'Professional', description: 'Custom branded UI, smooth interactions & high speed', multiplier: 1.2 },
        { id: 'premium', label: 'Premium', description: 'Bespoke cyber aesthetic, custom 3D/canvas effects & micro-interactions', multiplier: 1.45 },
      ],
      features: [
        { id: 'contact-form', label: 'Interactive Contact & Inquiry Form', price: 5000 },
        { id: 'database', label: 'Relational Database / Storage (PostgreSQL)', price: 15000 },
        { id: 'authentication', label: 'User Authentication & Protected Accounts', price: 15000 },
        { id: 'admin-dashboard', label: 'Custom Admin Dashboard & Content Manager', price: 30000 },
        { id: 'payments', label: 'Stripe / Online Payment Integration', price: 20000 },
        { id: 'ai-integration', label: 'AI Features / LLM API Integration', price: 25000 },
      ],
      contentReadiness: [
        { id: 'provided', label: 'Content Provided by Client', priceAdd: 0 },
        { id: 'needed', label: 'Copywriting & Content Creation Required', priceAdd: 15000 },
      ],
      urgency: [
        { id: 'standard', label: 'Standard Delivery (2-4 Weeks)', multiplier: 1.0 },
        { id: 'priority', label: 'Priority Rush Delivery (1-2 Weeks)', multiplier: 1.25 },
      ],
    },

    voiceAgent: {
      id: 'voice-agent',
      name: 'AI Voice Calling Agents',
      tagline: 'Autonomous AI telephony for customer support, qualification & bookings.',
      iconName: 'Mic',
      basePrice: 65000, // PKR
      minPriceVariance: 0.9,
      maxPriceVariance: 1.3,
      thirdPartyNotice: 'Telephony infrastructure (Twilio/Vapi) and AI token consumption (OpenAI/ElevenLabs) are paid directly to providers based on usage.',
      agentTypes: [
        { id: 'inbound', label: 'Inbound Support Agent', priceAdd: 0 },
        { id: 'outbound', label: 'Outbound Appointment / Calling Agent', priceAdd: 15000 },
        { id: 'both', label: 'Dual Inbound & Outbound System', priceAdd: 30000 },
      ],
      purposes: [
        { id: 'support', label: '24/7 Customer Support & FAQ', priceAdd: 0 },
        { id: 'booking', label: 'Live Calendar Appointment Booking', priceAdd: 10000 },
        { id: 'qualification', label: 'Inbound Lead Qualification & CRM Sync', priceAdd: 15000 },
        { id: 'follow-up', label: 'Automated Customer Follow-Up Calls', priceAdd: 12000 },
      ],
      integrations: [
        { id: 'crm', label: 'CRM (HubSpot, GoHighLevel, Salesforce)', price: 15000 },
        { id: 'calendar', label: 'Google Calendar / Calendly Sync', price: 10000 },
        { id: 'website-widget', label: 'Direct Website Voice Widget', price: 12000 },
        { id: 'custom-api', label: 'Custom Webhook / Database API', price: 18000 },
      ],
      callVolume: [
        { id: 'low', label: 'Low (< 500 calls/month)', priceAdd: 0 },
        { id: 'medium', label: 'Medium (500 - 2,500 calls/month)', priceAdd: 15000 },
        { id: 'high', label: 'High (2,500+ calls/month)', priceAdd: 30000 },
      ],
      complexity: [
        { id: 'basic', label: 'Basic (Single workflow, FAQ answers)', multiplier: 1.0 },
        { id: 'professional', label: 'Professional (Multi-turn conversations & tool actions)', multiplier: 1.25 },
        { id: 'advanced', label: 'Advanced (Real-time live sentiment, dynamic function routing)', multiplier: 1.5 },
      ],
    },

    videoAds: {
      id: 'video-ads',
      name: 'AI Advertisement Videos',
      tagline: 'High-impact promotional reels, product ads & cinematic video campaigns.',
      iconName: 'Video',
      basePrice: 25000, // PKR per video
      minPriceVariance: 0.9,
      maxPriceVariance: 1.25,
      durations: [
        { id: 'short', label: 'Short Form (15 - 30 seconds)', multiplier: 1.0 },
        { id: 'medium', label: 'Medium Form (30 - 60 seconds)', multiplier: 1.35 },
        { id: 'long', label: 'Long Form (60 - 90 seconds)', multiplier: 1.7 },
      ],
      styles: [
        { id: 'product-ad', label: 'E-commerce Product Advertisement', priceAdd: 0 },
        { id: 'social-reel', label: 'Viral Social Media Reel / TikTok Ad', priceAdd: 5000 },
        { id: 'cinematic-promo', label: 'Cinematic Brand Commercial Promo', priceAdd: 15000 },
        { id: 'explainer', label: 'AI Voiceover Animated Explainer', priceAdd: 10000 },
      ],
      complexity: [
        { id: 'basic', label: 'Basic (Clean pacing & text overlays)', multiplier: 1.0 },
        { id: 'professional', label: 'Professional (Dynamic sound design & speed ramps)', multiplier: 1.25 },
        { id: 'premium', label: 'Premium (Cinematic color grading & custom visual effects)', multiplier: 1.5 },
      ],
      clientAssets: [
        { id: 'full-provided', label: 'Footage, Images & Script Provided by Client', priceAdd: 0 },
        { id: 'script-needed', label: 'Scriptwriting Required', priceAdd: 8000 },
        { id: 'voiceover-needed', label: 'Professional AI Voiceover Production', priceAdd: 7000 },
        { id: 'full-production', label: 'Complete Generation (No Assets Provided)', priceAdd: 20000 },
      ],
    },

    graphicDesign: {
      id: 'graphic-design',
      name: 'Graphic Design',
      tagline: 'Visual identities, promotional banner suites & high-converting ad graphics.',
      iconName: 'Palette',
      basePrice: 15000, // PKR
      minPriceVariance: 0.9,
      maxPriceVariance: 1.2,
      designTypes: [
        { id: 'social-posts', label: 'Social Media Post Bundle', priceAdd: 0, defaultQty: 5, pricePerUnit: 2500 },
        { id: 'ad-creatives', label: 'High-Converting Ad Creatives', priceAdd: 5000, defaultQty: 4, pricePerUnit: 3000 },
        { id: 'branding', label: 'Brand Identity Mark & Typography Guidelines', priceAdd: 25000, defaultQty: 1, pricePerUnit: 0 },
        { id: 'banners', label: 'Web & Display Banners Suite', priceAdd: 8000, defaultQty: 3, pricePerUnit: 2500 },
        { id: 'marketing-kit', label: 'Complete Marketing Materials Suite', priceAdd: 35000, defaultQty: 1, pricePerUnit: 0 },
      ],
      complexity: [
        { id: 'basic', label: 'Basic (Standard typography & clean layouts)', multiplier: 1.0 },
        { id: 'professional', label: 'Professional (Custom vector illustrations & composite graphics)', multiplier: 1.25 },
        { id: 'premium', label: 'Premium (High-end 3D hybrid design & luxury aesthetics)', multiplier: 1.5 },
      ],
      brandAssets: [
        { id: 'provided', label: 'Logos, Fonts & Brand Assets Provided', priceAdd: 0 },
        { id: 'creation-needed', label: 'Brand Asset Development Required', priceAdd: 12000 },
      ],
    },

    blender3d: {
      id: 'blender-3d',
      name: 'Blender 3D Product Advertisements',
      tagline: 'Photorealistic Cycles product renders & cinematic 3D commercial animation.',
      iconName: 'Box',
      basePrice: 45000, // PKR
      minPriceVariance: 0.9,
      maxPriceVariance: 1.3,
      outputTypes: [
        { id: 'render', label: 'High-Res Still Product Renders (Multi-angle 4K)', priceAdd: 0 },
        { id: 'animation', label: '360° Turntable & Exploded View Animation', priceAdd: 35000 },
        { id: 'cinematic-ad', label: 'Full Cinematic Commercial Animation Reel', priceAdd: 70000 },
      ],
      productModel: [
        { id: 'provided', label: '3D CAD / Model File Provided by Client', priceAdd: 0 },
        { id: 'modeling-needed', label: '3D Modeling & Texturing From Scratch', priceAdd: 25000 },
      ],
      complexity: [
        { id: 'basic', label: 'Basic (Studio matte lighting & clean turntable)', multiplier: 1.0 },
        { id: 'professional', label: 'Professional (PBR shaders, micro-scratches & dual neon rim light)', multiplier: 1.3 },
        { id: 'premium', label: 'Premium (Volumetric smoke, fluid particles & cinematic physics)', multiplier: 1.6 },
      ],
      deliverablesCount: {
        pricePerExtraDeliverable: 10000,
      },
    },

    automation: {
      id: 'automation',
      name: 'Business Automation & AI Integrations',
      tagline: 'Autonomous lead routing, CRM webhooks & customized AI workflows.',
      iconName: 'Cpu',
      basePrice: 50000, // PKR
      minPriceVariance: 0.9,
      maxPriceVariance: 1.3,
      thirdPartyNotice: 'Third-party platform fees (e.g. Make.com, Zapier, OpenAI API) are billed separately by those platforms.',
      automationTypes: [
        { id: 'lead-management', label: 'Automated Lead Qualification & Dispatch', priceAdd: 0 },
        { id: 'data-processing', label: 'AI Document & Data Extraction Pipeline', priceAdd: 15000 },
        { id: 'notifications', label: 'Multi-Channel Alerts (Slack, WhatsApp, Email)', priceAdd: 10000 },
        { id: 'workflow', label: 'End-to-End Autonomous Business Workflow', priceAdd: 30000 },
        { id: 'custom-ai', label: 'Custom Fine-Tuned AI Assistant / Copilot', priceAdd: 45000 },
      ],
      complexity: [
        { id: 'basic', label: 'Basic (Up to 3 automated steps)', multiplier: 1.0 },
        { id: 'professional', label: 'Professional (4 - 8 multi-conditional steps)', multiplier: 1.3 },
        { id: 'advanced', label: 'Advanced (Enterprise logic, fallback retries & webhooks)', multiplier: 1.6 },
      ],
      integrations: [
        { id: 'google-suite', label: 'Google Workspace (Sheets, Gmail, Drive)', price: 8000 },
        { id: 'crm-sync', label: 'CRM System (HubSpot, GoHighLevel, Pipedrive)', price: 15000 },
        { id: 'slack-discord', label: 'Team Chat Webhooks (Slack, Discord)', price: 6000 },
        { id: 'payment-trigger', label: 'Stripe / Payment Automation Triggers', price: 12000 },
        { id: 'custom-api', label: 'Custom External REST API', price: 18000 },
      ],
    },
  },
} as const;

export type ServiceId = keyof typeof CALCULATOR_CONFIG.services;
