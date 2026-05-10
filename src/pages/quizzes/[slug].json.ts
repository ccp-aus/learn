import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const quizzes = await getCollection("quizzes");
  return quizzes.map((q) => ({
    params: { slug: q.data.slug },
    props: { quiz: q.data },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { quiz } = props as { quiz: unknown };
  return new Response(JSON.stringify(quiz), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
};
