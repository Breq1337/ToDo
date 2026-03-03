/**
 * JSON-LD for Organization / LocalBusiness / WebSite — official data only.
 */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.todogreen.com.br/#organization",
      name: "To Do Green",
      url: "https://www.todogreen.com.br",
      logo: "https://www.todogreen.com.br/images/todo_logo-21.jpeg",
      description: "Transportadora verde que realiza 100% das entregas com veículos elétricos. Delivery sem emissão de CO2.",
      email: "atendimento@todogreen.com.br",
      areaServed: { "@type": "Place", name: "Grande São Paulo e Sorocaba" },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.todogreen.com.br/#website",
      url: "https://www.todogreen.com.br",
      name: "To Do Green",
      publisher: { "@id": "https://www.todogreen.com.br/#organization" },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
