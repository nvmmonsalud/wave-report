import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  const size = { width: 1200, height: 630 };
  const { width, height } = size;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #0f172a 0%, #0c4a6e 50%, #0e7490 100%)',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Wave curve at the bottom */}
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
        >
          <path
            d={`M0 ${height * 0.85} Q ${width * 0.25} ${height * 0.7}, ${width * 0.5} ${height * 0.85} T ${width} ${height * 0.85}`}
            stroke="#67e8f9"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />
          <path
            d={`M0 ${height * 0.95} Q ${width * 0.25} ${height * 0.8}, ${width * 0.5} ${height * 0.95} T ${width} ${height * 0.95}`}
            stroke="#67e8f9"
            strokeWidth="3"
            fill="none"
            opacity="0.3"
          />
        </svg>

        {/* Top: Title block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, marginTop: 60 }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
              marginBottom: 20,
              letterSpacing: '-3px',
            }}
          >
            Wave Report
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#a5f3fc',
              textAlign: 'center',
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            Rate the breaks. Track the vibes. Find your next wave.
          </div>
        </div>

        {/* Middle: Stats row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 60,
            zIndex: 1,
          }}
        >
          <StatCard label="Spots" value="6" />
          <StatCard label="Avg Rating" value="4.5" />
          <StatCard label="Biggest Wave" value="12ft" />
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 24,
            color: '#67e8f9',
            zIndex: 1,
            opacity: 0.8,
          }}
        >
          Built with Next.js + GLM 5.2  ·  AI Coach powered by Claude
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    }
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 40px',
        background: 'rgba(8, 145, 178, 0.2)',
        border: '2px solid rgba(103, 232, 249, 0.4)',
        borderRadius: 16,
        minWidth: 200,
      }}
    >
      <div style={{ fontSize: 56, fontWeight: 900, color: 'white', lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 20,
          color: '#a5f3fc',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
}
