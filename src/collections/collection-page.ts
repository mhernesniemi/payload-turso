import { defaultContentFields } from "@/fields/default-content-fields";
import { revalidatePath } from "next/cache";
import { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { indexToElasticHook, removeFromElasticHook } from "./hooks/indexToElastic";

const revalidateCollectionPageHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === "create" || operation === "update" || operation === "delete") {
    revalidatePath(`/fi/collection-pages/${doc.slug}`);
    revalidatePath(`/en/collection-pages/${doc.slug}`);
  }
};

export const CollectionPage: CollectionConfig = {
  slug: "collection-pages",
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "createdBy", "updatedAt", "createdAt"],
  },
  fields: defaultContentFields,
  hooks: {
    afterChange: [indexToElasticHook, revalidateCollectionPageHook],
    afterDelete: [removeFromElasticHook],
  },
};
