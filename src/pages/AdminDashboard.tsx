import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Clock, CheckCircle, User, Mail, Calendar, Check, Send, AlertCircle, PlusCircle } from 'lucide-react';

interface Query {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: any;
  status: 'pending' | 'resolved';
}

interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  status: 'in-progress' | 'completed' | 'delayed';
  timestamp: any;
  userId?: string; // If update is for specific user
}

interface Project {
  id: string;
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

const AdminDashboard: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const { userProfile } = useAuth();

  // Project update states
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateStatus, setUpdateStatus] = useState<'in-progress' | 'completed' | 'delayed'>('in-progress');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isSendingUpdate, setIsSendingUpdate] = useState(false);

  // Project add states
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectDuration, setProjectDuration] = useState('');
  const [projectTeam, setProjectTeam] = useState('');
  const [projectFeatures, setProjectFeatures] = useState('');
  const [projectDemoUrl, setProjectDemoUrl] = useState('');
  const [projectGithubUrl, setProjectGithubUrl] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'queries'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Query[];
      
      setQueries(queriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsData);
    });
    return () => unsubscribe();
  }, []);

  const handleMarkResolved = async (queryId: string) => {
    try {
      await updateDoc(doc(db, 'queries', queryId), {
        status: 'resolved'
      });
    } catch (error) {
      console.error('Error updating query status:', error);
    }
  };

  const handleSendUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateDescription.trim()) return;

    try {
      setIsSendingUpdate(true);
      
      const updateData = {
        title: updateTitle.trim(),
        description: updateDescription.trim(),
        status: updateStatus,
        timestamp: serverTimestamp(),
        ...(selectedUserId && { userId: selectedUserId })
      };

      await addDoc(collection(db, 'projectUpdates'), updateData);
      
      // Reset form
      setUpdateTitle('');
      setUpdateDescription('');
      setUpdateStatus('in-progress');
      setSelectedUserId('');
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error sending update:', error);
    } finally {
      setIsSendingUpdate(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDescription.trim()) return;
    setIsAddingProject(true);
    try {
      await addDoc(collection(db, 'projects'), {
        title: projectTitle.trim(),
        description: projectDescription.trim(),
        image: projectImage.trim(),
        tech: projectTech.split(',').map(t => t.trim()).filter(Boolean),
        category: projectCategory.trim(),
        duration: projectDuration.trim(),
        team: projectTeam.trim(),
        features: projectFeatures.split(',').map(f => f.trim()).filter(Boolean),
        demoUrl: projectDemoUrl.trim(),
        githubUrl: projectGithubUrl.trim(),
        createdAt: serverTimestamp(),
      });
      setProjectTitle('');
      setProjectDescription('');
      setProjectImage('');
      setProjectTech('');
      setProjectCategory('');
      setProjectDuration('');
      setProjectTeam('');
      setProjectFeatures('');
      setProjectDemoUrl('');
      setProjectGithubUrl('');
      setShowProjectForm(false);
    } catch (err) {
      // Optionally handle error
    }
    setIsAddingProject(false);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  const filteredQueries = queries.filter(query => {
    if (filter === 'all') return true;
    return query.status === filter;
  });

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage user queries and project updates</p>
        </div>

        {/* Project Update Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Project Updates</h2>
            <button
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{showUpdateForm ? 'Cancel' : 'Send Update'}</span>
            </button>
          </div>

          {showUpdateForm && (
            <form onSubmit={handleSendUpdate} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Update Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Update Description
                </label>
                <textarea
                  id="description"
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as 'in-progress' | 'completed' | 'delayed')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>

              <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                  Send to Specific User (Optional)
                </label>
                <select
                  id="user"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Users</option>
                  {queries.map((query) => (
                    <option key={query.userId} value={query.userId}>
                      {query.name} ({query.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSendingUpdate}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingUpdate ? 'Sending...' : 'Send Update'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Project Add Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Project</h2>
            <button
              onClick={() => setShowProjectForm(!showProjectForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showProjectForm ? 'Cancel' : 'Add Project'}</span>
            </button>
          </div>
          {showProjectForm && (
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input type="text" value={projectImage} onChange={e => setProjectImage(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tech Stack (comma separated)</label>
                <input type="text" value={projectTech} onChange={e => setProjectTech(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input type="text" value={projectCategory} onChange={e => setProjectCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input type="text" value={projectDuration} onChange={e => setProjectDuration(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Team</label>
                <input type="text" value={projectTeam} onChange={e => setProjectTeam(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
                <input type="text" value={projectFeatures} onChange={e => setProjectFeatures(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Demo URL</label>
                <input type="text" value={projectDemoUrl} onChange={e => setProjectDemoUrl(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                <input type="text" value={projectGithubUrl} onChange={e => setProjectGithubUrl(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={isAddingProject} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAddingProject ? 'Adding...' : 'Add Project'}</span>
                </button>
              </div>
            </form>
          )}
          {/* List of existing projects for reference */}
          {projects.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Existing Projects</h3>
              <ul className="space-y-2">
                {projects.map(p => (
                  <li key={p.id} className="border rounded px-3 py-2 bg-gray-50">
                    <span className="font-medium">{p.title}</span> - <span className="text-gray-600">{p.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900">{queries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queries.filter(q => q.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queries.filter(q => q.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Queries
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'resolved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Queries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              User Queries ({filteredQueries.length})
            </h2>
          </div>
          
          {filteredQueries.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "No user queries have been submitted yet."
                  : `No ${filter} queries at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredQueries.map((query) => (
                <div key={query.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {query.subject}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{query.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{query.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(query.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        query.status === 'pending' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {query.status === 'pending' ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved
                          </>
                        )}
                      </span>
                      
                      {query.status === 'pending' && (
                        <button
                          onClick={() => handleMarkResolved(query.id)}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {query.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;