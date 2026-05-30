"use client";

import Image from "next/image";

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
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
                         'SF Pro Text', 'Helvetica Neue', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            padding: 8px;
            -webkit-font-smoothing: antialiased;
          }

          .pill {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            max-width: 420px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(40px) saturate(180%);
            -webkit-backdrop-filter: blur(40px) saturate(180%);
            border: 0.5px solid rgba(0, 0, 0, 0.1);
            border-radius: 999px;
            padding: 8px 8px 8px 12px;
            box-shadow:
              0 2px 4px rgba(0,0,0,0.04),
              0 6px 20px rgba(0,0,0,0.08),
              0 1px 0 rgba(255,255,255,0.9) inset;
          }

          .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
            border: 0.5px solid rgba(0,0,0,0.08);
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
          }

          .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .meta {
            flex: 1;
            min-width: 0;
          }

          .name {
            font-size: 13px;
            font-weight: 600;
            color: #1c1c1e;
            letter-spacing: -0.2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .tagline {
            font-size: 11px;
            color: #8e8e93;
            letter-spacing: -0.1px;
            margin-top: 1px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .cta {
            flex-shrink: 0;
            display: block;
            background: #007aff;
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            font-family: inherit;
            letter-spacing: -0.2px;
            border: none;
            border-radius: 999px;
            padding: 9px 18px;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 1px 4px rgba(0,122,255,0.3);
            transition: all 0.15s cubic-bezier(0.25,0.46,0.45,0.94);
            white-space: nowrap;
          }

          .cta:active {
            transform: scale(0.96);
            background: #0071eb;
          }
        `}</style>
      </head>
      <body>
        <div className="pill">
          <div className="avatar">
            <Image src="/monogram.png" alt="Rishaan" width={36} height={36} />
          </div>

          <div className="meta">
            <div className="name">Rishaan Jain</div>
            <div className="tagline">buy rishaan a meal 🍕</div>
          </div>

          <a
            href="https://giverishaanmoney.rishaan.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="cta"
          >
            Give Money
          </a>
        </div>
      </body>
    </html>
  );
}
