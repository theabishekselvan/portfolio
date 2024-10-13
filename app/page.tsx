import Intro from '@/components/intro'
import NewsletterForm from '@/components/newsletter-form'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import Head from 'next/head';

export default function Home() {
  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <Head>
          <title>Abishek Selvan</title>
          <meta name="home page" content="This is the home page of your site" />
        </Head>

        <Intro />

        <RecentPosts />

        <RecentProjects />

        <NewsletterForm />

      </div>
    </section>
  )
}
