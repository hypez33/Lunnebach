import { site } from "@/content/site";

/** JSON-LD HomeAndConstructionBusiness (Unterart von LocalBusiness) */
export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${site.url}/#business`,
    name: site.legalName,
    alternateName: "Tischlerei Lunnebach",
    slogan: site.claim,
    description: site.description,
    url: site.url,
    telephone: site.phone.intl,
    email: site.email,
    image: `${site.url}/images/team/team-lunnebach.jpg`,
    logo: `${site.url}/images/brand/logo-2.png`,
    founder: { "@type": "Person", name: "Rolf Lunnebach", jobTitle: "Tischlermeister" },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.geo.lat, longitude: site.address.geo.lng },
    openingHoursSpecification: site.openingHoursSpec.map((o) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: o.days,
      opens: o.opens,
      closes: o.closes,
    })),
    areaServed: { "@type": "City", name: "Koblenz" },
    sameAs: [site.cabinet.url],
  };
}

/** Sicheres Serialisieren für <script type="application/ld+json"> */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
