'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { Heart, PlusCircle, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Modal, Form, Input, Select, Button, Tag, Tooltip } from 'antd';

interface IntentionItem {
  id: string;
  authorName: string;
  category: string;
  categoryKey: string;
  text: string;
  prayedCount: number;
  hasPrayed: boolean;
  timeAgo: string;
}

const INITIAL_INTENTIONS: IntentionItem[] = [
  {
    id: 'int-1',
    authorName: 'Maria Helena (Paróquia Santa Rita)',
    category: 'Saúde & Cura',
    categoryKey: 'categoryHealth',
    text: 'Peço orações pela recuperação do meu irmão Carlos após sua cirurgia cardíaca. Que Nossa Senhora o envolva em Seu manto.',
    prayedCount: 38,
    hasPrayed: false,
    timeAgo: 'Há 2 horas'
  },
  {
    id: 'int-2',
    authorName: 'Pe. Antônio M. (Diocese de Curitiba)',
    category: 'Vocação & Discernimento',
    categoryKey: 'categoryVocation',
    text: 'Pelos nossos seminaristas e por novas santas vocações sacerdotais e religiosas em nossa arquidiocese.',
    prayedCount: 64,
    hasPrayed: true,
    timeAgo: 'Há 4 horas'
  },
  {
    id: 'int-3',
    authorName: 'João e Ana Beatriz',
    category: 'Família & Matrimônio',
    categoryKey: 'categoryFamily',
    text: 'Pela paz e reconciliação em nosso lar e pela perseverança na oração do Terço em família todos os dias.',
    prayedCount: 29,
    hasPrayed: false,
    timeAgo: 'Há 5 horas'
  },
  {
    id: 'int-4',
    authorName: 'Gabriel S.',
    category: 'Conversão & Retorno à Igreja',
    categoryKey: 'categoryConversion',
    text: 'Pela conversão do meu melhor amigo que se afastou dos Sacramentos há 10 anos. Que o Espírito Santo toque o seu coração.',
    prayedCount: 52,
    hasPrayed: false,
    timeAgo: 'Há 7 horas'
  },
  {
    id: 'int-5',
    authorName: 'Lúcia de Fátima',
    category: 'Pelos Falecidos (Almas do Purgatório)',
    categoryKey: 'categoryDeceased',
    text: 'Pelo descanso eterno da alma do meu falecido avô José. Que contemple a face de Deus no Céu.',
    prayedCount: 41,
    hasPrayed: false,
    timeAgo: 'Há 9 horas'
  },
  {
    id: 'int-6',
    authorName: 'Comunidade Missionária São José',
    category: 'Ação de Graças',
    categoryKey: 'categoryThanksgiving',
    text: 'Agradecimento por uma grande graça de saúde alcançada através da novena à Divina Misericórdia!',
    prayedCount: 88,
    hasPrayed: true,
    timeAgo: 'Há 1 dia'
  }
];

