import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import common from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | spacetraveling.</title>
      </Head>

      <Header />

      <main className={`${common.content} ${styles.post}`}>
        <a>
          <strong>Como utilizar Hooks</strong>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div>
            <time>
              <FiCalendar size={20} /> 15 Mar 2021
            </time>
            <span>
              <FiUser size={20} /> Joseph Oliveira
            </span>
          </div>
        </a>

        <a>
          <strong>Como utilizar Hooks</strong>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div>
            <time>
              <FiCalendar size={20} /> 15 Mar 2021
            </time>
            <span>
              <FiUser size={20} /> Joseph Oliveira
            </span>
          </div>
        </a>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
