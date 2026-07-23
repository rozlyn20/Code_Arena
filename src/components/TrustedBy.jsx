import React from 'react';
import { motion } from 'framer-motion';

export default function TrustedBy() {
  const companies = [
    {
      name: 'Google',
      logo: (
        <svg className="h-6 w-auto fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.665 0-8.472-3.882-8.472-8.514 0-4.632 3.807-8.514 8.472-8.514 2.502 0 4.414.975 5.864 2.325L21.36 1.05C19.05-1.077 15.894-2.22 12.24-2.22 5.568-2.22.12 3.19.12 9.885s5.448 12.105 12.12 12.105c6.96 0 11.58-4.89 11.58-11.79 0-.795-.075-1.56-.225-2.28H12.24z"/>
        </svg>
      ),
    },
    {
      name: 'Microsoft',
      logo: (
        <svg className="h-6 w-auto fill-current" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
        </svg>
      ),
    },
    {
      name: 'Amazon',
      logo: (
        <svg className="h-6 w-auto fill-current" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M28.4 20.8c-4.8 0-8.8 2-10.7 4.3v-3.5h-5.2v24.5h5.3v-11.9c0-5.1 3.2-7.8 7.3-7.8 3.9 0 6.1 2.3 6.1 6.6v13.1h5.3v-14.7c-.1-8.3-4.4-12.6-11.5-12.6zm34.2 0c-4.1 0-7.7 2-9.6 4.7-1.8-2.8-5.3-4.7-9.5-4.7-4.2 0-7.8 2-9.5 4.9v-4.1h-5.2v24.5h5.3v-12.9c0-4.6 2.6-7.1 6.1-7.1 3.2 0 5 2.1 5 6.1v13.9h5.3v-12.9c0-4.6 2.6-7.1 6.1-7.1 3.2 0 5.1 2.1 5.1 6.1v13.9h5.3v-14.7c0-8.3-4.3-12.7-11.5-12.7zm28.7 0c-9.1 0-15.6 6.3-15.6 12.9s6.5 12.9 15.6 12.9 15.6-6.3 15.6-12.9-6.5-12.9-15.6-12.9zm0 20.7c-5.9 0-10.1-4.1-10.1-7.8s4.2-7.8 10.1-7.8 10.1 4.1 10.1 7.8-4.2 7.8-10.1 7.8zm33.1-20.7c-9.1 0-15.6 6.3-15.6 12.9s6.5 12.9 15.6 12.9 15.6-6.3 15.6-12.9-6.5-12.9-15.6-12.9zm0 20.7c-5.9 0-10.1-4.1-10.1-7.8s4.2-7.8 10.1-7.8 10.1 4.1 10.1 7.8-4.2 7.8-10.1 7.8zm24.2-20.7c-7.9 0-13 4.2-14.4 9.1l4.7 1.8c1.1-3.2 4.4-5.7 9.2-5.7 5.1 0 8.4 2.8 8.4 7.6v1.1c-1.8-.8-4.4-1.3-7.5-1.3-7.8 0-13 3.9-13 10 0 5.6 4.4 9.4 10.3 9.4 4.8 0 8.7-2.1 10.5-5.2v4.4h5.2v-18.9c-.1-8.5-5.5-12.3-13.4-12.3zm2.5 19.3c0 3.7-2.9 6.2-6.7 6.2-3.8 0-5.8-2.1-5.8-5.2 0-3.4 2.7-5.5 7.9-5.5 1.9 0 3.6.2 4.6.6v3.9zM10.8 51.5C31.5 56.4 56.4 59 81.3 59c31 0 62.4-4 89.2-13.1 3-1 4.8-3.4 3.3-6.2-1.2-2.1-4-2.1-6.7-1.3-25.1 8.1-54.8 12.1-84.5 12.1-23.7 0-47.5-2.4-67.4-7.1-3-.7-5.6.8-5.6 3.7.1 2.1 1.7 3.8 1.2 4.4z"/>
          <path d="M172.9 33.7c-1.8 1.8-6.9 2.5-9.6 2.7-1.1.1-1.3-.7-.3-1.4 6.8-4.8 10.3-10.6 9-11.8-1.3-1.2-7.5 1.7-14.8 7.6-1 .8-1.5.1-.8-1 4.7-7.4 9.8-12.8 11.8-11.8 2.1.9.9 8.3-5.3 15.7z"/>
        </svg>
      ),
    },
    {
      name: 'Adobe',
      logo: (
        <svg className="h-6 w-auto fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.65 2.176l9.35 20.324h-6.05l-4-9.333h-4.32l5.35 11.333h-5.63l-2.65-5.65h-2.67v5.65h-4.03v-22.324h9.97zM11.66 6.333l-3.32 7.333h6.63z" />
        </svg>
      ),
    },
    {
      name: 'Atlassian',
      logo: (
        <svg className="h-6 w-auto fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.854 0c-.29 0-.547.16-.675.414L7.842 7.42c-.22.45.097.97.595.97h3.766c.274 0 .524-.143.662-.38l2.946-5.06c.264-.45-.06-.995-.578-.995h-3.38v.045zm-6.27 8.528c-.28 0-.53.15-.658.396L.078 18.064c-.21.435.1.936.58.936h6.74c.267 0 .51-.137.647-.367l3.966-6.666c.237-.397-.05-.898-.51-.898H5.584v.058zm12.54 0c-.28 0-.53.15-.658.396l-4.848 9.14c-.21.435.1.936.58.936h6.74c.267 0 .51-.137.647-.367l3.966-6.666c.237-.397-.05-.898-.51-.898h-5.918v.058z" />
        </svg>
      ),
    },
    {
      name: 'Uber',
      logo: (
        <svg className="h-5 w-auto fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 6.75v10.5c0 1.242-.98 2.25-2.188 2.25H2.188C.98 19.5 0 18.492 0 17.25V6.75C0 5.508.98 4.5 2.188 4.5h19.624C23.02 4.5 24 5.508 24 6.75zm-14.73 7.828c.456 0 .754-.265.754-.672v-3.754c0-.407-.298-.672-.754-.672h-1.63v5.1h1.63zm3.766-5.1h-1.393v5.1H13.03v-4.577h-.033L11.53 14.58h-1.016l-1.468-4.578H9.012v4.577H7.62V9.478h2.09l1.328 4.148 1.328-4.148h2.083v5.1zm4.18 5.1h-1.39v-5.1h1.39zm3.504-2.88c-.015-1.442-.892-2.316-2.222-2.316-1.332 0-2.207.874-2.222 2.316h4.444zm-4.444.832c.045 1.134.814 1.777 2.206 1.777.923 0 1.632-.348 2.01-.847l1.014.65c-.65.983-1.748 1.483-3.08 1.483-2.614 0-3.856-1.558-3.856-3.84 0-2.345 1.39-3.9 3.84-3.9 2.502 0 3.738 1.588 3.738 3.677v.8H20.28z" />
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative py-12 border-y border-white/5 bg-zinc-950/20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-8"
        >
          Built for students preparing for interviews at
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16 lg:gap-20 text-zinc-500"
        >
          {companies.map((company) => (
            <motion.div
              key={company.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05, color: '#f4f4f5' }}
              className="transition-colors duration-200 cursor-pointer flex items-center justify-center p-2"
              title={company.name}
            >
              {company.logo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
