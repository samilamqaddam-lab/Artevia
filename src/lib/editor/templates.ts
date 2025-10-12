/**
 * Design Templates System
 * Pre-made templates for quick start (Canva-style)
 */

export interface DesignTemplate {
  id: string;
  name: string;
  nameKey: string; // i18n key
  thumbnail: string;
  productTypes: string[]; // Compatible product IDs
  canvas: {
    version: string;
    objects: Array<Record<string, unknown>>;
    background?: string;
  };
}

// Simple logo template
const LOGO_CENTER_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'textbox',
      left: 500,
      top: 400,
      width: 600,
      height: 200,
      text: 'Votre Logo',
      fontSize: 120,
      fontFamily: 'Cairo, Inter, sans-serif',
      fill: '#1f2937',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }
  ],
  background: '#ffffff'
};

// Minimalist text template
const TEXT_MINIMAL_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'textbox',
      left: 500,
      top: 300,
      width: 700,
      height: 150,
      text: 'VOTRE MARQUE',
      fontSize: 100,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#000000',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 500,
      width: 500,
      height: 80,
      text: 'Votre slogan ici',
      fontSize: 40,
      fontFamily: 'Cairo, Inter, sans-serif',
      fill: '#6b7280',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }
  ],
  background: '#ffffff'
};

// Vintage style template
const VINTAGE_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'circle',
      left: 500,
      top: 400,
      radius: 200,
      fill: 'transparent',
      stroke: '#92400e',
      strokeWidth: 8,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 380,
      width: 300,
      height: 100,
      text: 'EST. 2025',
      fontSize: 60,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#92400e',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 460,
      width: 350,
      height: 60,
      text: 'VOTRE MARQUE',
      fontSize: 36,
      fontFamily: 'Cairo, Inter, sans-serif',
      fill: '#92400e',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }
  ],
  background: '#fef3c7'
};

// Modern badge template
const MODERN_BADGE_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'rect',
      left: 500,
      top: 400,
      width: 400,
      height: 400,
      fill: '#1f6f8b',
      rx: 40,
      ry: 40,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 380,
      width: 300,
      height: 100,
      text: 'PREMIUM',
      fontSize: 50,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 460,
      width: 280,
      height: 70,
      text: 'QUALITY',
      fontSize: 40,
      fontFamily: 'Cairo, Inter, sans-serif',
      fill: '#82d4bb',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }
  ],
  background: '#ffffff'
};

// Creative colorful template
const CREATIVE_COLORFUL_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'circle',
      left: 350,
      top: 300,
      radius: 120,
      fill: '#f89d13',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'rect',
      left: 600,
      top: 350,
      width: 200,
      height: 200,
      fill: '#1f6f8b',
      rx: 30,
      ry: 30,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'triangle',
      left: 500,
      top: 550,
      width: 180,
      height: 150,
      fill: '#f97316',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 400,
      width: 500,
      height: 120,
      text: 'BE CREATIVE',
      fontSize: 80,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      stroke: '#000000',
      strokeWidth: 2
    }
  ],
  background: '#ffffff'
};

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: 'logo-center',
    name: 'Logo Centré',
    nameKey: 'templates.logoCenter',
    thumbnail: '/templates/logo-center.svg',
    productTypes: ['tshirt-essential', 'notepad-spiral', 'pen-s1', 'mousepad-soft', 'folder-standard', 'mug-ceramique', 'totebag-canvas', 'usb-16go'],
    canvas: LOGO_CENTER_TEMPLATE
  },
  {
    id: 'text-minimal',
    name: 'Texte Minimaliste',
    nameKey: 'templates.textMinimal',
    thumbnail: '/templates/text-minimal.svg',
    productTypes: ['tshirt-essential', 'notepad-spiral', 'totebag-canvas', 'folder-standard'],
    canvas: TEXT_MINIMAL_TEMPLATE
  },
  {
    id: 'vintage',
    name: 'Style Vintage',
    nameKey: 'templates.vintage',
    thumbnail: '/templates/vintage.svg',
    productTypes: ['tshirt-essential', 'totebag-canvas', 'mug-ceramique'],
    canvas: VINTAGE_TEMPLATE
  },
  {
    id: 'modern-badge',
    name: 'Badge Moderne',
    nameKey: 'templates.modernBadge',
    thumbnail: '/templates/modern-badge.svg',
    productTypes: ['tshirt-essential', 'totebag-canvas', 'mug-ceramique', 'mousepad-soft'],
    canvas: MODERN_BADGE_TEMPLATE
  },
  {
    id: 'creative-colorful',
    name: 'Créatif Coloré',
    nameKey: 'templates.creativeColorful',
    thumbnail: '/templates/creative-colorful.svg',
    productTypes: ['tshirt-essential', 'notepad-spiral', 'mousepad-soft', 'totebag-canvas'],
    canvas: CREATIVE_COLORFUL_TEMPLATE
  }
];

/**
 * Get templates compatible with a specific product
 */
export function getTemplatesForProduct(productId: string): DesignTemplate[] {
  return DESIGN_TEMPLATES.filter(template =>
    template.productTypes.includes(productId)
  );
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): DesignTemplate | undefined {
  return DESIGN_TEMPLATES.find(template => template.id === templateId);
}
