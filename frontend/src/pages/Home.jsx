import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/static/img/background.png',
      title: 'AIInvigilator',
      subtitle: 'Real-time Malpractice Detection System Using Computer Vision',
    },
    {
      image: '/static/img/5.jpeg',
      title: 'Ensuring Exam Integrity',
      subtitle: 'Harness the power of AI to safeguard academic honesty and identify suspicious activities instantly.',
    },
    {
      image: '/static/img/4.jpg',
      title: 'Advanced Analysis',
      subtitle: 'Detailed analysis and evaluation using keypoint estimation and object detection.',
    },
    {
      image: '/static/img/2.jpeg',
      title: 'Robust Security',
      subtitle: 'A secure and reliable system ensuring the integrity of every exam.',
    },
    {
      image: '/static/img/1.jpg',
      title: 'Real-Time Alerts',
      subtitle: 'Instant email and SMS notifications to invigilators for immediate action.',
    },
    {
      image: '/static/img/3.jpeg',
      title: 'AI Powered',
      subtitle: 'Leveraging advanced AI for precise detection and analytics.',
    },
    {
      image: '/static/img/6.jpeg',
      title: 'Multiple Action Identification',
      subtitle: 'Identifies multiple malpractice instances like turning back, passing object, mobile phone usage, leaning, hand raise and so on...',
    },
  ];

  const features = [
    {
      icon: '🎥',
      title: 'Real-Time Monitoring',
      description: 'Continuously scan exam rooms for suspicious activities using AI-powered video analysis.',
    },
    {
      icon: '🕵️',
      title: 'Immediate Alerts',
      description: 'Instantly flag unauthorized items or unusual behaviors and notify proctors.',
    },
    {
      icon: '🧠',
      title: 'Machine Learning & Analytics',
      description: 'Leverage deep learning for accurate classification and actionable insights.',
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Carousel Section */}
      <section className="relative h-[600px] overflow-hidden bg-gray-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" style={{filter: 'brightness(0.7)'}} />
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{textShadow: '2px 2px 3px rgba(0,0,0,0.4)'}}>
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8" style={{textShadow: '2px 2px 3px rgba(0,0,0,0.4)'}}>
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        {/* Navigation arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:scale-110 transition-transform z-10"
        >
          ‹
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentSlide((currentSlide + 1) % slides.length);
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:scale-110 transition-transform z-10"
        >
          ›
        </button>
      </section>

      {/* About Section */}
      <section id="learnmore" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img src="/static/img/3.jpeg" alt="About AIInvigilator" className="w-full rounded-2xl shadow-2xl" />
            </div>
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">What is AIInvigilator?</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                AIInvigilator is a real-time malpractice detection system that leverages advanced computer vision and AI to
                identify suspicious activities in classrooms. It helps safeguard exam integrity by monitoring unauthorized
                materials and unusual behaviors.
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Object detection for identifying phones, notes, and more
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Pose estimation to capture suspicious body language
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Immediate alerts for rapid intervention
                </li>
              </ul>
              <a href="#features" className="inline-block btn-gradient">
                View Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">Key Features</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary-600 to-secondary-500 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                hover 
                className="text-center group transform transition-all duration-500 hover:scale-105"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                }}
              >
                <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary-600 to-secondary-500 mx-auto transition-all duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Videos Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">See It In Action</span>
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-12 text-lg">
            Watch how our AI detects various malpractice scenarios in real-time
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Mobile Detection', video: '/static/videos/mobile.mp4', icon: '📱', desc: 'AI instantly detects unauthorized mobile phone usage' },
              { title: 'Turning Back', video: '/static/videos/Turning_back_1.mp4', icon: '↩️', desc: 'Monitors students looking back or away from exam' },
              { title: 'Leaning Detection', video: '/static/videos/leaning.mp4', icon: '🔄', desc: 'Identifies suspicious leaning or posture changes' },
            ].map((item, index) => (
              <div
                key={index} 
                className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group" 
                onClick={() => {
                  console.log('Clicked video card:', item.title);
                  setSelectedVideo(item);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{item.desc}</p>
                  <div className="flex items-center justify-center space-x-2 text-primary-600 font-semibold group-hover:text-primary-700">
                    <span>▶</span>
                    <span>Watch Demo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Want to Learn More?</h2>
          <p className="text-lg mb-6 text-white">
            Contact us to schedule a demo or discuss how AIInvigilator can enhance your exam security.
          </p>
          {!isAuthenticated && (
            <Button to="/login" size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-bold">
              Get Alerted
            </Button>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white text-5xl font-light hover:text-red-500 transition-colors"
            >
              ×
            </button>
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-4xl">{selectedVideo.icon}</span>
                <span>{selectedVideo.title}</span>
              </h3>
              <video
                src={selectedVideo.video}
                className="w-full rounded-lg"
                controls
                autoPlay
                playsInline
                style={{ maxHeight: '70vh' }}
                onLoadedData={(e) => {
                  e.target.playbackRate = 2.0;
                }}
              />
              <p className="text-white text-center mt-4 text-lg">{selectedVideo.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
