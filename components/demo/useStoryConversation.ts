"use client";

import { useRef, useState } from "react";
import type { StoryMessage, StoryStage, StoryState, PlanData, InputMode, QuickReply } from "@/lib/conversation/storyFlow";
import { resolvePlan } from "@/lib/conversation/storyFlow";

function msgId() {
  return `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function randomRef() {
  return `QT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
}

export function useStoryConversation(clientName: string, assistantName: string) {
  const stageRef = useRef<StoryStage>("idle");
  const vehicleRef = useRef("");
  const coverageRef = useRef("");
  const busyRef = useRef(false);

  const [state, setState] = useState<StoryState>({
    stage: "idle",
    messages: [],
    isTyping: false,
    loadingText: "",
    inputMode: "none",
    quickReplies: [],
    vehicleType: "",
    coverageType: "",
    phone: "",
  });

  function setStage(s: StoryStage) {
    stageRef.current = s;
    setState((p) => ({ ...p, stage: s }));
  }

  function setInput(inputMode: InputMode, quickReplies: QuickReply[] = []) {
    setState((p) => ({ ...p, inputMode, quickReplies }));
  }

  function addUserMsg(text: string) {
    setState((p) => ({
      ...p,
      messages: [...p.messages, { id: msgId(), role: "user", text }],
      inputMode: "none",
      quickReplies: [],
    }));
  }

  async function addAIMsg(text: string, typingMs = 1200, extra?: Partial<StoryMessage>) {
    setState((p) => ({ ...p, isTyping: true, inputMode: "none", quickReplies: [], loadingText: "" }));
    await sleep(typingMs);
    setState((p) => ({
      ...p,
      isTyping: false,
      messages: [...p.messages, { id: msgId(), role: "ai", text, ...extra }],
    }));
  }

  async function startJourney(_intent?: string) {
    if (stageRef.current !== "idle" || busyRef.current) return;
    busyRef.current = true;

    await addAIMsg(
      `Hi! I'm ${assistantName}. Getting a quote takes less than 2 minutes. What type of vehicle do you drive?`,
      700
    );

    setStage("vehicle_asked");
    setInput("quick-replies", [
      { id: "Car", label: "Car" },
      { id: "SUV", label: "SUV" },
      { id: "Bike", label: "Bike" },
    ]);
    busyRef.current = false;
  }

  async function send(text: string) {
    if (busyRef.current) return;
    const stage = stageRef.current;
    busyRef.current = true;

    if (stage === "vehicle_asked") {
      vehicleRef.current = text;
      addUserMsg(text);
      setState((p) => ({ ...p, vehicleType: text }));
      setStage("coverage_asked");

      await addAIMsg(
        `Got it — a ${text.toLowerCase()}. Are you looking for comprehensive coverage or third-party only?`,
        1100
      );
      setInput("quick-replies", [
        { id: "Comprehensive", label: "Comprehensive" },
        { id: "Third-party only", label: "Third-party only" },
      ]);
    } else if (stage === "coverage_asked") {
      coverageRef.current = text;
      addUserMsg(text);
      setState((p) => ({ ...p, coverageType: text }));
      setStage("plan_loading");

      // Animated loading sequence
      setState((p) => ({ ...p, isTyping: true, inputMode: "none", quickReplies: [] }));
      await sleep(300);
      setState((p) => ({ ...p, loadingText: "Verifying vehicle category…" }));
      await sleep(1300);
      setState((p) => ({ ...p, loadingText: "Comparing available plans…" }));
      await sleep(1100);
      setState((p) => ({ ...p, loadingText: "Applying best rates for you…" }));
      await sleep(900);
      setState((p) => ({ ...p, isTyping: false, loadingText: "" }));

      const plan = resolvePlan(vehicleRef.current, coverageRef.current);
      setStage("recommended");

      await addAIMsg("Found the right plan for you.", 400, { card: "plan", planData: plan });
      await sleep(500);
      await addAIMsg("Want me to send this quote to your phone?", 700);

      setStage("phone_asked");
      setInput("quick-replies", [{ id: "yes", label: "Yes, send it" }]);
    } else if (stage === "phone_asked") {
      if (text === "yes" || text === "Yes, send it") {
        addUserMsg("Yes, send it");
        await addAIMsg("What's the best number to reach you on?", 900);
        setInput("phone");
      } else {
        await collectPhone(text);
        busyRef.current = false;
        return;
      }
    }

    busyRef.current = false;
  }

  async function sendPhone(phone: string) {
    if (busyRef.current) return;
    busyRef.current = true;
    await collectPhone(phone);
    busyRef.current = false;
  }

  async function collectPhone(phone: string) {
    addUserMsg(phone);
    setState((p) => ({ ...p, phone }));
    setStage("confirming");

    setState((p) => ({ ...p, isTyping: true, loadingText: "Confirming your details…", inputMode: "none", quickReplies: [] }));
    await sleep(1600);
    setState((p) => ({ ...p, isTyping: false, loadingText: "" }));

    const reference = randomRef();
    setStage("confirmed");
    await addAIMsg("Your quote is confirmed.", 300, {
      card: "confirmation",
      confirmData: { phone, reference, eta: "within 2 hours" },
    });
  }

  return { state, startJourney, send, sendPhone };
}
