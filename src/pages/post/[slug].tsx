/* eslint-disable react/no-danger */
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import common from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  function getAllWordsFromText(text: string) {
    return text.trim().split(/\s+/).length;
  }

  function readTimeEstimate() {
    const wordsPerMinute = 200;

    const sumAllWords = post.data.content.reduce((acc, content) => {
      return (
        acc +
        getAllWordsFromText(content.heading) +
        getAllWordsFromText(RichText.asText(content.body))
      );
    }, 0);

    return Math.ceil(sumAllWords / wordsPerMinute);
  }

  if (router.isFallback) {
    return (
      <div className={styles.loading}>
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling.</title>
      </Head>
      <Header />
      <img
        src={post.data.banner.url}
        alt={`Banner ${post.data.title}`}
        className={styles.banner}
      />

      <article className={`${common.content} ${styles.post}`}>
        <div className={styles.postHeader}>
          <strong>{post.data.title}</strong>
          <div className={common.postInfo}>
            <time>
              <FiCalendar size={20} />{' '}
              {format(new Date(post.first_publication_date), 'dd LLL yyyy', {
                locale: ptBR,
              })}
            </time>
            <span>
              <FiUser size={20} /> {post.data.author}
            </span>
            <span>
              <FiClock size={20} /> {readTimeEstimate()} min
            </span>
          </div>
        </div>

        {post.data.content.map(({ heading, body }) => (
          <div key={heading} className={styles.postContent}>
            <h3>{heading}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(body),
              }}
            />
          </div>
        ))}
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
    pageSize: 5,
  });

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  const prismic = getPrismicClient({});

  const response = await prismic.getByUID('posts', String(slug));

  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      author: response.data.author,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      title: response.data.title,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 10,
  };
};
