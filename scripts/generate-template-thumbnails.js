/**
 * Generate template thumbnails using fabric.js
 * Run with: node scripts/generate-template-thumbnails.js
 */

const fs = require('fs');
const path = require('path');
const {createCanvas} = require('canvas');
const fabric = require('fabric').fabric;

// Import templates (using require for Node.js compatibility)
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

const TEMPLATES = {
  'logo-center': LOGO_CENTER_TEMPLATE,
  'text-minimal': TEXT_MINIMAL_TEMPLATE,
  'vintage': VINTAGE_TEMPLATE,
  'modern-badge': MODERN_BADGE_TEMPLATE,
  'creative-colorful': CREATIVE_COLORFUL_TEMPLATE
};

// Canvas dimensions
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;
const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 240;

async function generateThumbnail(templateId, templateData) {
  console.log(`Generating thumbnail for ${templateId}...`);

  // Create a canvas
  const canvasElement = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const canvas = new fabric.Canvas(canvasElement);

  // Set background
  canvas.backgroundColor = templateData.background || '#ffffff';

  // Load JSON and render
  await new Promise((resolve, reject) => {
    canvas.loadFromJSON(templateData, () => {
      canvas.renderAll();
      resolve();
    });
  });

  // Generate thumbnail by scaling down
  const thumbnailCanvas = createCanvas(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
  const ctx = thumbnailCanvas.getContext('2d');

  ctx.drawImage(
    canvasElement,
    0, 0, CANVAS_WIDTH, CANVAS_HEIGHT,
    0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT
  );

  // Save to file
  const outputDir = path.join(__dirname, '..', 'public', 'templates');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
  }

  const outputPath = path.join(outputDir, `${templateId}.png`);
  const buffer = thumbnailCanvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`✓ Saved thumbnail: ${outputPath}`);
}

async function main() {
  console.log('🎨 Generating template thumbnails...\n');

  for (const [templateId, templateData] of Object.entries(TEMPLATES)) {
    try {
      await generateThumbnail(templateId, templateData);
    } catch (error) {
      console.error(`✗ Error generating ${templateId}:`, error);
    }
  }

  console.log('\n✨ All thumbnails generated successfully!');
}

main().catch(console.error);
