import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { CathedralHeader } from '@/components/layout/CathedralHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PrototypeNoticeModal } from '@/components/common/PrototypeNoticeModal';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex flex-col min-h-screen">
        <CathedralHeader />
        <PrototypeNoticeModal />
        <div className="flex-grow">{children}</div>
        <PublicFooter />
      </div>
    </NextIntlClientProvider>
  );
}
