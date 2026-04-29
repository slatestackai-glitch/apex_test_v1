"use client";

import { useEffect, useState } from "react";
import { X, Minimize2 } from "lucide-react";

import { ChatWindow } from "@/components/demo/ChatWindow";
import { useStoryConversation } from "@/components/demo/useStoryConversation";

export function ApexOverlayModal({
  clientName,
  assistantName,
}: {
  clientName: string;
  assistantName: string;
}) {
  const { state, startJourney, send, sendPhone } = useStoryConversation(clientName, assistantName);
  const [showInvite, setShowInvite] = useState(false);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Auto-invite after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowInvite(true), 4000);
    return () => clearTimeout(t);
  }, []);

  function openOverlay() {
    setShowInvite(false);
    setOpen(true);
    setMinimized(false);
    if (state.stage === "idle") {
      startJourney("buy");
    }
  }

  return (
    <>
      {/* Floating invite card */}
      {showInvite && !open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 animate-[slideUp_0.4s_ease] rounded-3xl border border-white/60 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-2xl p-5">
          <button
            type="button"
            onClick={() => setShowInvite(false)}
            className="absolute right-4 top-4 text-gray-300 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0A2540] text-white text-xs font-bold shadow-sm">
              AX
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0A2540]">{assistantName}</p>
              <p className="text-[11px] text-gray-400">{clientName}</p>
            </div>
          </div>

          <p className="text-sm font-medium text-[#0A2540] mb-1">
            Need help finding the right insurance plan?
          </p>
          <p className="text-xs text-gray-400 mb-4">
            I can guide you to the perfect coverage in under 2 minutes.
          </p>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={openOverlay}
              className="w-full rounded-2xl bg-[#C8102E] py-2.5 text-sm font-semibold text-white hover:bg-[#a00d24] transition-colors"
            >
              Get a quote now
            </button>
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="w-full py-1.5 text-xs text-gray-400 hover:text-gray-500 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Minimized pill */}
      {open && minimized && (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#0A2540] px-4 py-3 shadow-2xl text-white hover:bg-[#0d2f52] transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C8102E] text-[10px] font-bold">AX</div>
          <span className="text-sm font-semibold">{assistantName}</span>
        </button>
      )}

      {/* Full overlay modal */}
      {open && !minimized && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-[#0A2540]/60 backdrop-blur-md" />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="relative flex h-[85vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl shadow-black/30 overflow-hidden animate-[slideUp_0.35s_ease]"
              style={{ maxHeight: "85vh" }}
            >
              {/* Modal header */}
              <div className="flex items-center gap-3 border-b border-gray-100 bg-[#0A2540] px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C8102E] text-xs font-bold text-white">
                  AX
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{assistantName}</p>
                  <p className="text-[11px] text-blue-300">{clientName} · AI Insurance Assistant</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMinimized(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-blue-300 hover:bg-white/10 transition-colors"
                    aria-label="Minimize"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-blue-300 hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Conversation */}
              <div className="flex-1 overflow-hidden">
                <ChatWindow
                  state={state}
                  onSend={send}
                  onSendPhone={sendPhone}
                  assistantName={assistantName}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
