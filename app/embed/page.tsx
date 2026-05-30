export default function Embed() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: transparent;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .widget {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #141417;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 14px;
            padding: 10px 16px 10px 14px;
            text-decoration: none;
            transition: opacity 0.15s;
          }
          .widget:hover { opacity: 0.85; }
          .icon {
            font-size: 22px;
            line-height: 1;
          }
          .text {
            display: flex;
            flex-direction: column;
            gap: 1px;
          }
          .label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.4);
          }
          .cta {
            font-size: 15px;
            font-weight: 700;
            color: #22c55e;
          }
        `}</style>
      </head>
      <body>
        <a
          className="widget"
          href="https://giverishaanmoney.rishaan.cc"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">💸</span>
          <span className="text">
            <span className="label">support rishaan</span>
            <span className="cta">Give Rishaan Money →</span>
          </span>
        </a>
      </body>
    </html>
  );
}
