/**
 * Generic JSON-LD Schema component for SEO
 * Renders structured data in a script tag
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({data}: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}