export default function IntentionsPage() {
  const t = useTranslations('Intentions');
  const tCommon = useTranslations('Common');
  const [intentions, setIntentions] = React.useState<IntentionItem[]>(INITIAL_INTENTIONS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [form] = Form.useForm();

  const handlePrayedClick = (id: string) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15]);
      } catch (e) {}
    }

    setIntentions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.hasPrayed;
          return {
            ...item,
            hasPrayed: newStatus,
            prayedCount: newStatus ? item.prayedCount + 1 : item.prayedCount - 1
          };
        }
        return item;
      })
    );
  };

  const handlePostIntention = (values: any) => {
    const categoryNames: Record<string, string> = {
      categoryHealth: t('categoryHealth'),
      categoryVocation: t('categoryVocation'),
      categoryFamily: t('categoryFamily'),
      categoryConversion: t('categoryConversion'),
      categoryDeceased: t('categoryDeceased'),
      categoryThanksgiving: t('categoryThanksgiving')
    };

    const chosenCat = values.selectedCategory || 'categoryHealth';

    const newItem: IntentionItem = {
      id: `int-${Date.now()}`,
      authorName: values.authorInput?.trim() || 'Irmão em Cristo',
      category: categoryNames[chosenCat] || t('categoryHealth'),
      categoryKey: chosenCat,
      text: values.textInput?.trim() || '',
      prayedCount: 1,
      hasPrayed: true,
      timeAgo: 'Agora mesmo'
    };

    setIntentions([newItem, ...intentions]);
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge="Pilar III — Communio"
        icon={<Heart className="w-4 h-4 text-purple-500 fill-purple-500" />}
        rightAction={
          <Button
            type="primary"
            size="large"
            icon={<PlusCircle className="w-5 h-5 mr-1" />}
            onClick={() => setIsModalOpen(true)}
            className="px-6 font-bold shadow-md bg-sacred-gold hover:bg-sacred-gold-light border-none"
          >
            {t('btnSubmit')}
          </Button>
        }
      />

      {/* Serenity Notice Banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 text-xs sm:text-sm font-medium shadow-xs">
        <ShieldCheck className="w-5 h-5 text-purple-500 flex-shrink-0" />
        <p>
          <strong className="font-bold">Silêncio Sagrado:</strong> Para preservar a paz fraterna e evitar debates ou opiniões particulares, este muro funciona exclusivamente por intercessão orante (`{tCommon('prayedForYou')}`).
        </p>
      </div>

      {/* Intentions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {intentions.map((item) => (
          <EditorialCard
            key={item.id}
            className="flex flex-col justify-between gap-5 border-slate-200 dark:border-slate-700 transition-all hover:border-sacred-gold/60 hover:shadow-md"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <Tag color="#d4af37" className="font-bold px-3 py-1 rounded-full text-white border-none">
                  {item.category}
                </Tag>
                <span className="text-slate-500 dark:text-slate-400 font-medium">{item.timeAgo}</span>
              </div>
              
              <p className="font-serif text-base text-slate-900 dark:text-white leading-relaxed pt-1 font-medium">
                &ldquo;{item.text}&rdquo;
              </p>
              
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 italic">
                — {item.authorName}
              </span>
            </div>

            {/* Prayed Button Action Strip with Antd Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                <strong className="text-sacred-gold font-extrabold text-sm">{item.prayedCount}</strong> {tCommon('peoplePrayed')}
              </span>

              <Tooltip title={item.hasPrayed ? 'Você já rezou por esta intenção hoje' : 'Interceder em silêncio'}>
                <Button
                  type={item.hasPrayed ? 'default' : 'primary'}
                  icon={item.hasPrayed ? <Check className="w-4 h-4 text-emerald-600 stroke-[3] inline mr-1" /> : <Sparkles className="w-4 h-4 inline mr-1" />}
                  onClick={() => handlePrayedClick(item.id)}
                  className={`px-4 font-bold ${
                    item.hasPrayed
                      ? 'border-emerald-600 text-emerald-600 bg-emerald-500/10'
                      : 'bg-sacred-gold hover:bg-sacred-gold-light text-white border-none shadow-xs'
                  }`}
                >
                  {item.hasPrayed ? 'Em oração por você' : tCommon('prayedForYou')}
                </Button>
              </Tooltip>
            </div>
          </EditorialCard>
        ))}
      </div>

      {/* Ant Design Submit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={<span className="font-serif font-bold text-xl text-slate-900 dark:text-white">{t('modalTitle')}</span>}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePostIntention}
          initialValues={{ selectedCategory: 'categoryHealth' }}
          className="flex flex-col gap-3 pt-4"
        >
          <Form.Item
            name="authorInput"
            label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Seu Nome ou Paróquia (Opcional)</span>}
          >
            <Input size="large" placeholder="Ex: João Silva (Paróquia N. Sra. do Carmo)" className="text-sm font-medium" />
          </Form.Item>

          <Form.Item
            name="selectedCategory"
            label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{t('modalCategoryLabel')}</span>}
            rules={[{ required: true, message: 'Selecione uma categoria espiritual' }]}
          >
            <Select size="large" className="text-sm font-medium">
              <Select.Option value="categoryHealth">{t('categoryHealth')}</Select.Option>
              <Select.Option value="categoryVocation">{t('categoryVocation')}</Select.Option>
              <Select.Option value="categoryFamily">{t('categoryFamily')}</Select.Option>
              <Select.Option value="categoryConversion">{t('categoryConversion')}</Select.Option>
              <Select.Option value="categoryDeceased">{t('categoryDeceased')}</Select.Option>
              <Select.Option value="categoryThanksgiving">{t('categoryThanksgiving')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="textInput"
            label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{t('modalTextLabel')}</span>}
            rules={[{ required: true, message: 'Escreva sua intenção de oração' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder={t('modalTextPlaceholder')}
              className="resize-none text-sm font-medium"
            />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-2">
            <Button size="large" onClick={() => setIsModalOpen(false)} className="font-bold">
              Cancelar
            </Button>
            <Button type="primary" size="large" htmlType="submit" className="font-bold px-6 bg-sacred-gold hover:bg-sacred-gold-light border-none shadow-md gold-glow">
              {t('btnPost')}
            </Button>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
}
