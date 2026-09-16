import { useState, useRef } from 'react';
import { Video, Square, Download, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from './Toast';

export function DemoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const { addToast } = useToast();

  const startRecording = async () => {
    try {
      // Prompt user to select screen or tab with audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          frameRate: 60,
        },
        audio: true, // Captures tab audio for the intro sounds
      } as any);

      streamRef.current = stream;
      chunksRef.current = [];

      // Determine supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      const selectedMimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

      const recorder = new MediaRecorder(stream, selectedMimeType ? { mimeType: selectedMimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoBlobUrl(url);

        // Auto-download the finished video
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 10);
        a.download = `finsight-walkthrough-demo-${timestamp}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        addToast('success', 'HD Demo Video recorded and downloaded successfully!');
        setIsRecording(false);
        clearInterval(timerRef.current);
        setRecordTime(0);

        // Stop all media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // Handle user stopping screen share via browser stop button
      stream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      };

      recorder.start(500); // collect chunks every 500ms
      setIsRecording(true);
      setVideoBlobUrl(null);
      addToast('info', 'Recording started! Walk through your demo.');

      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordTime(seconds);
      }, 1000);
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        addToast('error', 'Could not access screen recording with audio');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end gap-2 pointer-events-auto">
      {isRecording ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-dark-300/95 border border-red-500/50 shadow-2xl backdrop-blur-2xl text-white animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs font-bold text-red-400">REC {formatTime(recordTime)}</span>
          </div>

          <span className="text-xs text-surface-400 font-mono hidden sm:inline">HD + Audio Active</span>

          <button
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg transition-all active:scale-95"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop & Save Video</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {videoBlobUrl && (
            <a
              href={videoBlobUrl}
              download="finsight-walkthrough-demo.webm"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-medium shadow-lg backdrop-blur-md transition-all active:scale-95"
              title="Download Last Recorded Video"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Last Video</span>
            </a>
          )}

          <button
            onClick={startRecording}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-neon-cyan text-white text-xs sm:text-sm font-semibold shadow-glow hover:shadow-glow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/10"
            title="Record HD Video of Website with Audio"
          >
            <Video className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
            <span>Record Demo Video</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-white/20 text-white">
              HD
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
