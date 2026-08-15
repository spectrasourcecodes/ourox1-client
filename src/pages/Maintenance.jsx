import React from "react";

const Maintenance = () => {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .maintenance-page {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a, #111827, #020617);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Arial, sans-serif;
          overflow: hidden;
          color: white;
          padding: 20px;
          position: relative;
        }

        .bg-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: rgba(59, 130, 246, 0.2);
          filter: blur(120px);
          border-radius: 50%;
          top: -100px;
          left: -100px;
        }

        .bg-glow2 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: rgba(168, 85, 247, 0.2);
          filter: blur(120px);
          border-radius: 50%;
          bottom: -100px;
          right: -100px;
        }

        .container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 650px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(14px);
          padding: 50px 35px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }

        .badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
          font-size: 14px;
          margin-bottom: 24px;
          border: 1px solid rgba(147, 197, 253, 0.2);
        }

        .icon {
          font-size: 70px;
          margin-bottom: 20px;
        }

        .title {
          font-size: 42px;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .description {
          color: #cbd5e1;
          font-size: 17px;
          line-height: 1.7;
          margin-bottom: 30px;
        }

        .status-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 18px;
          border-radius: 16px;
          margin-bottom: 30px;
        }

        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #fbbf24;
          font-size: 15px;
        }

        .dot {
          width: 10px;
          height: 10px;
          background: #fbbf24;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        .btn {
          display: inline-block;
          text-decoration: none;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: bold;
          transition: 0.3s ease;
          box-shadow: 0 8px 25px rgba(37,99,235,0.3);
        }

        .btn:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }

        .footer {
          margin-top: 35px;
          color: #94a3b8;
          font-size: 14px;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 600px) {
          .title {
            font-size: 32px;
          }

          .container {
            padding: 40px 25px;
          }

          .description {
            font-size: 15px;
          }
        }
      `}</style>

      <div className="maintenance-page">
        <div className="bg-glow"></div>
        <div className="bg-glow2"></div>

        <div className="container">
          <div className="badge">🚧 Scheduled Maintenance</div>

          <div className="icon">🛠️</div>

          <h1 className="title">We're Improving Things</h1>

          <p className="description">
            Our website is currently under maintenance to improve
            performance, security, and user experience.
            Please check back shortly.
          </p>

          <div className="status-box">
            <div className="status">
              <div className="dot"></div>
              Maintenance in progress...
            </div>
          </div>

          <a href="/" className="btn">
            Refresh Page
          </a>

          <div className="footer">
            © 2026 Your Ouro Invest. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
};

export default Maintenance;