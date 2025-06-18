import React, { useEffect, useState } from 'react';
import { ExternalLink, Github, Calendar, Users } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  category: string;
  duration: string;
  team: string;
  features: string[];
  demoUrl: string;
  githubUrl: string;
}

// Hardcoded projects
const hardcodedProjects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A modern, responsive e-commerce platform with AI-powered product recommendations, real-time inventory management, and seamless payment integration. Built with React, Node.js, and machine learning algorithms.",
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Node.js", "MongoDB", "AI/ML", "Stripe"],
    category: "Web Development",
    duration: "6 months",
    team: "5 developers",
    features: ["AI Recommendations", "Real-time Inventory", "Payment Gateway", "Admin Dashboard"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Healthcare Telemedicine App",
    description: "A comprehensive telemedicine platform connecting patients with healthcare providers through secure video calls, appointment scheduling, and digital prescriptions. HIPAA compliant with end-to-end encryption.",
    image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React Native", "Firebase", "WebRTC", "Node.js", "PostgreSQL"],
    category: "Mobile Development",
    duration: "8 months",
    team: "7 developers",
    features: ["Video Consultations", "Appointment Booking", "Digital Prescriptions", "Health Records"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "FinTech Trading Dashboard",
    description: "Real-time financial analytics and trading platform with advanced charting, portfolio management, and automated trading algorithms. Features live market data integration and risk assessment tools.",
    image: "https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Vue.js", "Python", "Django", "Redis", "WebSocket"],
    category: "Data Analytics",
    duration: "10 months",
    team: "8 developers",
    features: ["Real-time Trading", "Portfolio Analytics", "Risk Assessment", "Automated Alerts"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Smart City IoT Platform",
    description: "An IoT management platform for smart city infrastructure, monitoring traffic, air quality, and energy consumption. Features predictive analytics and automated reporting for city administrators.",
    image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Angular", "Python", "InfluxDB", "Docker", "Kubernetes"],
    category: "IoT Development",
    duration: "12 months",
    team: "10 developers",
    features: ["IoT Device Management", "Predictive Analytics", "Real-time Monitoring", "Automated Reports"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Educational Learning Management System",
    description: "A comprehensive LMS with interactive course creation, student progress tracking, virtual classrooms, and gamification elements. Supports multiple content formats and assessment types.",
    image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Express.js", "MongoDB", "Socket.io", "AWS"],
    category: "EdTech",
    duration: "9 months",
    team: "6 developers",
    features: ["Course Creation", "Virtual Classrooms", "Progress Tracking", "Gamification"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Social Media Analytics Tool",
    description: "Advanced social media analytics platform providing insights across multiple platforms. Features sentiment analysis, competitor tracking, and automated reporting for marketing teams.",
    image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Python", "FastAPI", "PostgreSQL", "ML"],
    category: "Analytics",
    duration: "7 months",
    team: "5 developers",
    features: ["Multi-platform Analytics", "Sentiment Analysis", "Competitor Tracking", "Custom Reports"],
    demoUrl: "#",
    githubUrl: "#"
  }
];

const Projects: React.FC = () => {
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setDbProjects(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Merge hardcoded and Firestore projects
  const allProjects = [...hardcodedProjects, ...dbProjects];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading projects...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project, idx) => (
            <div key={project.id || idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              {project.image && (
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4 flex-1">{project.description}</p>
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">{project.category}</span>
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2"><Calendar className="inline w-4 h-4 mr-1" />{project.duration}</span>
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-2"><Users className="inline w-4 h-4 mr-1" />{project.team}</span>
                </div>
                <div className="mb-4">
                  {project.tech.map((tech, idx) => (
                    <span key={idx} className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded mr-2 mb-2">{tech}</span>
                  ))}
                </div>
                <div className="mb-4">
                  {project.features.map((feature, idx) => (
                    <span key={idx} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-2 mb-2">{feature}</span>
                  ))}
                </div>
                <div className="flex space-x-4 mt-auto">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                      <ExternalLink className="w-4 h-4 mr-1" /> Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-800 hover:underline">
                      <Github className="w-4 h-4 mr-1" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;