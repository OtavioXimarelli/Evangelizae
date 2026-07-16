'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { Bot, Send, ShieldAlert, Sparkles, BookCheck, HelpCircle } from 'lucide-react';
import { Input, Button, Tag, Alert } from 'antd';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  isGuardrailTriggered?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Paz e bem! Sou o Assistente Magisterial do Evangelizae. Minha missão é responder suas dúvidas teológicas, bíblicas e litúrgicas com absoluta fidelidade e fundamentação nas Sagradas Escrituras, no Catecismo da Igreja Católica (CIC) e nos documentos oficiais do Vaticano. Como posso auxiliá-lo em sua formação doutrinal hoje?',
    sources: ['Catecismo da Igreja Católica', 'Sagradas Escrituras', 'Magistério Pontifício']
  }
];

const SUGGESTED_QUESTIONS = [
  {
    q: 'Por que os católicos veneram a Santíssima Virgem Maria e os Santos?',
    ans: 'A Igreja Católica ensina claramente a distinção teológica entre o culto de Latria (adoração debida única e exclusivamente a Deus) e o culto de Dulia (veneração aos santos por terem alcançado a glória celestiais por graça divina) e Hiperdulia (veneração especial à Santíssima Virgem Maria por ser a Mãe de Deus - Theotokos).\n\nComo nos ensina o Catecismo da Igreja Católica no parágrafo 971: "Todas as gerações me chamarão bem-aventurada" (Lc 1, 48). A piedade da Igreja para com a Santíssima Virgem é intrínseca ao culto cristão.',
    sources: ['CIC §971', 'Lucas 1, 48', 'Lumen Gentium §66']
  },
  {
    q: 'O que ensina a Igreja sobre a Presença Real de Cristo na Santíssima Eucaristia?',
    ans: 'A Igreja Católica professa como dogma de fé que, na Santíssima Eucaristia, estão contidos verdadeira, real e substancialmente o Corpo e o Sangue, conjuntamente com a alma e a divindade de Nosso Senhor Jesus Cristo (Transubstanciação).\n\nO Catecismo (CIC 1374) afirma: "O modo da presença de Cristo sob as espécies eucarísticas é único. Ele eleva a Eucaristia acima de todos os sacramentos e faz dela a perfeição da vida espiritual e o fim para o qual tendem todos os sacramentos".',
    sources: ['CIC §1374', 'Concílio de Trento (DS 1651)', 'João 6, 53-58']
  },
  {
    q: 'Como devo me preparar para fazer uma boa e santa Confissão?',
    ans: 'Para realizar uma boa Confissão Sacramental (ou Sacramento da Reconciliação), a Igreja recomenda cinco passos essenciais (CIC 1450-1460):\n\n1. Exame de Consciência diligente diante de Deus;\n2. Arrepndimento sincero e dor dos pecados (Contrição);\n3. Firme propósito de emenda (não voltar a pecar);\n4. Confissão oral dos pecados ao sacerdote paroquial;\n5. Cumprimento da penitência imposta pelo confessor.',
    sources: ['CIC §1450-1460', 'Código de Direito Canônico Cân. 987', 'João 20, 22-23']
  }
];

