import productImageOverrides from './product-image-overrides.json';

export type CanvasDimensions = {
  width: number;
  height: number;
  safeMargin: number;
  bleedMargin: number;
  dpi: number;
};

export type PriceTier = {
  minQuantity: number;
  unitPrice: number;
};

export type LeadTimeOption = {
  id: 'standard' | 'express' | string;
  labelKey: string;
  days: number;
  surchargePercent?: number;
};

export type ImprintZone = CanvasDimensions & {
  id: string;
  nameKey: string;
  descriptionKey: string;
};

export type MarkingMethod = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  setupFee: number;
  maxPantoneColors: number;
  compatibleZones: string[];
  priceTiers: PriceTier[];
};

export type Colorway = {
  id: string;
  labelKey: string;
  hex: string;
};

export type ProductCategory = 'drinkware' | 'office' | 'textile' | 'tech';

export type Product = {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  category: ProductCategory;
  heroImage: string;
  gallery: string[];
  moq: number;
  colorways: Colorway[];
  brandPalette: string[];
  imprintZones: ImprintZone[];
  methods: MarkingMethod[];
  leadTimes: LeadTimeOption[];
  defaultMethodId: string;
  defaultZoneId: string;
  defaultLeadTimeId: string;
  creationCanvas: CanvasDimensions;
  imageAttributions?: Array<{title?: string; source?: string; link?: string}>;
  imageQuery?: string;
  imageFetchedAt?: string;
};

export type ProductImageOverride = {
  heroImage?: string;
  gallery?: string[];
  attributions?: Array<{title?: string; source?: string; link?: string}>;
  fetchedAt?: string;
  query?: string;
};

type ProductImageOverrideMap = Record<string, ProductImageOverride>;

