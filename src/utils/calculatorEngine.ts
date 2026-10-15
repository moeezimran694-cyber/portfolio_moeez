import { CALCULATOR_CONFIG, ServiceId } from '../data/calculatorConfig';

export interface BreakdownItem {
  label: string;
  category: 'base' | 'type' | 'complexity' | 'feature' | 'quantity' | 'urgency' | 'addon';
  amount: number;
}

export interface CalculationResult {
  serviceId: ServiceId;
  serviceName: string;
  basePrice: number;
  subtotal: number;
  estimatedMin: number;
  estimatedMax: number;
  currency: string;
  complexityLabel: string;
  urgencyLabel?: string;
  breakdown: BreakdownItem[];
  thirdPartyNotice?: string;
  summaryText: string;
}

export interface WebsiteOptions {
  typeId: string;
  pagesCount: number;
  complexityId: string;
  selectedFeatures: string[];
  contentReadinessId: string;
  urgencyId: string;
}

export interface VoiceAgentOptions {
  agentTypeId: string;
  purposeId: string;
  selectedIntegrations: string[];
  callVolumeId: string;
  complexityId: string;
}

export interface VideoAdsOptions {
  durationId: string;
  styleId: string;
  quantity: number;
  complexityId: string;
  clientAssetId: string;
}

export interface GraphicDesignOptions {
  designTypeId: string;
  quantity: number;
  complexityId: string;
  brandAssetId: string;
}

export interface Blender3dOptions {
  outputTypeId: string;
  productModelId: string;
  complexityId: string;
  deliverablesCount: number;
}

export interface AutomationOptions {
  automationTypeId: string;
  stepsCount: number;
  selectedIntegrations: string[];
  complexityId: string;
}

export type AnyServiceOptions =
  | { serviceId: 'website'; options: WebsiteOptions }
  | { serviceId: 'voiceAgent'; options: VoiceAgentOptions }
  | { serviceId: 'videoAds'; options: VideoAdsOptions }
  | { serviceId: 'graphicDesign'; options: GraphicDesignOptions }
  | { serviceId: 'blender3d'; options: Blender3dOptions }
  | { serviceId: 'automation'; options: AutomationOptions };

export function formatPrice(amount: number): string {
  const rounded = Math.round(amount / 500) * 500;
  return `${CALCULATOR_CONFIG.currency.symbol}${rounded.toLocaleString(CALCULATOR_CONFIG.currency.locale)}`;
}

