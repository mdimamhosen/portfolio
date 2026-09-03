import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Visitor {
  id: string;
  session_id?: string;
  ip_address: string | null;
  user_agent: string | null;
  browser?: string | null;
  browser_version?: string | null;
  os?: string | null;
  device_type?: string | null;
  referrer: string | null;
  page_url: string | null;
  landing_page?: string | null;
  screen_resolution: string | null;
  viewport?: string | null;
  language: string | null;
  timezone: string | null;
  visited_at: string;
  country: string | null;
  country_code?: string | null;
  region?: string | null;
  city: string | null;
  postal?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isp?: string | null;
  asn?: string | null;
  email?: string | null;
  name?: string | null;
  visit_count?: number | null;
  hit_count?: number | null;
  connection_type?: string | null;
  gpu_renderer?: string | null;
  utm?: Record<string, string> | null;
}

const AdminVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Visitor | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      setError('');

      const endpoint = import.meta.env.VITE_VISITOR_API_URL || '/api/visitors';
      const headers: Record<string, string> = {};
      const apiKey = import.meta.env.VITE_VISITOR_API_KEY || import.meta.env.VITE_TRACKING_API_KEY;
      if (apiKey) {
        headers.Authorization = `Bearer ${apiKey}`;
      }

      const response = await fetch(endpoint, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch visitors: ${response.status}`);
      }

      const data = await response.json();
      setVisitors(Array.isArray(data) ? data : data?.visitors || []);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to load visitors. Check your endpoint, MongoDB, or network.');
    } finally {
      setLoading(false);
    }
  };

  const withEmail = visitors.filter((v) => v.email).length;
  const countries = new Set(visitors.map((v) => v.country).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Sessions</p>
            <p className="text-2xl font-bold text-primary">{visitors.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Countries</p>
            <p className="text-2xl font-bold text-primary">{countries}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Emails captured (via contact form)</p>
            <p className="text-2xl font-bold text-primary">{withEmail}</p>
          </div>
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
                    <th className="text-left p-4 font-medium">Visited</th>
                    <th className="text-left p-4 font-medium">IP / Location</th>
                    <th className="text-left p-4 font-medium">Device</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-left p-4 font-medium">Page</th>
                    <th className="text-left p-4 font-medium">Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr
                      key={visitor.id || visitor.session_id}
                      className="border-b border-border/50 hover:bg-muted/20 cursor-pointer"
                      onClick={() => setSelected(visitor)}
                    >
                      <td className="p-4 whitespace-nowrap">
                        {visitor.visited_at
                          ? format(new Date(visitor.visited_at), 'MMM dd, yyyy HH:mm')
                          : '-'}
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-xs">{visitor.ip_address || '-'}</div>
                        <div className="text-muted-foreground text-xs">
                          {[visitor.city, visitor.region, visitor.country].filter(Boolean).join(', ') || 'Unknown'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>{[visitor.browser, visitor.browser_version].filter(Boolean).join(' ') || '-'}</div>
                        <div className="text-muted-foreground text-xs">
                          {[visitor.os, visitor.device_type].filter(Boolean).join(' · ') || visitor.screen_resolution}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>{visitor.name || '-'}</div>
                        <div className="text-muted-foreground text-xs truncate max-w-[160px]">
                          {visitor.email || '—'}
                        </div>
                      </td>
                      <td className="p-4 max-w-[180px] truncate">{visitor.page_url || '-'}</td>
                      <td className="p-4 max-w-[140px] truncate">{visitor.referrer || 'direct'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selected && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="glass-card-glow max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Visitor Detail</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  ['IP', selected.ip_address],
                  ['Country', selected.country],
                  ['Region', selected.region],
                  ['City', selected.city],
                  ['Postal', selected.postal],
                  ['Coords', selected.latitude != null ? `${selected.latitude}, ${selected.longitude}` : null],
                  ['ISP', selected.isp],
                  ['ASN', selected.asn],
                  ['Timezone', selected.timezone],
                  ['Browser', [selected.browser, selected.browser_version].filter(Boolean).join(' ')],
                  ['OS', selected.os],
                  ['Device', selected.device_type],
                  ['Screen', selected.screen_resolution],
                  ['Viewport', selected.viewport],
                  ['Language', selected.language],
                  ['Connection', selected.connection_type],
                  ['GPU', selected.gpu_renderer],
                  ['Visits', selected.visit_count ?? selected.hit_count],
                  ['Name', selected.name],
                  ['Email', selected.email],
                  ['Landing', selected.landing_page],
                  ['Page', selected.page_url],
                  ['Referrer', selected.referrer],
                  ['UTM', selected.utm ? JSON.stringify(selected.utm) : null],
                  ['User Agent', selected.user_agent],
                ].map(([label, value]) => (
                  <div key={String(label)} className="border border-border/40 rounded-md p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                    <p className="break-all">{value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVisitors;
