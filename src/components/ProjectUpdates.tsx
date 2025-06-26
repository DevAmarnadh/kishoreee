import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  status: 'in-progress' | 'completed' | 'delayed';
  timestamp: any;
  userId?: string;
}

const ProjectUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.uid) return;

    // Only run the query if user.uid is defined and not empty
    const userIds = [user.uid, null].filter(Boolean);
    if (userIds.length === 0) return;

    const q = query(
      collection(db, 'projectUpdates'),
      where('userId', 'in', userIds),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectUpdate[];
      
      setUpdates(updatesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No project updates available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {updates.map((update) => (
        <div key={update.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {update.title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
              {getStatusIcon(update.status)}
              <span className="ml-1.5 capitalize">{update.status.replace('-', ' ')}</span>
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">
            {update.description}
          </p>
          
          <div className="text-sm text-gray-500">
            {formatDate(update.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectUpdates; 