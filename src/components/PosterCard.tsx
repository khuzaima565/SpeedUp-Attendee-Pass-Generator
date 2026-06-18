import React from "react";

interface PosterCardProps {
  name: string;
  position: string;
  imageUrl: string;
  bgImageUrl: string;
  badgeText: string;
  title: string;
  titleAccent: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  scale?: number;
}

export const PosterCard = React.forwardRef<HTMLDivElement, PosterCardProps>(
  (
    {
      name,
      position,
      imageUrl,
      bgImageUrl,
      badgeText,
      title,
      titleAccent,
      description,
      eventDate,
      eventTime,
      venue,
      scale = 1,
    },
    ref
  ) => {
    // Exact colors from user template styled inline or embedded in scoped way
    const cardStyle: React.CSSProperties = {
      width: "1080px",
      height: "1080px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
      transform: scale !== 1 ? `scale(${scale})` : undefined,
      transformOrigin: "top left",
      backgroundColor: "#110b0b",
    };

    return (
      <div
        id="attendee-card-poster"
        ref={ref}
        style={cardStyle}
        className="text-[#ffffff]"
      >
        {/* Background Image Template */}
        <img
          src={bgImageUrl}
          alt="Poster Background"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: "1080px",
            objectFit: "fill",
            zIndex: 0,
            pointerEvents: "none",
          }}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Content Container (elevated with zIndex: 10, exact same padding and layout) */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "285px 85px 105px 85px",
            boxSizing: "border-box",
          }}
        >
          {/* Event Card Inner */}
          <div
            style={{
              background: "transparent",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              color: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            {/* Main Content Grid */}
            <div
              style={{
                display: "flex",
                paddingBottom: "55px",
                gap: "45px",
                position: "relative",
                alignItems: "flex-start",
                boxSizing: "border-box",
              }}
            >
              {/* Left Column Picture Slot */}
              <div style={{ flex: "0 0 40%", position: "relative", boxSizing: "border-box" }}>
                <img
                  src={imageUrl || "https://via.placeholder.com/350x450?text=Upload+Photo"}
                  alt="Attendee Photo"
                  referrerPolicy="no-referrer"
                  style={{
                    width: "100%",
                    height: "440px",
                    objectFit: "cover",
                    borderRadius: "28px",
                    border: "3px solid #FB5700",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    display: "block",
                  }}
                />
              </div>

              {/* Right Column Description Slot */}
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  paddingTop: "20px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#FB5700",
                    color: "white",
                    padding: "8px 18px",
                    borderRadius: "6px",
                    fontSize: "14.4px", // 0.9rem equivalent in 16px base
                    fontWeight: 700,
                    textTransform: "uppercase",
                    alignSelf: "flex-start",
                    marginBottom: "25px",
                    letterSpacing: "0.8px",
                  }}
                >
                  {badgeText}
                </div>
                <h1
                  style={{
                    fontSize: "40px", // 2.5rem
                    fontWeight: 700,
                    lineHeight: 1.25,
                    marginBottom: "20px",
                    color: "#ffffff",
                  }}
                >
                  {title} <span style={{ color: "#FB5700" }}>{titleAccent}</span>
                </h1>
                <p
                  style={{
                    color: "#b3a5a5",
                    fontSize: "19.2px", // 1.2rem
                    lineHeight: 1.5,
                    maxWidth: "95%",
                  }}
                >
                  {description}
                </p>
              </div>

              {/* Overlapping Attending Name tag */}
              <div
                style={{
                  backgroundColor: "#140a0a",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "16px",
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  position: "absolute",
                  bottom: "95px",
                  right: "0px",
                  width: "58%",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.6)",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    color: "#FB5700",
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "24px", // 1.5rem
                    flexShrink: 0,
                  }}
                >
                  ›
                </div>
                <div style={{ overflow: "hidden", boxSizing: "border-box" }}>
                  <div
                    style={{
                      color: "#FB5700",
                      fontWeight: 700,
                      fontSize: "20.8px", // 1.3rem
                      marginBottom: "4px",
                      textTransform: "capitalize",
                    }}
                  >
                    {name || "Your Name"}
                  </div>
                  <div
                    style={{
                      color: "#b3a5a5",
                      fontSize: "15.2px", // 0.95rem
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {position || "Your Position / Designation"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Highlighted Bottom Event Logistics Row */}
          <div
            style={{
              background: "rgba(18, 14, 14, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1.3fr",
              padding: "24px 30px",
              gap: "25px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              boxSizing: "border-box",
            }}
          >
            {/* Date Details */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <svg
                style={{
                  width: "32px",
                  height: "32px",
                  fill: "#FB5700",
                  flexShrink: 0,
                  background: "rgba(251, 87, 0, 0.1)",
                  padding: "6px",
                  borderRadius: "8px",
                }}
                viewBox="0 0 24 24"
              >
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              <div
                style={{
                  fontSize: "15.2px", // 0.95rem
                  lineHeight: 1.4,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    color: "#b3a5a5",
                    fontWeight: 500,
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    fontSize: "12px", // 0.75rem
                    letterSpacing: "0.8px",
                  }}
                >
                  Event Date
                </strong>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{eventDate}</span>
              </div>
            </div>

            {/* Time Details */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <svg
                style={{
                  width: "32px",
                  height: "32px",
                  fill: "#FB5700",
                  flexShrink: 0,
                  background: "rgba(251, 87, 0, 0.1)",
                  padding: "6px",
                  borderRadius: "8px",
                }}
                viewBox="0 0 24 24"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <div
                style={{
                  fontSize: "15.2px", // 0.95rem
                  lineHeight: 1.4,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    color: "#b3a5a5",
                    fontWeight: 500,
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    fontSize: "12px", // 0.75rem
                    letterSpacing: "0.8px",
                  }}
                >
                  Event Time
                </strong>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{eventTime}</span>
              </div>
            </div>

            {/* Location Details */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <svg
                style={{
                  width: "32px",
                  height: "32px",
                  fill: "#FB5700",
                  flexShrink: 0,
                  background: "rgba(251, 87, 0, 0.1)",
                  padding: "6px",
                  borderRadius: "8px",
                }}
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div
                style={{
                  fontSize: "15.2px", // 0.95rem
                  lineHeight: 1.4,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    color: "#b3a5a5",
                    fontWeight: 500,
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    fontSize: "12px", // 0.75rem
                    letterSpacing: "0.8px",
                  }}
                >
                  Venue
                </strong>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PosterCard.displayName = "PosterCard";