const baseProducts: Product[] = [
  {
    id: 'notepad-spiral',
    slug: 'bloc-notes-personnalises',
    nameKey: 'products.notepad.name',
    descriptionKey: 'products.notepad.description',
    category: 'office',
    heroImage:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 50,
    colorways: [
      {id: 'kraft', labelKey: 'products.notepad.colors.kraft', hex: '#cfa16a'},
      {id: 'midnight', labelKey: 'products.notepad.colors.midnight', hex: '#1f2933'},
      {id: 'coral', labelKey: 'products.notepad.colors.coral', hex: '#f97362'}
    ],
    brandPalette: ['#cfa16a', '#1f2933', '#fef3c7', '#0f172a'],
    imprintZones: [
      {
        id: 'cover',
        nameKey: 'products.notepad.zones.cover',
        descriptionKey: 'products.notepad.zones.coverDescription',
        width: 1748,
        height: 2480,
        safeMargin: 120,
        bleedMargin: 150,
        dpi: 300
      },
      {
        id: 'back',
        nameKey: 'products.notepad.zones.back',
        descriptionKey: 'products.notepad.zones.backDescription',
        width: 1748,
        height: 2480,
        safeMargin: 120,
        bleedMargin: 150,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'digital-a5-100',
        nameKey: 'products.notepad.methods.digitalA5_100.name',
        descriptionKey: 'products.notepad.methods.digitalA5_100.description',
        setupFee: 220,
        maxPantoneColors: 6,
        compatibleZones: ['cover', 'back'],
        priceTiers: [
          {minQuantity: 50, unitPrice: 49},
          {minQuantity: 100, unitPrice: 46},
          {minQuantity: 300, unitPrice: 43}
        ]
      },
      {
        id: 'digital-a4-100',
        nameKey: 'products.notepad.methods.digitalA4_100.name',
        descriptionKey: 'products.notepad.methods.digitalA4_100.description',
        setupFee: 260,
        maxPantoneColors: 6,
        compatibleZones: ['cover', 'back'],
        priceTiers: [
          {minQuantity: 50, unitPrice: 62},
          {minQuantity: 100, unitPrice: 55},
          {minQuantity: 300, unitPrice: 48.33}
        ]
      },
      {
        id: 'digital-a6-100',
        nameKey: 'products.notepad.methods.digitalA6_100.name',
        descriptionKey: 'products.notepad.methods.digitalA6_100.description',
        setupFee: 210,
        maxPantoneColors: 6,
        compatibleZones: ['cover', 'back'],
        priceTiers: [
          {minQuantity: 50, unitPrice: 26},
          {minQuantity: 200, unitPrice: 18},
          {minQuantity: 500, unitPrice: 12.8}
        ]
      },
      {
        id: 'premium-a5-150',
        nameKey: 'products.notepad.methods.premiumA5_150.name',
        descriptionKey: 'products.notepad.methods.premiumA5_150.description',
        setupFee: 280,
        maxPantoneColors: 4,
        compatibleZones: ['cover'],
        priceTiers: [
          {minQuantity: 50, unitPrice: 28},
          {minQuantity: 200, unitPrice: 25.5},
          {minQuantity: 500, unitPrice: 21.4}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 12},
      {id: 'express', labelKey: 'leadTimes.express', days: 6, surchargePercent: 18}
    ],
    defaultMethodId: 'digital-a5-100',
    defaultZoneId: 'cover',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 1748,
      height: 2480,
      safeMargin: 120,
      bleedMargin: 150,
      dpi: 300
    }
  },
  {
    id: 'notepad-skin-a5',
    slug: 'bloc-note-skin-a5',
    nameKey: 'products.notepadSkin.name',
    descriptionKey: 'products.notepadSkin.description',
    category: 'office',
    heroImage:
      'https://www.asteris.ma/wp-content/uploads/2023/10/5300-003-P.jpg',
    gallery: [
      'https://www.asteris.ma/wp-content/uploads/2023/10/5300-003-P.jpg',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 30,
    colorways: [
      {id: 'black', labelKey: 'products.notepadSkin.colors.black', hex: '#111827'},
      {id: 'white', labelKey: 'products.notepadSkin.colors.white', hex: '#f8fafc'},
      {id: 'red', labelKey: 'products.notepadSkin.colors.red', hex: '#dc2626'},
      {id: 'blue', labelKey: 'products.notepadSkin.colors.blue', hex: '#2563eb'},
      {id: 'yellow', labelKey: 'products.notepadSkin.colors.yellow', hex: '#facc15'}
    ],
    brandPalette: ['#111827', '#f8fafc', '#dc2626', '#2563eb', '#facc15'],
    imprintZones: [
      {
        id: 'cover',
        nameKey: 'products.notepadSkin.zones.cover',
        descriptionKey: 'products.notepadSkin.zones.coverDescription',
        width: 1748,
        height: 2480,
        safeMargin: 120,
        bleedMargin: 150,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'skin-a5-premium',
        nameKey: 'products.notepadSkin.methods.skinA5.name',
        descriptionKey: 'products.notepadSkin.methods.skinA5.description',
        setupFee: 250,
        maxPantoneColors: 6,
        compatibleZones: ['cover'],
        priceTiers: [
          {minQuantity: 30, unitPrice: 90},
          {minQuantity: 100, unitPrice: 79},
          {minQuantity: 300, unitPrice: 70}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 14},
      {id: 'express', labelKey: 'leadTimes.express', days: 7, surchargePercent: 18}
    ],
    defaultMethodId: 'skin-a5-premium',
    defaultZoneId: 'cover',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 1748,
      height: 2480,
      safeMargin: 120,
      bleedMargin: 150,
      dpi: 300
    }
  },
  {
    id: 'pen-s1',
    slug: 'stylos-metal-s1',
    nameKey: 'products.pen.name',
    descriptionKey: 'products.pen.description',
    category: 'office',
    heroImage:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 30,
    colorways: [
      {id: 'black', labelKey: 'products.pen.colors.black', hex: '#1f2937'},
      {id: 'white', labelKey: 'products.pen.colors.white', hex: '#f8fafc'},
      {id: 'red', labelKey: 'products.pen.colors.red', hex: '#dc2626'},
      {id: 'blue', labelKey: 'products.pen.colors.blue', hex: '#2563eb'}
    ],
    brandPalette: ['#1f2937', '#f8fafc', '#dc2626', '#2563eb'],
    imprintZones: [
      {
        id: 'barrel',
        nameKey: 'products.pen.zones.barrel',
        descriptionKey: 'products.pen.zones.barrelDescription',
        width: 900,
        height: 240,
        safeMargin: 60,
        bleedMargin: 80,
        dpi: 300
      },
      {
        id: 'clip',
        nameKey: 'products.pen.zones.clip',
        descriptionKey: 'products.pen.zones.clipDescription',
        width: 360,
        height: 200,
        safeMargin: 30,
        bleedMargin: 40,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'laser-s1',
        nameKey: 'products.pen.methods.laser.name',
        descriptionKey: 'products.pen.methods.laser.description',
        setupFee: 180,
        maxPantoneColors: 1,
        compatibleZones: ['clip', 'barrel'],
        priceTiers: [
          {minQuantity: 30, unitPrice: 14.97},
          {minQuantity: 100, unitPrice: 9.9},
          {minQuantity: 500, unitPrice: 8.58},
          {minQuantity: 1000, unitPrice: 7.89}
        ]
      },
      {
        id: 'tampo-s1',
        nameKey: 'products.pen.methods.tampo.name',
        descriptionKey: 'products.pen.methods.tampo.description',
        setupFee: 210,
        maxPantoneColors: 4,
        compatibleZones: ['barrel'],
        priceTiers: [
          {minQuantity: 30, unitPrice: 15.9},
          {minQuantity: 100, unitPrice: 10.8},
          {minQuantity: 500, unitPrice: 9.5},
          {minQuantity: 1000, unitPrice: 8.9}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 10},
      {id: 'express', labelKey: 'leadTimes.express', days: 4, surchargePercent: 15}
    ],
    defaultMethodId: 'laser-s1',
    defaultZoneId: 'barrel',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 900,
      height: 240,
      safeMargin: 60,
      bleedMargin: 80,
      dpi: 300
    }
  },
  {
    id: 'folder-standard',
    slug: 'chemise-a-rabat-classique',
    nameKey: 'products.folder.name',
    descriptionKey: 'products.folder.description',
    category: 'office',
    heroImage:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522199992904-0393226ccc0c?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 100,
    colorways: [
      {id: 'white', labelKey: 'products.folder.colors.white', hex: '#f8fafc'},
      {id: 'azure', labelKey: 'products.folder.colors.azure', hex: '#2563eb'},
      {id: 'graphite', labelKey: 'products.folder.colors.graphite', hex: '#1f2937'}
    ],
    brandPalette: ['#2563eb', '#1f2937', '#f8fafc', '#38bdf8'],
    imprintZones: [
      {
        id: 'front',
        nameKey: 'products.folder.zones.front',
        descriptionKey: 'products.folder.zones.frontDescription',
        width: 2310,
        height: 3180,
        safeMargin: 160,
        bleedMargin: 200,
        dpi: 300
      },
      {
        id: 'pocket',
        nameKey: 'products.folder.zones.pocket',
        descriptionKey: 'products.folder.zones.pocketDescription',
        width: 1600,
        height: 900,
        safeMargin: 120,
        bleedMargin: 140,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'offset-quadri',
        nameKey: 'products.folder.methods.offset.name',
        descriptionKey: 'products.folder.methods.offset.description',
        setupFee: 320,
        maxPantoneColors: 6,
        compatibleZones: ['front'],
        priceTiers: [
          {minQuantity: 100, unitPrice: 10.5},
          {minQuantity: 500, unitPrice: 9.5},
          {minQuantity: 1000, unitPrice: 8.7}
        ]
      },
      {
        id: 'digital-short',
        nameKey: 'products.folder.methods.digital.name',
        descriptionKey: 'products.folder.methods.digital.description',
        setupFee: 260,
        maxPantoneColors: 4,
        compatibleZones: ['front', 'pocket'],
        priceTiers: [
          {minQuantity: 100, unitPrice: 10.8},
          {minQuantity: 500, unitPrice: 7.1},
          {minQuantity: 1000, unitPrice: 5.9}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 14},
      {id: 'express', labelKey: 'leadTimes.express', days: 7, surchargePercent: 16}
    ],
    defaultMethodId: 'offset-quadri',
    defaultZoneId: 'front',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 2310,
      height: 3180,
      safeMargin: 160,
      bleedMargin: 200,
      dpi: 300
    }
  },
  {
    id: 'mug-ceramique',
    slug: 'mug-personnalisable-ceramique',
    nameKey: 'products.mug.name',
    descriptionKey: 'products.mug.description',
    category: 'drinkware',
    heroImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504615755583-2916b52192d4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 1,
    colorways: [
      {id: 'white', labelKey: 'products.mug.colors.white', hex: '#ffffff'},
      {id: 'black', labelKey: 'products.mug.colors.black', hex: '#111827'},
      {id: 'sunset', labelKey: 'products.mug.colors.sunset', hex: '#f97316'}
    ],
    brandPalette: ['#ffffff', '#f97316', '#0f172a', '#fde68a'],
    imprintZones: [
      {
        id: 'wrap',
        nameKey: 'products.mug.zones.wrap',
        descriptionKey: 'products.mug.zones.wrapDescription',
        width: 2700,
        height: 900,
        safeMargin: 120,
        bleedMargin: 160,
        dpi: 300
      },
      {
        id: 'logo',
        nameKey: 'products.mug.zones.logo',
        descriptionKey: 'products.mug.zones.logoDescription',
        width: 900,
        height: 900,
        safeMargin: 90,
        bleedMargin: 120,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'sublimation',
        nameKey: 'products.mug.methods.sublimation.name',
        descriptionKey: 'products.mug.methods.sublimation.description',
        setupFee: 180,
        maxPantoneColors: 6,
        compatibleZones: ['wrap', 'logo'],
        priceTiers: [
          {minQuantity: 1, unitPrice: 119},
          {minQuantity: 10, unitPrice: 49.9},
          {minQuantity: 100, unitPrice: 29.9}
        ]
      },
      {
        id: 'laser-engraved',
        nameKey: 'products.mug.methods.laser.name',
        descriptionKey: 'products.mug.methods.laser.description',
        setupFee: 210,
        maxPantoneColors: 1,
        compatibleZones: ['logo'],
        priceTiers: [
          {minQuantity: 1, unitPrice: 134.9},
          {minQuantity: 10, unitPrice: 59.9},
          {minQuantity: 100, unitPrice: 34.5}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 8},
      {id: 'express', labelKey: 'leadTimes.express', days: 3, surchargePercent: 12}
    ],
    defaultMethodId: 'sublimation',
    defaultZoneId: 'wrap',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 2700,
      height: 900,
      safeMargin: 120,
      bleedMargin: 160,
      dpi: 300
    }
  },
  {
    id: 'usb-16go',
    slug: 'cle-usb-16go-bamboo',
    nameKey: 'products.usb.name',
    descriptionKey: 'products.usb.description',
    category: 'tech',
    heroImage:
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556203250-0c514c9ac9a8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 10,
    colorways: [
      {id: 'black', labelKey: 'products.usb.colors.black', hex: '#111827'},
      {id: 'white', labelKey: 'products.usb.colors.white', hex: '#f8fafc'},
      {id: 'red', labelKey: 'products.usb.colors.red', hex: '#dc2626'},
      {id: 'blue', labelKey: 'products.usb.colors.blue', hex: '#2563eb'}
    ],
    brandPalette: ['#111827', '#f8fafc', '#dc2626', '#2563eb'],
    imprintZones: [
      {
        id: 'recto',
        nameKey: 'products.usb.zones.recto',
        descriptionKey: 'products.usb.zones.rectoDescription',
        width: 900,
        height: 350,
        safeMargin: 50,
        bleedMargin: 70,
        dpi: 300
      },
      {
        id: 'verso',
        nameKey: 'products.usb.zones.verso',
        descriptionKey: 'products.usb.zones.versoDescription',
        width: 900,
        height: 350,
        safeMargin: 50,
        bleedMargin: 70,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'laser-usb',
        nameKey: 'products.usb.methods.laser.name',
        descriptionKey: 'products.usb.methods.laser.description',
        setupFee: 240,
        maxPantoneColors: 1,
        compatibleZones: ['recto', 'verso'],
        priceTiers: [
          {minQuantity: 10, unitPrice: 129.9},
          {minQuantity: 50, unitPrice: 119.8},
          {minQuantity: 100, unitPrice: 99}
        ]
      },
      {
        id: 'uv-usb',
        nameKey: 'products.usb.methods.uv.name',
        descriptionKey: 'products.usb.methods.uv.description',
        setupFee: 260,
        maxPantoneColors: 6,
        compatibleZones: ['recto', 'verso'],
        priceTiers: [
          {minQuantity: 10, unitPrice: 134.9},
          {minQuantity: 50, unitPrice: 124},
          {minQuantity: 100, unitPrice: 104}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 9},
      {id: 'express', labelKey: 'leadTimes.express', days: 4, surchargePercent: 14}
    ],
    defaultMethodId: 'laser-usb',
    defaultZoneId: 'recto',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 900,
      height: 350,
      safeMargin: 50,
      bleedMargin: 70,
      dpi: 300
    }
  },
  {
    id: 'mousepad-soft',
    slug: 'tapis-de-souris-soft-touch',
    nameKey: 'products.mousepad.name',
    descriptionKey: 'products.mousepad.description',
    category: 'tech',
    heroImage:
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1516914943479-89db7de11d1d?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 10,
    colorways: [
      {id: 'slate', labelKey: 'products.mousepad.colors.slate', hex: '#374151'},
      {id: 'sky', labelKey: 'products.mousepad.colors.sky', hex: '#0ea5e9'},
      {id: 'sunset', labelKey: 'products.mousepad.colors.sunset', hex: '#fb7185'}
    ],
    brandPalette: ['#374151', '#0ea5e9', '#fb7185', '#f8fafc'],
    imprintZones: [
      {
        id: 'surface',
        nameKey: 'products.mousepad.zones.surface',
        descriptionKey: 'products.mousepad.zones.surfaceDescription',
        width: 2400,
        height: 2000,
        safeMargin: 140,
        bleedMargin: 180,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'sublimation-pad',
        nameKey: 'products.mousepad.methods.sublimation.name',
        descriptionKey: 'products.mousepad.methods.sublimation.description',
        setupFee: 190,
        maxPantoneColors: 6,
        compatibleZones: ['surface'],
        priceTiers: [
          {minQuantity: 10, unitPrice: 49},
          {minQuantity: 30, unitPrice: 35},
          {minQuantity: 100, unitPrice: 27.9}
        ]
      },
      {
        id: 'uv-pad',
        nameKey: 'products.mousepad.methods.uv.name',
        descriptionKey: 'products.mousepad.methods.uv.description',
        setupFee: 220,
        maxPantoneColors: 5,
        compatibleZones: ['surface'],
        priceTiers: [
          {minQuantity: 10, unitPrice: 52},
          {minQuantity: 30, unitPrice: 38},
          {minQuantity: 100, unitPrice: 30.5}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 7},
      {id: 'express', labelKey: 'leadTimes.express', days: 3, surchargePercent: 12}
    ],
    defaultMethodId: 'sublimation-pad',
    defaultZoneId: 'surface',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 2400,
      height: 2000,
      safeMargin: 140,
      bleedMargin: 180,
      dpi: 300
    }
  },
  {
    id: 'tshirt-essential',
    slug: 'tshirt-essential-coton',
    nameKey: 'products.tshirt.name',
    descriptionKey: 'products.tshirt.description',
    category: 'textile',
    heroImage:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542293787938-4d2226c92104?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 20,
    colorways: [
      {id: 'black', labelKey: 'products.tshirt.colors.black', hex: '#111827'},
      {id: 'white', labelKey: 'products.tshirt.colors.white', hex: '#ffffff'},
      {id: 'red', labelKey: 'products.tshirt.colors.red', hex: '#dc2626'},
      {id: 'blue', labelKey: 'products.tshirt.colors.blue', hex: '#2563eb'}
    ],
    brandPalette: ['#ffffff', '#1d4ed8', '#facc15', '#111827'],
    imprintZones: [
      {
        id: 'front',
        nameKey: 'products.tshirt.zones.front',
        descriptionKey: 'products.tshirt.zones.frontDescription',
        width: 3000,
        height: 3600,
        safeMargin: 220,
        bleedMargin: 260,
        dpi: 300
      },
      {
        id: 'back',
        nameKey: 'products.tshirt.zones.back',
        descriptionKey: 'products.tshirt.zones.backDescription',
        width: 3200,
        height: 3600,
        safeMargin: 220,
        bleedMargin: 260,
        dpi: 300
      },
      {
        id: 'sleeve',
        nameKey: 'products.tshirt.zones.sleeve',
        descriptionKey: 'products.tshirt.zones.sleeveDescription',
        width: 900,
        height: 2400,
        safeMargin: 120,
        bleedMargin: 150,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'silkscreen-tee',
        nameKey: 'products.tshirt.methods.silkscreen.name',
        descriptionKey: 'products.tshirt.methods.silkscreen.description',
        setupFee: 420,
        maxPantoneColors: 5,
        compatibleZones: ['front', 'back'],
        priceTiers: [
          {minQuantity: 20, unitPrice: 115},
          {minQuantity: 50, unitPrice: 90},
          {minQuantity: 100, unitPrice: 80}
        ]
      },
      {
        id: 'embroidery-tee',
        nameKey: 'products.tshirt.methods.embroidery.name',
        descriptionKey: 'products.tshirt.methods.embroidery.description',
        setupFee: 460,
        maxPantoneColors: 8,
        compatibleZones: ['front', 'sleeve'],
        priceTiers: [
          {minQuantity: 20, unitPrice: 150},
          {minQuantity: 50, unitPrice: 115},
          {minQuantity: 100, unitPrice: 99}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 15},
      {id: 'express', labelKey: 'leadTimes.express', days: 7, surchargePercent: 18}
    ],
    defaultMethodId: 'silkscreen-tee',
    defaultZoneId: 'front',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 3200,
      height: 3600,
      safeMargin: 220,
      bleedMargin: 260,
      dpi: 300
    }
  },
  {
    id: 'totebag-canvas',
    slug: 'tote-bag-coton-epais',
    nameKey: 'products.totebag.name',
    descriptionKey: 'products.totebag.description',
    category: 'textile',
    heroImage:
      'https://images.unsplash.com/photo-1522199992904-0393226ccc0c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528701800489-20be3c005bc1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
    ],
    moq: 50,
    colorways: [
      {id: 'natural', labelKey: 'products.totebag.colors.natural', hex: '#f5f1e6'},
      {id: 'black', labelKey: 'products.totebag.colors.black', hex: '#111827'},
      {id: 'navy', labelKey: 'products.totebag.colors.navy', hex: '#1e3a8a'}
    ],
    brandPalette: ['#f5f1e6', '#1e3a8a', '#2563eb', '#111827'],
    imprintZones: [
      {
        id: 'front',
        nameKey: 'products.totebag.zones.front',
        descriptionKey: 'products.totebag.zones.frontDescription',
        width: 2600,
        height: 2800,
        safeMargin: 200,
        bleedMargin: 240,
        dpi: 300
      },
      {
        id: 'back',
        nameKey: 'products.totebag.zones.back',
        descriptionKey: 'products.totebag.zones.backDescription',
        width: 2600,
        height: 2800,
        safeMargin: 200,
        bleedMargin: 240,
        dpi: 300
      }
    ],
    methods: [
      {
        id: 'screenprint-tote',
        nameKey: 'products.totebag.methods.screenprint.name',
        descriptionKey: 'products.totebag.methods.screenprint.description',
        setupFee: 280,
        maxPantoneColors: 3,
        compatibleZones: ['front', 'back'],
        priceTiers: [
          {minQuantity: 50, unitPrice: 35},
          {minQuantity: 100, unitPrice: 31.5},
          {minQuantity: 300, unitPrice: 28}
        ]
      },
      {
        id: 'digital-tote',
        nameKey: 'products.totebag.methods.digital.name',
        descriptionKey: 'products.totebag.methods.digital.description',
        setupFee: 300,
        maxPantoneColors: 6,
        compatibleZones: ['front', 'back'],
        priceTiers: [
          {minQuantity: 50, unitPrice: 38},
          {minQuantity: 100, unitPrice: 33},
          {minQuantity: 300, unitPrice: 30}
        ]
      }
    ],
    leadTimes: [
      {id: 'standard', labelKey: 'leadTimes.standard', days: 12},
      {id: 'express', labelKey: 'leadTimes.express', days: 6, surchargePercent: 15}
    ],
    defaultMethodId: 'screenprint-tote',
    defaultZoneId: 'front',
    defaultLeadTimeId: 'standard',
    creationCanvas: {
      width: 2600,
      height: 2800,
      safeMargin: 200,
      bleedMargin: 240,
      dpi: 300
    }
  }
];

function normalizeUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeGallery(candidate: string[] | undefined, hero: string): string[] {
  const unique = new Set<string>();
  if (Array.isArray(candidate)) {
    candidate.forEach((item) => {
      const url = normalizeUrl(item);
      if (!url || url === hero) return;
      unique.add(url);
    });
  }

  if (unique.size === 0) {
    return [];
  }

  return Array.from(unique);
}

const imageOverrides = (productImageOverrides ?? {}) as ProductImageOverrideMap;

function applyProductImageOverrides(collection: Product[]): Product[] {
  return collection.map((product) => {
    const override = imageOverrides[product.slug];
    if (!override) return product;

    const heroImage = normalizeUrl(override.heroImage) ?? product.heroImage;
    const overrideGallery = sanitizeGallery(override.gallery, heroImage);
    const fallbackGallery = overrideGallery.length > 0 ? overrideGallery : product.gallery;
    const gallery = fallbackGallery.filter((item) => item && item !== heroImage);
    const fallbackFromBase = product.gallery.filter((item) => item && item !== heroImage);
    const finalGallery = gallery.length > 0 ? Array.from(new Set(gallery)) : fallbackFromBase;

    return {
      ...product,
      heroImage,
      gallery: finalGallery,
      imageAttributions: override.attributions ?? product.imageAttributions,
      imageQuery: override.query ?? product.imageQuery,
      imageFetchedAt: override.fetchedAt ?? product.imageFetchedAt
    };
  });
}

export const products: Product[] = applyProductImageOverrides(baseProducts);

export function getProductImageOverride(slug: string) {
  return imageOverrides[slug];
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