export function calculateProjectCost(data: AnyServiceOptions): CalculationResult {
  const currency = CALCULATOR_CONFIG.currency.code;
  const breakdown: BreakdownItem[] = [];

  if (data.serviceId === 'website') {
    const cfg = CALCULATOR_CONFIG.services.website;
    const opts = data.options;

    // 1. Base Service Price
    breakdown.push({ label: `${cfg.name} Baseline`, category: 'base', amount: cfg.basePrice });
    let total = cfg.basePrice;

    // 2. Website Type
    const selectedType = cfg.types.find((t) => t.id === opts.typeId) || cfg.types[0];
    if (selectedType.priceAdd > 0) {
      breakdown.push({ label: `Website Type: ${selectedType.label}`, category: 'type', amount: selectedType.priceAdd });
      total += selectedType.priceAdd;
    }

    // 3. Pages / Screen Count
    const basePages = selectedType.defaultPages || 1;
    const extraPages = Math.max(0, opts.pagesCount - basePages);
    if (extraPages > 0) {
      const pagesCost = extraPages * cfg.pricePerPage;
      breakdown.push({ label: `Additional Screens (${extraPages} × ${formatPrice(cfg.pricePerPage)})`, category: 'quantity', amount: pagesCost });
      total += pagesCost;
    }

    // 4. Features
    opts.selectedFeatures.forEach((featId) => {
      const feat = cfg.features.find((f) => f.id === featId);
      if (feat) {
        breakdown.push({ label: feat.label, category: 'feature', amount: feat.price });
        total += feat.price;
      }
    });

    // 5. Content Readiness
    const content = cfg.contentReadiness.find((c) => c.id === opts.contentReadinessId);
    if (content && content.priceAdd > 0) {
      breakdown.push({ label: content.label, category: 'addon', amount: content.priceAdd });
      total += content.priceAdd;
    }

    // 6. Complexity Multiplier
    const comp = cfg.complexity.find((c) => c.id === opts.complexityId) || cfg.complexity[0];
    if (comp.multiplier > 1.0) {
      const complexityDiff = Math.round(total * (comp.multiplier - 1));
      breakdown.push({ label: `Design Complexity (${comp.label})`, category: 'complexity', amount: complexityDiff });
      total += complexityDiff;
    }

    // 7. Urgency
    const urg = cfg.urgency.find((u) => u.id === opts.urgencyId) || cfg.urgency[0];
    if (urg.multiplier > 1.0) {
      const urgencyCost = Math.round(total * (urg.multiplier - 1));
      breakdown.push({ label: `Delivery Timeline (${urg.label})`, category: 'urgency', amount: urgencyCost });
      total += urgencyCost;
    }

    const estimatedMin = Math.round((total * cfg.minPriceVariance) / 500) * 500;
    const estimatedMax = Math.round((total * cfg.maxPriceVariance) / 500) * 500;

    return {
      serviceId: 'website',
      serviceName: cfg.name,
      basePrice: cfg.basePrice,
      subtotal: total,
      estimatedMin,
      estimatedMax,
      currency,
      complexityLabel: comp.label,
      urgencyLabel: urg.label,
      breakdown,
      summaryText: `${selectedType.label} with ${opts.pagesCount} screens, ${comp.label} tier, and ${opts.selectedFeatures.length} features`,
    };
  }

  if (data.serviceId === 'voiceAgent') {
    const cfg = CALCULATOR_CONFIG.services.voiceAgent;
    const opts = data.options;

    breakdown.push({ label: `${cfg.name} Baseline Setup`, category: 'base', amount: cfg.basePrice });
    let total = cfg.basePrice;

    // Agent Type
    const agentType = cfg.agentTypes.find((a) => a.id === opts.agentTypeId) || cfg.agentTypes[0];
    if (agentType.priceAdd > 0) {
      breakdown.push({ label: `Agent Direction: ${agentType.label}`, category: 'type', amount: agentType.priceAdd });
      total += agentType.priceAdd;
    }

    // Purpose
    const purpose = cfg.purposes.find((p) => p.id === opts.purposeId) || cfg.purposes[0];
    if (purpose.priceAdd > 0) {
      breakdown.push({ label: `Workflow Purpose: ${purpose.label}`, category: 'addon', amount: purpose.priceAdd });
      total += purpose.priceAdd;
    }

    // Integrations
    opts.selectedIntegrations.forEach((intId) => {
      const integ = cfg.integrations.find((i) => i.id === intId);
      if (integ) {
        breakdown.push({ label: `Integration: ${integ.label}`, category: 'feature', amount: integ.price });
        total += integ.price;
      }
    });

    // Volume
    const vol = cfg.callVolume.find((v) => v.id === opts.callVolumeId);
    if (vol && vol.priceAdd > 0) {
      breakdown.push({ label: `Capacity Tier: ${vol.label}`, category: 'quantity', amount: vol.priceAdd });
      total += vol.priceAdd;
    }

    // Complexity
    const comp = cfg.complexity.find((c) => c.id === opts.complexityId) || cfg.complexity[0];
    if (comp.multiplier > 1.0) {
      const complexityDiff = Math.round(total * (comp.multiplier - 1));
      breakdown.push({ label: `AI Conversational Depth (${comp.label})`, category: 'complexity', amount: complexityDiff });
      total += complexityDiff;
    }

    const estimatedMin = Math.round((total * cfg.minPriceVariance) / 500) * 500;
    const estimatedMax = Math.round((total * cfg.maxPriceVariance) / 500) * 500;

    return {
      serviceId: 'voiceAgent',
      serviceName: cfg.name,
      basePrice: cfg.basePrice,
      subtotal: total,
      estimatedMin,
      estimatedMax,
      currency,
      complexityLabel: comp.label,
      thirdPartyNotice: cfg.thirdPartyNotice,
      breakdown,
      summaryText: `${agentType.label} for ${purpose.label} with ${opts.selectedIntegrations.length} integrations`,
    };
  }

  if (data.serviceId === 'videoAds') {
    const cfg = CALCULATOR_CONFIG.services.videoAds;
    const opts = data.options;

    const qty = Math.max(1, opts.quantity);
    let perVideoTotal: number = cfg.basePrice;

    // Style
    const style = cfg.styles.find((s) => s.id === opts.styleId) || cfg.styles[0];
    if (style.priceAdd > 0) {
      perVideoTotal += style.priceAdd;
    }

    // Duration Multiplier
    const dur = cfg.durations.find((d) => d.id === opts.durationId) || cfg.durations[0];
    perVideoTotal = Math.round(perVideoTotal * dur.multiplier);

    // Complexity
    const comp = cfg.complexity.find((c) => c.id === opts.complexityId) || cfg.complexity[0];
    perVideoTotal = Math.round(perVideoTotal * comp.multiplier);

    // Assets
    const asset = cfg.clientAssets.find((a) => a.id === opts.clientAssetId) || cfg.clientAssets[0];
    if (asset.priceAdd > 0) {
      perVideoTotal += asset.priceAdd;
    }

    const subtotal = perVideoTotal * qty;
    breakdown.push({ label: `${style.label} (${dur.label})`, category: 'base', amount: cfg.basePrice * qty });
    if (subtotal > cfg.basePrice * qty) {
      breakdown.push({ label: `Creative Style, Duration & Voiceover Options`, category: 'type', amount: subtotal - (cfg.basePrice * qty) });
    }
    if (qty > 1) {
      breakdown.push({ label: `Deliverable Batch Size: ${qty} Video Ads`, category: 'quantity', amount: 0 });
    }

    const estimatedMin = Math.round((subtotal * cfg.minPriceVariance) / 500) * 500;
    const estimatedMax = Math.round((subtotal * cfg.maxPriceVariance) / 500) * 500;

    return {
      serviceId: 'videoAds',
      serviceName: cfg.name,
      basePrice: cfg.basePrice,
      subtotal,
      estimatedMin,
      estimatedMax,
      currency,
      complexityLabel: comp.label,
      breakdown,
      summaryText: `${qty} × ${style.label} (${dur.label}) at ${comp.label} visual tier`,
    };
  }

  if (data.serviceId === 'graphicDesign') {
    const cfg = CALCULATOR_CONFIG.services.graphicDesign;
    const opts = data.options;

    const selectedType = cfg.designTypes.find((t) => t.id === opts.designTypeId) || cfg.designTypes[0];
    let total = cfg.basePrice + selectedType.priceAdd;

    breakdown.push({ label: `Base Design Package (${selectedType.label})`, category: 'base', amount: total });

    const qty = Math.max(1, opts.quantity);
    if (selectedType.pricePerUnit > 0 && qty > selectedType.defaultQty) {
      const extra = (qty - selectedType.defaultQty) * selectedType.pricePerUnit;
      breakdown.push({ label: `Additional Designs (${qty - selectedType.defaultQty} × ${formatPrice(selectedType.pricePerUnit)})`, category: 'quantity', amount: extra });
      total += extra;
    }

    const comp = cfg.complexity.find((c) => c.id === opts.complexityId) || cfg.complexity[0];
    if (comp.multiplier > 1.0) {
      const compCost = Math.round(total * (comp.multiplier - 1));
      breakdown.push({ label: `Art Direction (${comp.label})`, category: 'complexity', amount: compCost });
      total += compCost;
    }

    const assets = cfg.brandAssets.find((b) => b.id === opts.brandAssetId);
    if (assets && assets.priceAdd > 0) {
      breakdown.push({ label: assets.label, category: 'addon', amount: assets.priceAdd });
      total += assets.priceAdd;
    }

    const estimatedMin = Math.round((total * cfg.minPriceVariance) / 500) * 500;
    const estimatedMax = Math.round((total * cfg.maxPriceVariance) / 500) * 500;

    return {
      serviceId: 'graphicDesign',
      serviceName: cfg.name,
      basePrice: cfg.basePrice,
      subtotal: total,
      estimatedMin,
      estimatedMax,
      currency,
      complexityLabel: comp.label,
      breakdown,
      summaryText: `${qty} Assets · ${selectedType.label} (${comp.label})`,
    };
  }

  if (data.serviceId === 'blender3d') {
    const cfg = CALCULATOR_CONFIG.services.blender3d;
    const opts = data.options;

    let total = cfg.basePrice;
    breakdown.push({ label: 'Blender 3D Studio Production Base', category: 'base', amount: cfg.basePrice });

    const output = cfg.outputTypes.find((o) => o.id === opts.outputTypeId) || cfg.outputTypes[0];
    if (output.priceAdd > 0) {
      breakdown.push({ label: `Deliverable: ${output.label}`, category: 'type', amount: output.priceAdd });
      total += output.priceAdd;
    }

    const model = cfg.productModel.find((m) => m.id === opts.productModelId) || cfg.productModel[0];
    if (model.priceAdd > 0) {
      breakdown.push({ label: model.label, category: 'addon', amount: model.priceAdd });
      total += model.priceAdd;
    }

    const extraDeliverables = Math.max(0, opts.deliverablesCount - 1);
    if (extraDeliverables > 0) {
      const extraCost = extraDeliverables * cfg.deliverablesCount.pricePerExtraDeliverable;
      breakdown.push({ label: `Additional Product Deliverables (${extraDeliverables})`, category: 'quantity', amount: extraCost });
      total += extraCost;
    }

    const comp = cfg.complexity.find((c) => c.id === opts.complexityId) || cfg.complexity[0];
    if (comp.multiplier > 1.0) {
      const compCost = Math.round(total * (comp.multiplier - 1));
      breakdown.push({ label: `Lighting, Shading & Physics (${comp.label})`, category: 'complexity', amount: compCost });
      total += compCost;
    }

    const estimatedMin = Math.round((total * cfg.minPriceVariance) / 500) * 500;
    const estimatedMax = Math.round((total * cfg.maxPriceVariance) / 500) * 500;

    return {
      serviceId: 'blender3d',
      serviceName: cfg.name,
      basePrice: cfg.basePrice,
      subtotal: total,
      estimatedMin,
      estimatedMax,
      currency,
      complexityLabel: comp.label,
      breakdown,
      summaryText: `${opts.deliverablesCount} Deliverables · ${output.label} (${comp.label})`,
    };
  }

  // Automation
  const cfg = CALCULATOR_CONFIG.services.automation;
  const opts = data.options;

  let total = cfg.basePrice;
  breakdown.push({ label: 'Automation Architecture Base', category: 'base', amount: cfg.basePrice });

  const autoType = cfg.automationTypes.find((a) => a.id === opts.automationTypeId) || cfg.automationTypes[0];
  if (autoType.priceAdd > 0) {
    breakdown.push({ label: `Workflow Engine: ${autoType.label}`, category: 'type', amount: autoType.priceAdd });
    total += autoType.priceAdd;
  }

  if (opts.stepsCount > 3) {
    const extraStepsCost = (opts.stepsCount - 3) * 5000;
    breakdown.push({ label: `Workflow Steps (${opts.stepsCount} steps)`, category: 'quantity', amount: extraStepsCost });
    total += extraStepsCost;
  }

  opts.selectedIntegrations.forEach((intId) => {
    const integ = cfg.integrations.find((i) => i.id === intId);
    if (integ) {
      breakdown.push({ label: `Integration Node: ${integ.label}`, category: 'feature', amount: integ.price });
      total += integ.price;
    }
  });

  const comp = cfg.complexity.find((c) => c.id === opts.complexityId) || cfg.complexity[0];
  if (comp.multiplier > 1.0) {
    const compCost = Math.round(total * (comp.multiplier - 1));
    breakdown.push({ label: `System Logic & Retries (${comp.label})`, category: 'complexity', amount: compCost });
    total += compCost;
  }

  const estimatedMin = Math.round((total * cfg.minPriceVariance) / 500) * 500;
  const estimatedMax = Math.round((total * cfg.maxPriceVariance) / 500) * 500;

  return {
    serviceId: 'automation',
    serviceName: cfg.name,
    basePrice: cfg.basePrice,
    subtotal: total,
    estimatedMin,
    estimatedMax,
    currency,
    complexityLabel: comp.label,
    thirdPartyNotice: cfg.thirdPartyNotice,
    breakdown,
    summaryText: `${autoType.label} with ${opts.stepsCount} steps and ${opts.selectedIntegrations.length} integrations`,
  };
}
