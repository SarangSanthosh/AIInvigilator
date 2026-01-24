import React, { useEffect, useState } from 'react';
import { malpracticeAPI, lectureHallAPI } from '../api/endpoints';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MalpracticeLogs = () => {
  const [malpractices, setMalpractices] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    building: '',
    verified: '',
    search: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [malpracticesRes, buildingsRes] = await Promise.all([
        malpracticeAPI.getAll(),
        lectureHallAPI.getBuildings(),
      ]);
      setMalpractices(malpracticesRes.data);
      setBuildings(buildingsRes.data.map(b => ({ value: b, label: b })));
    } catch (error) {
      toast.error('Failed to load malpractice logs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.building) params.building = filters.building;
      if (filters.verified) params.verified = filters.verified === 'true';
      if (filters.search) params.search = filters.search;

      const response = await malpracticeAPI.getAll(params);
      setMalpractices(response.data);
    } catch (error) {
      toast.error('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await malpracticeAPI.verify(id);
      toast.success('Malpractice verified successfully');
      applyFilters();
    } catch (error) {
      toast.error('Failed to verify malpractice');
    }
  };

  const handleUnverify = async (id) => {
    try {
      await malpracticeAPI.unverify(id);
      toast.success('Malpractice unverified');
      applyFilters();
    } catch (error) {
      toast.error('Failed to unverify malpractice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;

    try {
      await malpracticeAPI.delete(id);
      toast.success('Log deleted successfully');
      applyFilters();
    } catch (error) {
      toast.error('Failed to delete log');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilters = () => {
    setFilters({
      building: '',
      verified: '',
      search: '',
    });
  };

  const getMalpracticeIcon = (type) => {
    const icons = {
      mobile: '📱',
      paper_passing: '📝',
      hand_raise: '🤚',
      turning_back: '↩️',
      leaning: '🔄',
    };
    return icons[type] || '⚠️';
  };

  if (loading && malpractices.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">Malpractice Logs</h1>
        <p className="text-gray-600 text-lg">Review and manage detected malpractice incidents</p>
        <div className="mt-4 flex justify-center">
          <div className="h-1 w-32 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full"></div>
        </div>
      </div>

      {/* Filters */}
      <Card title="Filters" subtitle="Filter malpractice logs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            name="building"
            value={filters.building}
            onChange={handleFilterChange}
            options={buildings}
            placeholder="All Buildings"
            label="Building"
          />

          <Select
            name="verified"
            value={filters.verified}
            onChange={handleFilterChange}
            options={[
              { value: 'true', label: 'Verified' },
              { value: 'false', label: 'Unverified' },
            ]}
            placeholder="All Status"
            label="Status"
          />

          <Input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by type or hall..."
            label="Search"
            icon={<span>🔍</span>}
          />

          <div className="flex items-end">
            <Button onClick={resetFilters} variant="outline" fullWidth>
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Malpractices List */}
      <Card>
        {loading ? (
          <Loading />
        ) : malpractices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-600 text-lg">No malpractices found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {malpractices.map((item) => (
              <div
                key={item.id}
                className="p-4 border-2 border-gray-100 rounded-xl hover:border-primary-300 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-white to-gray-50/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-4xl">{getMalpracticeIcon(item.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          {item.type.replace('_', ' ').toUpperCase()}
                        </h3>
                        {item.verified ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            ⏳ Pending
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <span className="font-semibold">Hall:</span> {item.lecture_hall_name}
                        </div>
                        <div>
                          <span className="font-semibold">Detected:</span>{' '}
                          {format(new Date(item.detected_at), 'PPpp')}
                        </div>
                        {item.image_path && (
                          <div>
                            <span className="font-semibold">Evidence:</span>{' '}
                            <a
                              href={item.image_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:underline"
                            >
                              View Image
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {!item.verified ? (
                      <Button size="sm" onClick={() => handleVerify(item.id)}>
                        Verify
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleUnverify(item.id)}>
                        Unverify
                      </Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Summary */}
      {malpractices.length > 0 && (
        <div className="flex justify-center space-x-4">
          <div className="glass-effect px-6 py-3 rounded-full">
            <span className="font-semibold">Total:</span> {malpractices.length}
          </div>
          <div className="glass-effect px-6 py-3 rounded-full">
            <span className="font-semibold">Verified:</span>{' '}
            {malpractices.filter((m) => m.verified).length}
          </div>
          <div className="glass-effect px-6 py-3 rounded-full">
            <span className="font-semibold">Pending:</span>{' '}
            {malpractices.filter((m) => !m.verified).length}
          </div>
        </div>
      )}
    </div>
  );
};

export default MalpracticeLogs;
