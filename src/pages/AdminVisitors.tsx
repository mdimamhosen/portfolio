import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Visitor {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  page_url: string | null;
  screen_resolution: string | null;
  language: string | null;
  timezone: string | null;
  visited_at: string;
  country: string | null;
  city: string | null;
}

const AdminVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      setError('');

      const endpoint = import.meta.env.VITE_VISITOR_API_URL;
      if (!endpoint) {
        setError('Missing VITE_VISITOR_API_URL. Please configure your serverless endpoint.');
        setLoading(false);
        return;
      }

      const headers: Record<string, string> = {};
      const apiKey = import.meta.env.VITE_VISITOR_API_KEY;
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(endpoint, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch visitors: ${response.status}`);
      }

      const data = await response.json();
      setVisitors(Array.isArray(data) ? data : data?.visitors || []);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to load visitors. Check your endpoint or network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Visitor Analytics</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchVisitors}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground"
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className="glass-card p-4 mb-6">
          <p className="text-lg">Total Visitors: <span className="text-primary font-bold">{visitors.length}</span></p>
        </div>

        {error && (
          <div className="glass-card p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading visitors...</div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium">Visited At</th>
                    <th className="text-left p-4 font-medium">Page</th>
                    <th className="text-left p-4 font-medium">Resolution</th>
                    <th className="text-left p-4 font-medium">Language</th>
                    <th className="text-left p-4 font-medium">Timezone</th>
                    <th className="text-left p-4 font-medium">Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-4">
                        {format(new Date(visitor.visited_at), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="p-4 max-w-[200px] truncate">{visitor.page_url}</td>
                      <td className="p-4">{visitor.screen_resolution}</td>
                      <td className="p-4">{visitor.language}</td>
                      <td className="p-4">{visitor.timezone}</td>
                      <td className="p-4 max-w-[150px] truncate">{visitor.referrer || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVisitors;
