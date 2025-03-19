import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import FrontPageTemplate from "@/components/templates/FrontPageTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import configPromise from "@payload-config";
// import * as Sentry from "@sentry/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate at most once per hour

type Props = {
  params: Promise<{ locale: "fi" | "en" }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getFrontPage({ params }: Props) {
  try {
    const { locale } = await params;
    const isDraftMode = false; // Simplified for performance - no draft mode in static rendering

    const payload = await getPayload({
      config: configPromise,
    });

    const frontPage = await payload.findGlobal({
      slug: "front-page",
      locale: locale,
      draft: isDraftMode,
    });

    return { frontPage: frontPage, error: null };
  } catch (error) {
    console.error("Error fetching page:", error);
    // Sentry.captureException(error);
    return { frontPage: null, error: error as Error };
  }
}

export default async function FrontPage(props: Props) {
  const { frontPage, error } = await getFrontPage(props);

  if (error) {
    return <ErrorTemplate error={error} />;
  }
  if (!frontPage) {
    notFound();
  }

  return (
    <Container>
      <Header />
      <FrontPageTemplate content={frontPage} />
    </Container>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const { frontPage } = await getFrontPage(props);
    const openGraphImages = prepareOpenGraphImages(frontPage?.meta?.image);

    return {
      title: frontPage?.meta?.title || SITE_NAME,
      description: frontPage?.meta?.description,
      openGraph: openGraphImages ? { images: openGraphImages } : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Sentry.captureException(error);
    return {
      title: SITE_NAME,
    };
  }
}
