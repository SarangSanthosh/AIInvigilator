import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../api/endpoints';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const statCards = [
    {
      title: 'Total Malpractices',
      value: stats?.total_malpractices || 0,
      icon: '⚠️',
      color: 'from-red-500 to-pink-500',
      link: '/malpractice-logs',
    },
    {
      title: 'Verified Cases',
      value: stats?.verified_malpractices || 0,
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Pending Review',
      value: stats?.unverified_malpractices || 0,
      icon: '⏳',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Lecture Halls',
      value: stats?.total_lecture_halls || 0,
      icon: '🏛️',
      color: 'from-blue-500 to-cyan-500',
      link: '/lecture-halls',
    },
  ];

  const recentMalpractices = stats?.recent_malpractices || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">Dashboard</h1>
        <p className="text-gray-600 text-lg">Overview of examination monitoring system</p>
        <div className="mt-4 flex justify-center">
          <div className="h-1 w-32 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            hover
            glass
            className={`bg-gradient-to-br ${stat.color} text-white relative overflow-hidden transform transition-all duration-500 hover:scale-105`}
          >
            <div className="absolute top-0 right-0 opacity-10 text-9xl -mt-4 -mr-4 animate-pulse-slow">
              {stat.icon}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-5xl">{stat.icon}</span>
                <span className="text-4xl font-bold">{stat.value}</span>
              </div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              {stat.link && (
                <Link
                  to={stat.link}
                  className="mt-3 inline-block text-sm font-semibold underline hover:no-underline"
                >
                  View Details →
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Malpractices */}
      <Card title="Recent Malpractices" subtitle="Latest detected incidents">
        {recentMalpractices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-600 text-lg">No recent malpractices detected</p>
            <p className="text-gray-500 mt-2">Great job maintaining academic integrity!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMalpractices.slice(0, 5).map((malpractice) => (
              <div
                key={malpractice.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">
                    {malpractice.type === 'mobile' ? '📱' : 
                     malpractice.type === 'paper_passing' ? '📝' : 
                     malpractice.type === 'hand_raise' ? '🤚' : '⚠️'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {malpractice.type.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {malpractice.lecture_hall_name} - {new Date(malpractice.detected_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div>
                  {malpractice.verified ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      ⏳ Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <Button to="/malpractice-logs" variant="outline">
                View All Malpractices
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Malpractice Logs</h3>
          <p className="text-gray-600 mb-4">
            View and manage all detected malpractice incidents
          </p>
          <Button to="/malpractice-logs">View Logs</Button>
        </Card>

        <Card hover className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-xl font-bold mb-2">Lecture Halls</h3>
          <p className="text-gray-600 mb-4">
            Manage lecture halls and monitoring settings
          </p>
          <Button to="/lecture-halls">Manage Halls</Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
