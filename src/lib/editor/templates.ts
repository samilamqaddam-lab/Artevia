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

// Geometric modern template
const GEOMETRIC_MODERN_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'rect',
      left: 200,
      top: 200,
      width: 180,
      height: 180,
      fill: '#1f6f8b',
      angle: 45,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'rect',
      left: 800,
      top: 200,
      width: 180,
      height: 180,
      fill: '#f89d13',
      angle: 45,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'circle',
      left: 500,
      top: 250,
      radius: 80,
      fill: '#f97316',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 450,
      width: 600,
      height: 100,
      text: 'VOTRE MARQUE',
      fontSize: 90,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#1f2937',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'rect',
      left: 500,
      top: 580,
      width: 250,
      height: 8,
      fill: '#f89d13',
      originX: 'center',
      originY: 'center'
    }
  ],
  background: '#ffffff'
};

// Bold stripes template
const BOLD_STRIPES_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'rect',
      left: 0,
      top: 0,
      width: 1000,
      height: 200,
      fill: '#1f6f8b',
      originX: 'left',
      originY: 'top'
    },
    {
      type: 'rect',
      left: 0,
      top: 600,
      width: 1000,
      height: 200,
      fill: '#f89d13',
      originX: 'left',
      originY: 'top'
    },
    {
      type: 'textbox',
      left: 500,
      top: 350,
      width: 700,
      height: 150,
      text: 'BOLD BRAND',
      fontSize: 110,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#1f2937',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 480,
      width: 600,
      height: 60,
      text: 'EXPRIMEZ-VOUS',
      fontSize: 36,
      fontFamily: 'Cairo, Inter, sans-serif',
      fill: '#6b7280',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }
  ],
  background: '#ffffff'
};

// Circular badge template
const CIRCULAR_BADGE_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'circle',
      left: 500,
      top: 400,
      radius: 250,
      fill: '#1f6f8b',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'circle',
      left: 500,
      top: 400,
      radius: 200,
      fill: '#ffffff',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 370,
      width: 300,
      height: 80,
      text: 'PREMIUM',
      fontSize: 55,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#1f6f8b',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'circle',
      left: 500,
      top: 470,
      radius: 30,
      fill: '#f89d13',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 540,
      width: 280,
      height: 50,
      text: '2025',
      fontSize: 42,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#1f6f8b',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }
  ],
  background: '#f8fafc'
};

// Corner accent template
const CORNER_ACCENT_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'triangle',
      left: 50,
      top: 50,
      width: 280,
      height: 280,
      fill: '#f89d13',
      angle: -45,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'triangle',
      left: 950,
      top: 750,
      width: 280,
      height: 280,
      fill: '#1f6f8b',
      angle: 135,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 350,
      width: 650,
      height: 120,
      text: 'VOTRE LOGO',
      fontSize: 95,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#1f2937',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 470,
      width: 500,
      height: 60,
      text: 'Votre signature',
      fontSize: 38,
      fontFamily: 'Cairo, Inter, sans-serif',
      fill: '#6b7280',
      fontStyle: 'italic',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }
  ],
  background: '#ffffff'
};

// Minimalist line template
const MINIMALIST_LINE_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'rect',
      left: 100,
      top: 350,
      width: 150,
      height: 4,
      fill: '#1f6f8b',
      originX: 'left',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 350,
      width: 700,
      height: 110,
      text: 'EXCELLENCE',
      fontSize: 88,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#1f2937',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'rect',
      left: 750,
      top: 350,
      width: 150,
      height: 4,
      fill: '#1f6f8b',
      originX: 'right',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 470,
      width: 600,
      height: 55,
      text: 'QUALITÉ & INNOVATION',
      fontSize: 32,
      fontFamily: 'Cairo, Inter, sans-serif',
      fill: '#6b7280',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      letterSpacing: 80
    }
  ],
  background: '#ffffff'
};

// Playful shapes template
const PLAYFUL_SHAPES_TEMPLATE = {
  version: '5.3.0',
  objects: [
    {
      type: 'circle',
      left: 180,
      top: 250,
      radius: 90,
      fill: '#fbbf24',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'rect',
      left: 820,
      top: 280,
      width: 140,
      height: 140,
      fill: '#f97316',
      rx: 20,
      ry: 20,
      angle: 15,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'triangle',
      left: 250,
      top: 580,
      width: 130,
      height: 110,
      fill: '#1f6f8b',
      angle: -25,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'circle',
      left: 780,
      top: 590,
      radius: 65,
      fill: '#82d4bb',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 380,
      width: 600,
      height: 110,
      text: 'FUN BRAND',
      fontSize: 92,
      fontFamily: 'Cairo, Inter, sans-serif',
      fontWeight: 'bold',
      fill: '#1f2937',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: 500,
      top: 490,
      width: 500,
      height: 50,
      text: '✨ Créativité sans limites ✨',
      fontSize: 28,
      fontFamily: 'Cairo, Inter, sans-serif',
      fill: '#6b7280',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
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
  },
  {
    id: 'geometric-modern',
    name: 'Géométrique Moderne',
    nameKey: 'templates.geometricModern',
    thumbnail: '/templates/geometric-modern.svg',
    productTypes: ['tshirt-essential', 'totebag-canvas', 'mousepad-soft', 'folder-standard'],
    canvas: GEOMETRIC_MODERN_TEMPLATE
  },
  {
    id: 'bold-stripes',
    name: 'Bandes Audacieuses',
    nameKey: 'templates.boldStripes',
    thumbnail: '/templates/bold-stripes.svg',
    productTypes: ['tshirt-essential', 'totebag-canvas', 'notepad-spiral'],
    canvas: BOLD_STRIPES_TEMPLATE
  },
  {
    id: 'circular-badge',
    name: 'Badge Circulaire',
    nameKey: 'templates.circularBadge',
    thumbnail: '/templates/circular-badge.svg',
    productTypes: ['tshirt-essential', 'mug-ceramique', 'mousepad-soft', 'usb-16go'],
    canvas: CIRCULAR_BADGE_TEMPLATE
  },
  {
    id: 'corner-accent',
    name: 'Accents d\'angle',
    nameKey: 'templates.cornerAccent',
    thumbnail: '/templates/corner-accent.svg',
    productTypes: ['tshirt-essential', 'totebag-canvas', 'folder-standard', 'notepad-spiral'],
    canvas: CORNER_ACCENT_TEMPLATE
  },
  {
    id: 'minimalist-line',
    name: 'Ligne Minimaliste',
    nameKey: 'templates.minimalistLine',
    thumbnail: '/templates/minimalist-line.svg',
    productTypes: ['tshirt-essential', 'totebag-canvas', 'folder-standard', 'mousepad-soft'],
    canvas: MINIMALIST_LINE_TEMPLATE
  },
  {
    id: 'playful-shapes',
    name: 'Formes Ludiques',
    nameKey: 'templates.playfulShapes',
    thumbnail: '/templates/playful-shapes.svg',
    productTypes: ['tshirt-essential', 'totebag-canvas', 'notepad-spiral', 'mousepad-soft'],
    canvas: PLAYFUL_SHAPES_TEMPLATE
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
