import { getTranslations } from 'next-intl/server';

const Loading = async () => {
  const t = await getTranslations('common');

  return (
    <p role="status" className="p-2">
      {t('loading')}
    </p>
  );
};

export default Loading;
