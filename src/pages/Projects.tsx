import React, { useEffect, useState } from 'react';
import { ExternalLink, Github, Calendar, Users, Filter } from 'lucide-react';
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

// Expanded projects with 50+ projects across different categories
const hardcodedProjects: Project[] = [
  // Machine Learning Projects (10)
  {
    title: "AI-Powered Image Recognition System",
    description: "Advanced computer vision system using deep learning for real-time object detection and classification. Supports multiple image formats and provides high accuracy results.",
    image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "TensorFlow", "OpenCV", "Flask", "Docker"],
    category: "Machine Learning",
    duration: "8 months",
    team: "6 developers",
    features: ["Real-time Detection", "Multi-class Classification", "API Integration", "Model Training"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Natural Language Processing Chatbot",
    description: "Intelligent chatbot using transformer models for natural language understanding and generation. Supports multiple languages and context-aware conversations.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "Transformers", "BERT", "FastAPI", "Redis"],
    category: "Machine Learning",
    duration: "6 months",
    team: "4 developers",
    features: ["Multi-language Support", "Context Awareness", "Sentiment Analysis", "Custom Training"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Predictive Analytics Dashboard",
    description: "Comprehensive analytics platform using machine learning for business forecasting and trend analysis. Features interactive visualizations and automated reporting.",
    image: "https://images.pexels.com/photos/8386445/pexels-photo-8386445.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "Scikit-learn", "Pandas", "Plotly", "Streamlit"],
    category: "Machine Learning",
    duration: "7 months",
    team: "5 developers",
    features: ["Predictive Modeling", "Interactive Dashboards", "Automated Reports", "Data Visualization"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Recommendation Engine",
    description: "Advanced recommendation system using collaborative filtering and content-based approaches. Provides personalized suggestions for e-commerce and content platforms.",
    image: "https://images.pexels.com/photos/8386450/pexels-photo-8386450.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "Surprise", "NumPy", "Django", "PostgreSQL"],
    category: "Machine Learning",
    duration: "5 months",
    team: "4 developers",
    features: ["Collaborative Filtering", "Content-based Filtering", "Real-time Recommendations", "A/B Testing"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Anomaly Detection System",
    description: "Real-time anomaly detection system for fraud detection and quality control. Uses unsupervised learning algorithms to identify unusual patterns.",
    image: "https://images.pexels.com/photos/8386455/pexels-photo-8386455.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "Isolation Forest", "Autoencoder", "Kafka", "Elasticsearch"],
    category: "Machine Learning",
    duration: "6 months",
    team: "5 developers",
    features: ["Real-time Detection", "Multiple Algorithms", "Alert System", "Performance Monitoring"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Speech Recognition Platform",
    description: "Advanced speech-to-text and text-to-speech platform with support for multiple languages and accents. Features noise reduction and speaker identification.",
    image: "https://images.pexels.com/photos/8386460/pexels-photo-8386460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "SpeechRecognition", "PyAudio", "Flask", "WebRTC"],
    category: "Machine Learning",
    duration: "9 months",
    team: "7 developers",
    features: ["Multi-language Support", "Noise Reduction", "Speaker ID", "Real-time Processing"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Computer Vision for Medical Imaging",
    description: "AI-powered medical image analysis system for disease detection and diagnosis. Supports X-rays, MRIs, and CT scans with high accuracy.",
    image: "https://images.pexels.com/photos/8386465/pexels-photo-8386465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "PyTorch", "OpenCV", "DICOM", "FastAPI"],
    category: "Machine Learning",
    duration: "12 months",
    team: "8 developers",
    features: ["Medical Image Analysis", "Disease Detection", "HIPAA Compliant", "Clinical Integration"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Time Series Forecasting Engine",
    description: "Advanced time series forecasting system for financial markets, weather prediction, and demand forecasting. Uses LSTM and Prophet models.",
    image: "https://images.pexels.com/photos/8386470/pexels-photo-8386470.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "LSTM", "Prophet", "Pandas", "Streamlit"],
    category: "Machine Learning",
    duration: "7 months",
    team: "5 developers",
    features: ["Multiple Models", "Forecast Visualization", "Accuracy Metrics", "Automated Updates"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Deep Learning for Autonomous Vehicles",
    description: "Computer vision and decision-making system for autonomous vehicles. Features object detection, lane detection, and path planning.",
    image: "https://images.pexels.com/photos/8386475/pexels-photo-8386475.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "TensorFlow", "ROS", "OpenCV", "CUDA"],
    category: "Machine Learning",
    duration: "15 months",
    team: "10 developers",
    features: ["Object Detection", "Lane Detection", "Path Planning", "Real-time Processing"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Sentiment Analysis API",
    description: "Real-time sentiment analysis service for social media monitoring and customer feedback analysis. Supports multiple languages and platforms.",
    image: "https://images.pexels.com/photos/8386480/pexels-photo-8386480.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Python", "NLTK", "spaCy", "FastAPI", "Redis"],
    category: "Machine Learning",
    duration: "4 months",
    team: "3 developers",
    features: ["Multi-language Support", "Real-time Analysis", "API Integration", "Dashboard"],
    demoUrl: "#",
    githubUrl: "#"
  },

  // Web Development Projects (10)
  {
    title: "E-Commerce Platform",
    description: "A modern, responsive e-commerce platform with AI-powered product recommendations, real-time inventory management, and seamless payment integration.",
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
    title: "Content Management System",
    description: "Advanced CMS with drag-and-drop page builder, SEO optimization, and multi-site management capabilities.",
    image: "https://images.pexels.com/photos/8386485/pexels-photo-8386485.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Django", "PostgreSQL", "AWS S3", "Redis"],
    category: "Web Development",
    duration: "8 months",
    team: "6 developers",
    features: ["Drag-and-Drop Builder", "SEO Tools", "Multi-site Support", "Version Control"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Real-time Collaboration Platform",
    description: "Web-based collaboration tool with real-time document editing, video conferencing, and project management features.",
    image: "https://images.pexels.com/photos/8386490/pexels-photo-8386490.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Vue.js", "Socket.io", "MongoDB", "WebRTC", "Docker"],
    category: "Web Development",
    duration: "10 months",
    team: "8 developers",
    features: ["Real-time Editing", "Video Conferencing", "File Sharing", "Task Management"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Social Media Dashboard",
    description: "Comprehensive social media management platform with scheduling, analytics, and multi-platform integration.",
    image: "https://images.pexels.com/photos/8386495/pexels-photo-8386495.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Angular", "Node.js", "MongoDB", "Social APIs", "Chart.js"],
    category: "Web Development",
    duration: "7 months",
    team: "5 developers",
    features: ["Post Scheduling", "Analytics Dashboard", "Multi-platform", "Team Collaboration"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Online Learning Platform",
    description: "Interactive learning management system with video courses, quizzes, and progress tracking.",
    image: "https://images.pexels.com/photos/8386500/pexels-photo-8386500.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Express.js", "MongoDB", "AWS", "Stripe"],
    category: "Web Development",
    duration: "9 months",
    team: "6 developers",
    features: ["Video Streaming", "Interactive Quizzes", "Progress Tracking", "Certification"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Job Portal Platform",
    description: "Comprehensive job portal with advanced search, AI-powered matching, and application tracking system.",
    image: "https://images.pexels.com/photos/8386505/pexels-photo-8386505.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Django", "PostgreSQL", "Elasticsearch", "Redis"],
    category: "Web Development",
    duration: "8 months",
    team: "7 developers",
    features: ["AI Job Matching", "Advanced Search", "Application Tracking", "Company Profiles"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Restaurant Management System",
    description: "Complete restaurant management solution with ordering, inventory, and customer relationship management.",
    image: "https://images.pexels.com/photos/8386510/pexels-photo-8386510.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Vue.js", "Laravel", "MySQL", "Socket.io", "Stripe"],
    category: "Web Development",
    duration: "6 months",
    team: "5 developers",
    features: ["Online Ordering", "Inventory Management", "CRM", "Analytics"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Event Management Platform",
    description: "Comprehensive event management system with ticketing, registration, and virtual event capabilities.",
    image: "https://images.pexels.com/photos/8386515/pexels-photo-8386515.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Node.js", "MongoDB", "WebRTC", "Stripe"],
    category: "Web Development",
    duration: "7 months",
    team: "6 developers",
    features: ["Event Creation", "Ticketing System", "Virtual Events", "Analytics"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Real Estate Platform",
    description: "Advanced real estate platform with property search, virtual tours, and mortgage calculator.",
    image: "https://images.pexels.com/photos/8386520/pexels-photo-8386520.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Angular", "Django", "PostgreSQL", "Google Maps API", "AWS"],
    category: "Web Development",
    duration: "9 months",
    team: "7 developers",
    features: ["Property Search", "Virtual Tours", "Mortgage Calculator", "Agent Portal"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Healthcare Management System",
    description: "Comprehensive healthcare management platform with patient records, appointment scheduling, and telemedicine.",
    image: "https://images.pexels.com/photos/8386525/pexels-photo-8386525.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Django", "PostgreSQL", "WebRTC", "HIPAA"],
    category: "Web Development",
    duration: "12 months",
    team: "8 developers",
    features: ["Patient Records", "Appointment Scheduling", "Telemedicine", "Billing"],
    demoUrl: "#",
    githubUrl: "#"
  },

  // Mobile Development Projects (10)
  {
    title: "Healthcare Telemedicine App",
    description: "A comprehensive telemedicine platform connecting patients with healthcare providers through secure video calls, appointment scheduling, and digital prescriptions.",
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
    title: "Food Delivery App",
    description: "Comprehensive food delivery platform with real-time tracking, multiple restaurant options, and secure payment processing.",
    image: "https://images.pexels.com/photos/8386530/pexels-photo-8386530.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Flutter", "Firebase", "Google Maps", "Stripe", "Node.js"],
    category: "Mobile Development",
    duration: "7 months",
    team: "6 developers",
    features: ["Real-time Tracking", "Multiple Restaurants", "Secure Payments", "Reviews"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Fitness Tracking App",
    description: "Advanced fitness tracking application with workout plans, nutrition tracking, and social features.",
    image: "https://images.pexels.com/photos/8386535/pexels-photo-8386535.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React Native", "MongoDB", "AWS", "Apple Health", "Google Fit"],
    category: "Mobile Development",
    duration: "6 months",
    team: "5 developers",
    features: ["Workout Tracking", "Nutrition Plans", "Social Features", "Progress Analytics"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "E-Learning Mobile App",
    description: "Mobile learning platform with offline content, interactive quizzes, and personalized learning paths.",
    image: "https://images.pexels.com/photos/8386540/pexels-photo-8386540.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Flutter", "Firebase", "SQLite", "AWS S3", "Dart"],
    category: "Mobile Development",
    duration: "8 months",
    team: "6 developers",
    features: ["Offline Learning", "Interactive Quizzes", "Progress Tracking", "Personalized Paths"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Social Networking App",
    description: "Modern social networking app with real-time messaging, story features, and content discovery.",
    image: "https://images.pexels.com/photos/8386545/pexels-photo-8386545.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React Native", "Socket.io", "MongoDB", "AWS S3", "Redis"],
    category: "Mobile Development",
    duration: "9 months",
    team: "7 developers",
    features: ["Real-time Messaging", "Story Features", "Content Discovery", "Privacy Controls"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Travel Companion App",
    description: "Comprehensive travel app with itinerary planning, booking management, and local recommendations.",
    image: "https://images.pexels.com/photos/8386550/pexels-photo-8386550.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Flutter", "Firebase", "Google Maps", "Booking APIs", "Node.js"],
    category: "Mobile Development",
    duration: "7 months",
    team: "6 developers",
    features: ["Itinerary Planning", "Booking Management", "Local Recommendations", "Offline Maps"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Financial Management App",
    description: "Personal finance management app with expense tracking, budgeting, and investment portfolio management.",
    image: "https://images.pexels.com/photos/8386555/pexels-photo-8386555.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React Native", "Firebase", "Plaid API", "Chart.js", "Node.js"],
    category: "Mobile Development",
    duration: "8 months",
    team: "6 developers",
    features: ["Expense Tracking", "Budgeting", "Investment Tracking", "Financial Reports"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Language Learning App",
    description: "Interactive language learning app with speech recognition, gamification, and personalized lessons.",
    image: "https://images.pexels.com/photos/8386560/pexels-photo-8386560.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Flutter", "Firebase", "Speech Recognition", "AI/ML", "Dart"],
    category: "Mobile Development",
    duration: "9 months",
    team: "7 developers",
    features: ["Speech Recognition", "Gamification", "Personalized Lessons", "Progress Tracking"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Shopping Assistant App",
    description: "AI-powered shopping assistant with price comparison, product recommendations, and shopping list management.",
    image: "https://images.pexels.com/photos/8386565/pexels-photo-8386565.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React Native", "Firebase", "AI/ML", "Barcode Scanner", "Node.js"],
    category: "Mobile Development",
    duration: "6 months",
    team: "5 developers",
    features: ["Price Comparison", "Product Recommendations", "Shopping Lists", "Barcode Scanning"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Event Planning App",
    description: "Comprehensive event planning app with guest management, budget tracking, and vendor coordination.",
    image: "https://images.pexels.com/photos/8386570/pexels-photo-8386570.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Flutter", "Firebase", "Google Calendar", "Stripe", "Dart"],
    category: "Mobile Development",
    duration: "8 months",
    team: "6 developers",
    features: ["Guest Management", "Budget Tracking", "Vendor Coordination", "Timeline Planning"],
    demoUrl: "#",
    githubUrl: "#"
  },

  // Data Analytics Projects (10)
  {
    title: "FinTech Trading Dashboard",
    description: "Real-time financial analytics and trading platform with advanced charting, portfolio management, and automated trading algorithms.",
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
    title: "Business Intelligence Platform",
    description: "Comprehensive BI platform with data visualization, reporting, and predictive analytics for business decision making.",
    image: "https://images.pexels.com/photos/8386575/pexels-photo-8386575.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Python", "Tableau", "PostgreSQL", "Apache Kafka"],
    category: "Data Analytics",
    duration: "12 months",
    team: "9 developers",
    features: ["Data Visualization", "Interactive Dashboards", "Predictive Analytics", "Automated Reports"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Customer Analytics System",
    description: "Advanced customer analytics platform with segmentation, behavior analysis, and churn prediction.",
    image: "https://images.pexels.com/photos/8386580/pexels-photo-8386580.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Angular", "Python", "Pandas", "Scikit-learn", "MongoDB"],
    category: "Data Analytics",
    duration: "8 months",
    team: "6 developers",
    features: ["Customer Segmentation", "Behavior Analysis", "Churn Prediction", "ROI Tracking"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Supply Chain Analytics",
    description: "End-to-end supply chain analytics platform with demand forecasting, inventory optimization, and performance monitoring.",
    image: "https://images.pexels.com/photos/8386585/pexels-photo-8386585.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Vue.js", "Python", "Apache Spark", "PostgreSQL", "Docker"],
    category: "Data Analytics",
    duration: "11 months",
    team: "8 developers",
    features: ["Demand Forecasting", "Inventory Optimization", "Performance Monitoring", "Risk Assessment"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Marketing Analytics Dashboard",
    description: "Comprehensive marketing analytics platform with campaign tracking, attribution modeling, and ROI analysis.",
    image: "https://images.pexels.com/photos/8386590/pexels-photo-8386590.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Python", "Google Analytics API", "MongoDB", "Redis"],
    category: "Data Analytics",
    duration: "7 months",
    team: "5 developers",
    features: ["Campaign Tracking", "Attribution Modeling", "ROI Analysis", "A/B Testing"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Healthcare Analytics Platform",
    description: "Healthcare analytics platform with patient outcome analysis, resource optimization, and clinical decision support.",
    image: "https://images.pexels.com/photos/8386595/pexels-photo-8386595.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Angular", "Python", "TensorFlow", "PostgreSQL", "HIPAA"],
    category: "Data Analytics",
    duration: "14 months",
    team: "10 developers",
    features: ["Patient Outcomes", "Resource Optimization", "Clinical Support", "Compliance"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Real-time Data Streaming Platform",
    description: "Real-time data streaming and processing platform with live analytics and alerting capabilities.",
    image: "https://images.pexels.com/photos/8386600/pexels-photo-8386600.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Apache Kafka", "Apache Spark", "Elasticsearch", "Docker"],
    category: "Data Analytics",
    duration: "9 months",
    team: "7 developers",
    features: ["Real-time Processing", "Live Analytics", "Alerting System", "Scalable Architecture"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Performance Monitoring System",
    description: "Comprehensive performance monitoring and analytics platform for applications and infrastructure.",
    image: "https://images.pexels.com/photos/8386605/pexels-photo-8386605.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Vue.js", "Python", "Prometheus", "Grafana", "Kubernetes"],
    category: "Data Analytics",
    duration: "8 months",
    team: "6 developers",
    features: ["Performance Monitoring", "Alerting", "Visualization", "Root Cause Analysis"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Sales Analytics Platform",
    description: "Advanced sales analytics platform with pipeline analysis, forecasting, and performance optimization.",
    image: "https://images.pexels.com/photos/8386610/pexels-photo-8386610.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Python", "Salesforce API", "PostgreSQL", "Redis"],
    category: "Data Analytics",
    duration: "7 months",
    team: "5 developers",
    features: ["Pipeline Analysis", "Sales Forecasting", "Performance Optimization", "Commission Tracking"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "IoT Analytics Platform",
    description: "IoT data analytics platform with device monitoring, predictive maintenance, and performance optimization.",
    image: "https://images.pexels.com/photos/8386615/pexels-photo-8386615.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Angular", "Python", "Apache Kafka", "InfluxDB", "Docker"],
    category: "Data Analytics",
    duration: "10 months",
    team: "8 developers",
    features: ["Device Monitoring", "Predictive Maintenance", "Performance Optimization", "Real-time Alerts"],
    demoUrl: "#",
    githubUrl: "#"
  },

  // IoT Development Projects (10)
  {
    title: "Smart City IoT Platform",
    description: "An IoT management platform for smart city infrastructure, monitoring traffic, air quality, and energy consumption.",
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
    title: "Smart Home Automation System",
    description: "Comprehensive smart home automation platform with device control, energy management, and security monitoring.",
    image: "https://images.pexels.com/photos/8386620/pexels-photo-8386620.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Node.js", "MQTT", "MongoDB", "Raspberry Pi"],
    category: "IoT Development",
    duration: "8 months",
    team: "6 developers",
    features: ["Device Control", "Energy Management", "Security Monitoring", "Voice Control"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Industrial IoT Monitoring",
    description: "Industrial IoT platform for equipment monitoring, predictive maintenance, and operational efficiency.",
    image: "https://images.pexels.com/photos/8386625/pexels-photo-8386625.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Vue.js", "Python", "Apache Kafka", "InfluxDB", "Docker"],
    category: "IoT Development",
    duration: "11 months",
    team: "8 developers",
    features: ["Equipment Monitoring", "Predictive Maintenance", "Operational Efficiency", "Alert System"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Agricultural IoT Platform",
    description: "Smart agriculture platform with soil monitoring, weather tracking, and automated irrigation systems.",
    image: "https://images.pexels.com/photos/8386630/pexels-photo-8386630.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Python", "MQTT", "PostgreSQL", "AWS IoT"],
    category: "IoT Development",
    duration: "9 months",
    team: "7 developers",
    features: ["Soil Monitoring", "Weather Tracking", "Automated Irrigation", "Crop Analytics"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Healthcare IoT Monitoring",
    description: "Healthcare IoT platform for patient monitoring, medical device management, and health data analytics.",
    image: "https://images.pexels.com/photos/8386635/pexels-photo-8386635.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Angular", "Python", "MQTT", "MongoDB", "HIPAA"],
    category: "IoT Development",
    duration: "12 months",
    team: "9 developers",
    features: ["Patient Monitoring", "Device Management", "Health Analytics", "Compliance"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Retail IoT Analytics",
    description: "Retail IoT platform with customer behavior tracking, inventory management, and store optimization.",
    image: "https://images.pexels.com/photos/8386640/pexels-photo-8386640.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Vue.js", "Python", "Apache Kafka", "Redis", "Docker"],
    category: "IoT Development",
    duration: "8 months",
    team: "6 developers",
    features: ["Customer Tracking", "Inventory Management", "Store Optimization", "Analytics"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Transportation IoT System",
    description: "Transportation IoT platform with fleet management, route optimization, and real-time tracking.",
    image: "https://images.pexels.com/photos/8386645/pexels-photo-8386645.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Node.js", "MQTT", "PostgreSQL", "Google Maps"],
    category: "IoT Development",
    duration: "10 months",
    team: "7 developers",
    features: ["Fleet Management", "Route Optimization", "Real-time Tracking", "Fuel Monitoring"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Energy Management IoT",
    description: "Smart energy management platform with consumption monitoring, renewable energy integration, and grid optimization.",
    image: "https://images.pexels.com/photos/8386650/pexels-photo-8386650.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Angular", "Python", "Apache Kafka", "InfluxDB", "Docker"],
    category: "IoT Development",
    duration: "11 months",
    team: "8 developers",
    features: ["Consumption Monitoring", "Renewable Integration", "Grid Optimization", "Cost Analysis"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Environmental Monitoring IoT",
    description: "Environmental monitoring platform with air quality, water quality, and climate data collection.",
    image: "https://images.pexels.com/photos/8386655/pexels-photo-8386655.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["Vue.js", "Python", "MQTT", "MongoDB", "AWS IoT"],
    category: "IoT Development",
    duration: "9 months",
    team: "7 developers",
    features: ["Air Quality Monitoring", "Water Quality", "Climate Data", "Alert System"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Wearable IoT Platform",
    description: "Wearable IoT platform with health monitoring, activity tracking, and personalized insights.",
    image: "https://images.pexels.com/photos/8386660/pexels-photo-8386660.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tech: ["React", "Python", "MQTT", "PostgreSQL", "Mobile SDK"],
    category: "IoT Development",
    duration: "8 months",
    team: "6 developers",
    features: ["Health Monitoring", "Activity Tracking", "Personalized Insights", "Mobile App"],
    demoUrl: "#",
    githubUrl: "#"
  }
];

const Projects: React.FC = () => {
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(allProjects.map(project => project.category)))];

  // Filter projects by category
  const filteredProjects = selectedCategory === 'All' 
    ? allProjects 
    : allProjects.filter(project => project.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Projects</h1>
          <p className="text-gray-600 mb-6">Explore our diverse portfolio of innovative solutions across different domains.</p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category} ({selectedCategory === category ? filteredProjects.length : allProjects.filter(p => p.category === category).length})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <div key={project.id || idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              {project.image && (
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4 flex-1 text-sm leading-relaxed">{project.description}</p>
                
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">{project.category}</span>
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                    <Calendar className="inline w-3 h-3 mr-1" />
                    {project.duration}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-2">
                    <Users className="inline w-3 h-3 mr-1" />
                    {project.team}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 4).map((tech, techIdx) => (
                      <span key={techIdx} className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{project.tech.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.features.slice(0, 3).map((feature, featureIdx) => (
                      <span key={featureIdx} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                    {project.features.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{project.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-auto">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                      <ExternalLink className="w-4 h-4 mr-1" /> Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-800 hover:text-gray-600 transition-colors">
                      <Github className="w-4 h-4 mr-1" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">No projects match the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;