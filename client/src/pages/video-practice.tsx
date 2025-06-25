import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { VideoAnalysis } from "@shared/schema";

export default function VideoPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState("Job Interview Introduction");
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<VideoAnalysis | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const scenarios = [
    "Job Interview Introduction",
    "Team Meeting Presentation", 
    "Client Pitch",
    "Difficult Conversation",
    "Public Speaking",
    "Free Practice"
  ];

  const { data: previousAnalyses } = useQuery<VideoAnalysis[]>({
    queryKey: ["/api/video-analyses"],
  });

  const analyzeVideoMutation = useMutation({
    mutationFn: async (videoData: any) => {
      // Mock AI analysis - in real implementation this would send video to AI service
      const mockAnalysis = {
        scenario: selectedScenario,
        overallScore: Math.floor(Math.random() * 20) + 80, // 80-100
        eyeContactScore: Math.floor(Math.random() * 20) + 80,
        facialExpressionScore: Math.floor(Math.random() * 20) + 70,
        gestureScore: Math.floor(Math.random() * 30) + 70,
        postureScore: Math.floor(Math.random() * 20) + 80,
        feedback: [
          "Excellent eye contact - you maintained natural, confident gaze patterns",
          "Your facial expressions conveyed enthusiasm and sincerity",
          "Try to coordinate your hand gestures more closely with your key points",
          "Practice varying your gesture size to emphasize different ideas"
        ]
      };

      const response = await fetch("/api/video-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockAnalysis)
      });

      if (!response.ok) throw new Error("Failed to analyze video");
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisData(data);
      setShowAnalysis(true);
      queryClient.invalidateQueries({ queryKey: ["/api/video-analyses"] });
      toast({
        title: "Analysis Complete",
        description: "Your video has been analyzed successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your video. Please try again.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Your practice session is now being recorded."
      });
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to record your practice session.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      toast({
        title: "Recording Stopped",
        description: "Click 'Analyze Video' to get your feedback."
      });
    }
  };

  const analyzeVideo = () => {
    if (recordedVideoUrl) {
      analyzeVideoMutation.mutate({ videoUrl: recordedVideoUrl, scenario: selectedScenario });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Communication Practice</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Record yourself practicing communication skills and receive AI-powered feedback on your body language, eye contact, and presentation style
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Recording Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Session</CardTitle>
            <p className="text-gray-600">Choose a scenario and start recording to practice your communication skills</p>
          </CardHeader>
          
          {/* Video Display Area */}
          <div className="relative bg-gray-900 mx-6" style={{aspectRatio: "16/9"}}>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            
            {!isRecording && !recordedVideoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <i className="fas fa-video text-6xl mb-4 opacity-50"></i>
                  <p className="text-lg">Click "Start Recording" to begin</p>
                </div>
              </div>
            )}
            
            {/* Recording Status */}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <i className="fas fa-circle animate-pulse-recording mr-1"></i>
                Recording
              </div>
            )}
            
            {/* Timer */}
            {isRecording && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm font-mono">
                {formatTime(recordingTime)}
              </div>
            )}
          </div>
          
          {/* Controls */}
          <CardContent className="p-6">
            {/* Scenario Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Practice Scenario</label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario} value={scenario}>
                      {scenario}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!isRecording && !recordedVideoUrl && (
                <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600">
                  <i className="fas fa-video mr-2"></i>
                  Start Recording
                </Button>
              )}
              
              {isRecording && (
                <Button onClick={stopRecording} className="bg-gray-500 hover:bg-gray-600">
                  <i className="fas fa-stop mr-2"></i>
                  Stop Recording
                </Button>
              )}
              
              {recordedVideoUrl && !showAnalysis && (
                <>
                  <Button onClick={analyzeVideo} disabled={analyzeVideoMutation.isPending} className="bg-primary hover:bg-blue-700">
                    <i className="fas fa-brain mr-2"></i>
                    {analyzeVideoMutation.isPending ? "Analyzing..." : "Analyze Video"}
                  </Button>
                  <Button onClick={() => {
                    setRecordedVideoUrl(null);
                    setShowAnalysis(false);
                    setRecordingTime(0);
                  }} variant="outline">
                    <i className="fas fa-redo mr-2"></i>
                    Record Again
                  </Button>
                </>
              )}
            </div>
            
            {/* Upload Option */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Or upload an existing video</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <i className="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-2"></i>
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">MP4, WebM up to 100MB</p>
                  </div>
                  <input type="file" className="hidden" accept="video/*" />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <p className="text-gray-600">
              {showAnalysis ? "Here's your detailed feedback" : "Complete a recording to receive detailed feedback"}
            </p>
          </CardHeader>
          
          {!showAnalysis ? (
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <i className="fas fa-brain text-4xl mb-4"></i>
                  <p>AI analysis will appear here after recording</p>
                </div>
              </div>
            </CardContent>
          ) : analysisData && (
            <CardContent className="p-6 space-y-6">
              {/* Overall Score */}
              <div className="text-center gradient-primary text-white p-6 rounded-lg">
                <div className="text-3xl font-bold mb-2">{analysisData.overallScore}%</div>
                <div className="text-lg opacity-90">Overall Communication Score</div>
              </div>
              
              {/* Detailed Metrics */}
              <div className="space-y-4">
                {[
                  { label: "Eye Contact", score: analysisData.eyeContactScore, icon: "fas fa-eye", desc: "Maintained appropriate eye contact" },
                  { label: "Facial Expression", score: analysisData.facialExpressionScore, icon: "fas fa-smile", desc: "Confident and engaging expressions" },
                  { label: "Hand Gestures", score: analysisData.gestureScore, icon: "fas fa-hand-paper", desc: "Room for improvement in gesture timing" },
                  { label: "Posture", score: analysisData.postureScore, icon: "fas fa-user", desc: "Professional and confident stance" }
                ].map((metric, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`${getScoreBarColor(metric.score)} text-white p-2 rounded-full`}>
                          <i className={`${metric.icon} text-sm`}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{metric.label}</h3>
                          <p className="text-sm text-gray-600">{metric.desc}</p>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                        {metric.score}%
                      </div>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </div>
                ))}
              </div>
              
              {/* Feedback */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">
                  <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                  Personalized Feedback
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {analysisData.feedback.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <i className={`${index < 2 ? 'fas fa-check-circle text-green-500' : index < 3 ? 'fas fa-exclamation-triangle text-yellow-500' : 'fas fa-info-circle text-blue-500'} mr-2 mt-0.5`}></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-primary hover:bg-blue-700">
                  <i className="fas fa-save mr-2"></i>
                  Save Analysis
                </Button>
                <Button 
                  className="flex-1 bg-secondary hover:bg-purple-700"
                  onClick={() => {
                    setShowAnalysis(false);
                    setRecordedVideoUrl(null);
                    setAnalysisData(null);
                    setRecordingTime(0);
                  }}
                >
                  <i className="fas fa-redo mr-2"></i>
                  Practice Again
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Practice Tips */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Practice Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "fas fa-lightbulb", title: "Good Lighting", desc: "Ensure your face is well-lit and clearly visible to the camera", color: "bg-blue-100 text-blue-600" },
                { icon: "fas fa-volume-up", title: "Clear Audio", desc: "Find a quiet space with minimal background noise", color: "bg-green-100 text-green-600" },
                { icon: "fas fa-camera", title: "Camera Position", desc: "Position camera at eye level for natural interaction", color: "bg-purple-100 text-purple-600" },
                { icon: "fas fa-clock", title: "Practice Duration", desc: "Keep sessions 2-5 minutes for focused feedback", color: "bg-yellow-100 text-yellow-600" }
              ].map((tip, index) => (
                <div key={index} className="text-center">
                  <div className={`${tip.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${tip.icon} text-xl`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
