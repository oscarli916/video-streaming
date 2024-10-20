import { Typography } from "@mui/material";

const HomePage = () => {
  const isMobile = window.innerWidth <= 500;

  return (
    <div className="h-[600px] flex justify-center items-center">
      <Typography variant={isMobile ? "h4" : "h3"} noWrap className="text-wrap">
        Welcome to WebRTC
      </Typography>
    </div>
  );
};

export default HomePage;
