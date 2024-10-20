import {
  AppBar,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { routesRegistry } from "./routes/RoutesRegistry";
import { useState } from "react";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = window.innerWidth <= 500;

  return (
    <div className="flex">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setIsDrawerOpen(true)}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <Icon>menu</Icon>
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            WebRTC
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: isMobile ? 200 : 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isMobile ? 200 : 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {routesRegistry[0].children.map((route, index) => (
            <Link to={route.path} key={route.path}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setIsDrawerOpen(false)}>
                  <ListItemText primary={route.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <div className="flex-grow p-3">
        <Toolbar />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
