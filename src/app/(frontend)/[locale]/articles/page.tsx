import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { ListingTemplate } from "@/components/templates/ListingTemplate";
import { SITE_NAME } from "@/lib/constants";
import configPromise from "@payload-config";
import { getTranslations } from "next-intl/server";
import { getPayload } from "payload";

type Params = Promise<{ locale: "fi" | "en" }>;

export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    const { locale } = await params;
    const searchParamsResolved = await searchParams;
    const currentPage = Number(searchParamsResolved.page) || 1;
    const perPage = 40;

    const payload = await getPayload({
      config: configPromise,
    });

    const {
      docs: articles,
      totalPages,
      totalDocs,
    } = await payload.find({
      collection: "articles",
      sort: "-publishedDate",
      locale: locale,
      draft: false,
      limit: perPage,
      page: currentPage,
      depth: 0,
    });

    return (
      <ListingTemplate
        articles={articles}
        totalDocs={totalDocs}
        totalPages={totalPages}
        currentPage={currentPage}
        locale={locale}
      />
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return <ErrorTemplate error={error as Error} />;
  }
}

export async function generateMetadata() {
  const t = await getTranslations("articles");

  return {
    title: `${t("title")} | ${SITE_NAME}`,
  };
}
