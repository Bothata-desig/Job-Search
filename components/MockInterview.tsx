
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Audio Utility Functions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const MockInterview: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = { input: inputCtx, output: outputCtx };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          setTranscript(prev => [...prev, "System: Session started. You're talking to an AI interviewer."]);
          
          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current = scriptProcessor;

          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const pcmBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            const text = message.serverContent.outputTranscription.text;
            setTranscript(prev => [...prev, `Interviewer: ${text}`]);
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio) {
            const outCtx = audioContextRef.current?.output;
            if (!outCtx) return;

            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
            const source = outCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e) => {
          console.error("Interview error", e);
          stopSession();
        },
        onclose: () => {
          setIsActive(false);
          setIsConnecting(false);
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        systemInstruction: "You are a professional hiring manager. Conduct a friendly but challenging mock interview for a job the user wants. Ask one question at a time. Wait for their response. Provide constructive feedback occasionally.",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }
    audioContextRef.current?.input.close();
    audioContextRef.current?.output.close();
    setIsActive(false);
    setIsConnecting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive ? 'bg-indigo-600 scale-110 shadow-xl shadow-indigo-200 animate-pulse' : 'bg-slate-100'
          }`}>
            <i className={`fas fa-microphone text-4xl ${isActive ? 'text-white' : 'text-slate-400'}`}></i>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800">Mock Interview Session</h2>
          <p className="text-slate-500">
            Practice your interview skills with our AI. This session uses voice interaction to simulate a real-world experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isActive ? (
              <button
                onClick={startSession}
                disabled={isConnecting}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all disabled:bg-slate-300 shadow-lg shadow-indigo-200"
              >
                {isConnecting ? 'Connecting...' : 'Start Interview'}
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="bg-red-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-200"
              >
                End Session
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transcript / Visualizer placeholder */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 h-64 overflow-y-auto flex flex-col-reverse">
        <div className="space-y-3">
          {transcript.length === 0 && (
            <div className="text-center text-slate-400 italic py-10">
              Session transcript will appear here...
            </div>
          )}
          {transcript.map((line, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl text-sm border border-slate-100">
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start space-x-3">
          <i className="fas fa-lightbulb text-indigo-500 mt-1"></i>
          <p className="text-sm text-indigo-800 font-medium">
            Remember to speak clearly and maintain a professional tone, just like a real interview.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
          <i className="fas fa-shield-alt text-amber-500 mt-1"></i>
          <p className="text-sm text-amber-800 font-medium">
            Your audio is processed in real-time and not stored. Feel free to practice openly.
          </p>
        </div>
      </div>
    </div>
  );
};
