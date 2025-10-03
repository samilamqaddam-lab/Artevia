import {packs, getPackById} from '@/lib/packs';
import {products} from '@/lib/products';

describe('packs definitions', () => {
  it('resolves packs by id', () => {
    packs.forEach((pack) => {
      expect(getPackById(pack.id)).toBeDefined();
    });
  });

  it('references existing products and options', () => {
    packs.forEach((pack) => {
      pack.items.forEach((line) => {
        const product = products.find((candidate) => candidate.id === line.productId);
        expect(product).toBeDefined();
        if (!product) {
          return;
        }

        if (line.methodId) {
          const method = product.methods.find((candidate) => candidate.id === line.methodId);
          expect(method).toBeDefined();
        }

        if (line.zoneId) {
          const zone = product.imprintZones.find((candidate) => candidate.id === line.zoneId);
          expect(zone).toBeDefined();
        }

        if (line.leadTimeId) {
          const leadTime = product.leadTimes.find((candidate) => candidate.id === line.leadTimeId);
          expect(leadTime).toBeDefined();
        }

        if (line.colorwayId) {
          const colorway = product.colorways.find((candidate) => candidate.id === line.colorwayId);
          expect(colorway).toBeDefined();
        }
      });
    });
  });

  it('exposes valid discount metadata when available', () => {
    packs.forEach((pack) => {
      if (!pack.discount) {
        return;
      }
      expect(pack.discount.code).toMatch(/^[A-Z0-9-]+$/u);
      expect(pack.discount.percent).toBeGreaterThan(0);
      expect(typeof pack.discount.description).toBe('string');
      expect(pack.discount.description.length).toBeGreaterThan(0);
    });
  });
});
