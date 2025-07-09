// Test AI Analysis System
const { analyzeVideoWithAI } = require('./server/ai-video-analysis');

async function testAISystem() {
  console.log('🧪 Testing AI Analysis System...\n');
  
  // Create a dummy video buffer
  const dummyVideoBuffer = Buffer.from('dummy video data');
  const scenario = 'Job Interview Introduction';
  const duration = 30;
  
  try {
    console.log('📹 Analyzing video with AI...');
    const result = await analyzeVideoWithAI(dummyVideoBuffer, scenario, duration);
    
    console.log('✅ AI Analysis Result:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n🎉 AI Analysis System is working!');
    console.log(`📊 Overall Score: ${result.overallScore}/100`);
    console.log(`👁️ Eye Contact: ${result.eyeContactScore}/100`);
    console.log(`😊 Facial Expression: ${result.facialExpressionScore}/100`);
    console.log(`🤲 Gestures: ${result.gestureScore}/100`);
    console.log(`🧍 Posture: ${result.postureScore}/100`);
    console.log(`🎯 Confidence: ${Math.round(result.confidence * 100)}%`);
    
  } catch (error) {
    console.error('❌ AI Analysis failed:', error.message);
  }
}

testAISystem(); 