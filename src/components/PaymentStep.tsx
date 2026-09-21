import React, { useState } from 'react';
import { 
  CreditCard, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { STORE_CONFIG } from '../config/constants';
import { formatPrice } from '../data';

export interface PaymentStepProps {
  total: number;
  paymentNumber?: string;
  accountName?: string;
  onProceedToWhatsApp?: () => void;
  isSubmitting?: boolean;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  total,
  paymentNumber = STORE_CONFIG.paymentNumber,
  accountName = STORE_CONFIG.paymentAccountName,
  onProceedToWhatsApp,
  isSubmitting = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopyNumber = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(paymentNumber);
      } else {
        // Fallback for older browsers or restricted iframe environments
        const textArea = document.createElement('textarea');
        textArea.value = paymentNumber;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setCopyFeedback('Número copiado! Agora abre o M-Pesa ou e-Mola e cola.');
      setTimeout(() => {
        setCopied(false);
      }, 3500);
      setTimeout(() => {
        setCopyFeedback(null);
      }, 5000);
    } catch (err) {
      console.error('Falha ao copiar número:', err);
      setCopyFeedback('Não foi possível copiar automaticamente. Podes selecionar o número manualmente.');
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header do Passo de Pagamento */}
      <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white">
              Pagamento via M-Pesa / e-Mola
            </h3>
            <p className="text-[11px] text-zinc-400">
              Paga sem complicações e sem precisar de apontar num papel
            </p>
          </div>
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Seguro
        </span>
      </div>

      {/* 2. Destaque do Total a Pagar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1C1C1C] to-[#141414] border border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block font-display">
            Total do Teu Pedido
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#FF6B00] font-display tracking-wide mt-0.5">
            {formatPrice(total)}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-300 bg-[#222222] px-3.5 py-2 rounded-xl border border-[#2E2E2E] self-start sm:self-auto">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>M-Pesa (Vodacom) ou e-Mola (Movitel)</span>
        </div>
      </div>

      {/* 3. Cartão Principal: Número com Botão Mágico "Copiar Número" */}
      <div className="bg-[#181818] border border-[#262626] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-zinc-300 block">
            Número da Conta de Pagamento:
          </span>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            {/* Campo visual do número */}
            <div className="flex-1 bg-[#121212] border border-[#2E2E2E] rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Número Vodacom / Movitel</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest block select-all">
                  {paymentNumber}
                </span>
              </div>

              {/* Badges de Operadoras */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/30">
                  M-Pesa
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  e-Mola
                </span>
              </div>
            </div>

            {/* BOTÃO MÁGICO DE COPIAR */}
            <button
              type="button"
              onClick={handleCopyNumber}
              aria-label="Copiar número de pagamento"
              className={`px-5 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shrink-0 select-none shadow-md ${
                copied
                  ? 'bg-emerald-500 text-black shadow-emerald-500/25 scale-[1.02]'
                  : 'bg-[#FF6B00] hover:bg-[#E55F00] active:scale-[0.98] text-white shadow-[#FF6B00]/25'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Número</span>
                  <Sparkles className="w-3.5 h-3.5 text-white/80" />
                </>
              )}
            </button>
          </div>

          {/* Feedback de cópia dinâmico */}
          {copyFeedback && (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1 font-medium animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{copyFeedback}</span>
            </p>
          )}
        </div>

        {/* Informações do Titular da Conta */}
        <div className="pt-3 border-t border-[#242424] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-0.5">
            <span className="text-[11px] text-zinc-400 font-medium block">Nome do Titular:</span>
            <span className="font-bold text-white text-sm block">
              {accountName}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-0.5">
            <span className="text-[11px] text-zinc-400 font-medium block">Confirmação:</span>
            <span className="text-zinc-300 font-medium text-xs block">
              Envio direto via WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* 4. Guia Rápido em 3 Passos Simples */}
      <div className="bg-[#151515] border border-[#242424] rounded-2xl p-4 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Como pagar em 30 segundos:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#262626] space-y-1">
            <span className="w-5 h-5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] font-black text-[11px] flex items-center justify-center">
              1
            </span>
            <p className="font-bold text-white">Clica em "Copiar Número"</p>
            <p className="text-[11px] text-zinc-400">O número vai direto para a tua área de transferência.</p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#262626] space-y-1">
            <span className="w-5 h-5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] font-black text-[11px] flex items-center justify-center">
              2
            </span>
            <p className="font-bold text-white">Transfere {formatPrice(total)}</p>
            <p className="text-[11px] text-zinc-400">Abre o M-Pesa (*150#) ou e-Mola (*898#) e faz a transferência.</p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#262626] space-y-1">
            <span className="w-5 h-5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] font-black text-[11px] flex items-center justify-center">
              3
            </span>
            <p className="font-bold text-white">Envia no WhatsApp</p>
            <p className="text-[11px] text-zinc-400">Clica em confirmar abaixo e manda o comprovativo na conversa.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
