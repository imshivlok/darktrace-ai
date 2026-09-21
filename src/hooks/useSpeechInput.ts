// USE: Voice dictation from the device microphone (speech to text).
// Wraps the browser's Web Speech API, so it works in Chrome, Edge and Safari
// over HTTPS or localhost. Firefox has no support; `supported` is false there.
//
//   const speech = useSpeechInput((text) => setDraft(base + text));
//   speech.toggle();   // start / stop
//
// The callback receives the full transcript so far (interim words included),
// so the caller decides how to merge it with what was already typed.

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal typings: lib.dom doesn't ship SpeechRecognition in every TS version.
interface RecognitionResultLike {
  readonly isFinal: boolean;
  readonly [index: number]: { readonly transcript: string };
}
interface RecognitionEventLike {
  readonly results: ArrayLike<RecognitionResultLike>;
}
interface RecognitionErrorLike {
  readonly error: string;
}
interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: RecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => RecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function describeError(code: string): string | null {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access is blocked. Allow it in your browser's site settings.";
    case "no-speech":
      return "Didn't catch anything. Try again.";
    case "audio-capture":
      return "No microphone was found.";
    case "network":
      return "Voice input needs an internet connection.";
    case "aborted":
      return null; // we stopped it ourselves
    default:
      return "Voice input didn't work. Try again.";
  }
}

export interface SpeechInput {
  supported: boolean;
  listening: boolean;
  error: string | null;
  start: () => void;
  /** Stop listening; any words already heard are still delivered. */
  stop: () => void;
  /** Stop immediately and drop anything still pending (e.g. on submit). */
  cancel: () => void;
  toggle: () => void;
}

export function useSpeechInput(
  onTranscript: (text: string, isFinal: boolean) => void,
  lang = "en-US",
): SpeechInput {
  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<RecognitionLike | null>(null);
  const callbackRef = useRef(onTranscript);
  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError(
        "Voice input isn't supported in this browser. Try Chrome, Edge or Safari.",
      );
      return;
    }
    if (recognitionRef.current) return; // already listening

    setError(null);
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false; // ends on its own after a pause
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      const last = e.results[e.results.length - 1];
      callbackRef.current(text.trim(), last.isFinal);
    };
    recognition.onerror = (e) => setError(describeError(e.error));
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    } catch {
      setError("Couldn't start the microphone. Try again.");
    }
  }, [lang]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const cancel = useCallback(() => {
    recognitionRef.current?.abort();
  }, []);

  const toggle = useCallback(() => {
    if (recognitionRef.current) stop();
    else start();
  }, [start, stop]);

  // Release the microphone if the component goes away mid-dictation
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  return { supported, listening, error, start, stop, cancel, toggle };
}

/** Append dictated words after whatever was typed before the mic was pressed. */
export function joinDictation(base: string, spoken: string): string {
  const head = base.replace(/\s+$/, "");
  return head ? `${head} ${spoken}` : spoken;
}