export default function AiAssistantPage() {
  const t = useTranslations('Ai');
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const match = SUGGESTED_QUESTIONS.find((item) =>
        item.q.toLowerCase().includes(userText.toLowerCase()) || userText.toLowerCase().includes(item.q.toLowerCase().substring(0, 15))
      );

      if (match) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: match.ans,
            sources: match.sources
          }
        ]);
      } else if (
        userText.toLowerCase().includes('opinião') ||
        userText.toLowerCase().includes('revelação particular') ||
        userText.toLowerCase().includes('quando será o fim do mundo') ||
        userText.toLowerCase().includes('loto') ||
        userText.toLowerCase().includes('aposta')
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: 'Não encontrei uma fundamentação doutrinal direta nos documentos oficiais do Magistério da Igreja Católica indexados em nossa base teológica (Índice de Similaridade < 0.75) para responder a esta especulação ou consulta particular.\n\nPara garantir a pureza da fé e a paz espiritual, abstemo-nos de opiniões particulares ou especulações teológicas sem aprovação eclesial. Recomendo consultar o seu sacerdote paroquial ou o Catecismo da Igreja Católica.',
            isGuardrailTriggered: true
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: `Sobre a sua consulta ("${userText}"), o ensinamento sagrado da Igreja Católica orienta que toda verdade revelada encontra seu pleno sentido na Tradição Apostólica e nas Sagradas Escrituras interpretadas sob a luz do Magistério.\n\n"A sagrada Tradição e a sagrada Escritura constituem um só depósito sagrado da palavra de Deus, confiado à Igreja" (Dei Verbum, 10). Em tudo, busquemos a santidade de vida e a fidelidade aos mandamentos do Senhor.`,
            sources: ['Dei Verbum §10', 'CIC §80-82']
          }
        ]);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestedClick = (question: string) => {
    setInput(question);
  };

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge="Pilar II — Veritas (Formação Doutrinal)"
        icon={<Bot className="w-4 h-4 text-sacred-gold" />}
      />

      {/* Ant Design Guardrail Warning Alert Banner */}
      <Alert
        message={t('guardrailWarning')}
        type="warning"
        showIcon
        icon={<ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        className="rounded-2xl border border-amber-500/40 bg-amber-500/15 text-xs sm:text-sm font-medium shadow-xs"
      />

      {/* Main Layout: Chat Interface & Suggested Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Chat Box (2 cols) */}
        <EditorialCard className="lg:col-span-2 flex flex-col justify-between p-4 sm:p-6 h-[640px] border-slate-200 dark:border-slate-700">
          
          {/* Message Log */}
          <div className="flex-grow overflow-y-auto flex flex-col gap-4 pr-2 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-2 max-w-[92%] sm:max-w-[84%] rounded-2xl p-4 sm:p-5 ${
                  msg.sender === 'user'
                    ? 'self-end bg-sacred-gold text-white font-semibold rounded-br-none shadow-md'
                    : msg.isGuardrailTriggered
                    ? 'self-start bg-amber-500/15 border border-amber-500/40 text-amber-950 dark:text-amber-100 rounded-bl-none shadow-sm font-medium'
                    : 'self-start bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-bl-none shadow-sm font-medium'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-wider opacity-80">
                  <span>{msg.sender === 'user' ? 'Você' : 'Assistente Magisterial'}</span>
                  {msg.isGuardrailTriggered && (
                    <Tag color="warning" className="font-extrabold flex items-center gap-1 border-none m-0">
                      ⚠️ Guardrail Ativado
                    </Tag>
                  )}
                </div>

                <div className="font-serif text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Sources Citation Badge with Antd Tag */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2.5 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-1.5 text-xs">
                    <BookCheck className="w-3.5 h-3.5 text-sacred-gold" />
                    <span className="font-bold text-[11px] uppercase text-sacred-gold mr-1">{t('sourcesTitle')}</span>
                    {msg.sources.map((src, i) => (
                      <Tag
                        key={i}
                        color="#d4af37"
                        className="font-bold text-[11px] rounded-md text-white border-none shadow-xs"
                      >
                        [{src}]
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="self-start bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-4 h-4 animate-spin text-sacred-gold" />
                <span>Consultando o Catecismo da Igreja Católica e Documentos Magisteriais...</span>
              </div>
            )}
          </div>

          {/* Input Form with Antd Input and Button */}
          <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <Input
              size="large"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              className="flex-grow text-sm font-medium"
            />
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              disabled={isLoading || !input.trim()}
              icon={<Send className="w-4 h-4" />}
              className="px-6 font-bold shadow-md bg-sacred-gold hover:bg-sacred-gold-light border-none gold-glow flex items-center gap-2"
            >
              Perguntar
            </Button>
          </form>
        </EditorialCard>

        {/* Suggested Questions Sidebar with Antd Button */}
        <div className="flex flex-col gap-6">
          <EditorialCard className="p-5 flex flex-col gap-4 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sacred-gold border-b border-slate-200 dark:border-slate-700 pb-3">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Perguntas Frequentes de Formação
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Clique em qualquer questão doutrinal abaixo para consultar imediatamente a resposta fundamentada:
            </p>

            <div className="flex flex-col gap-2.5">
              {SUGGESTED_QUESTIONS.map((item, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleSuggestedClick(item.q)}
                  block
                  className="text-left h-auto py-3 px-3.5 rounded-xl text-xs font-bold whitespace-normal shadow-2xs hover:border-sacred-gold"
                >
                  ✝ {item.q}
                </Button>
              ))}
            </div>
          </EditorialCard>

          <EditorialCard variant="default" className="p-5 bg-gradient-to-br from-white to-purple-500/10 dark:from-slate-800 dark:to-purple-500/15 border-slate-200 dark:border-slate-700">
            <h4 className="font-serif font-bold text-sm text-purple-700 dark:text-purple-300">
              Sobre a Inteligência Artificial Católica
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2 font-medium">
              Nossa tecnologia RAG é estritamente configurada sem especulações particulares. Ela não opina, mas proclama com reverência a verdade imutável confiada à Santa Igreja.
            </p>
          </EditorialCard>
        </div>

      </div>
    </PageContainer>
  );
}
