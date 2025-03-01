import { seoPlugin } from "@payloadcms/plugin-seo";
import { Field } from "payload";

export const seoConfig = seoPlugin({
  collections: ["articles", "news", "collection-page"],
  uploadsCollection: "media",
  generateTitle: ({ doc }) => {
    return doc?.title ? `${doc.title}` : "";
  },
  generateDescription: ({ doc }) => {
    if (doc?.excerpt) return doc.excerpt;
    return "";
  },
  generateURL: ({ doc, collectionSlug }) => {
    if (doc?.slug) {
      if (collectionSlug === "articles") {
        return `${process.env.NEXT_PUBLIC_ROOT_URL}/articles/${doc.slug}`;
      }
      if (collectionSlug === "news") {
        return `${process.env.NEXT_PUBLIC_ROOT_URL}/news/${doc.slug}`;
      }
      return `${process.env.NEXT_PUBLIC_ROOT_URL}/${collectionSlug}/${doc.slug}`;
    }
    return "";
  },
  fields: ({ defaultFields }) => {
    return [
      {
        type: "collapsible",
        label: "SEO fields",
        admin: {
          initCollapsed: true,
        },
        fields: defaultFields,
      },
    ];
  },
});

export const seoField: Field = {
  label: "SEO",
  type: "collapsible",
  fields: [
    {
      name: "meta",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description: "SEO title (recommended max 60 characters)",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description: "SEO description (recommended max 160 characters)",
          },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "SEO image",
          },
        },
      ],
    },
  ],
};
