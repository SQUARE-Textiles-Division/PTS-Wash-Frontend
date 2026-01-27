// ./components/Navbar.tsx
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box, CssBaseline, AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

type MenuItem = {
  primary: string;
  to: string;
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const DryProcessItemContent: MenuItem[] = [
    { primary: "Planning", to: "/planning" },
    { primary: "Wash Receive", to: "/washreceive" },
    { primary: "Create Batch", to: "/createbatch" },
    { primary: "QC Update", to: "/qceditdel" },

    { primary: "Whisker In", to: "/whiskerin" },
    { primary: "Whisker QC", to: "/whiskerqc" },
    { primary: "Whisker Output", to: "/whiskeroutput" },

    { primary: "Laser Whisker In", to: "/laserwhiskerin" },
    {primary:"Laser Whisker QC", to:"/laserwhiskerqc"},
    { primary: "Laser Whisker Output", to: "/laserwhiskeroutput" },
    
    { primary: "Brush In", to: "/brushin" },
    {primary: "Brush QC", to: "/brushqc" },
    { primary: "Brush Output", to: "/brushoutput" },

    { primary: "Laser Brush In", to: "/laserbrushin" },
    {primary:"Laser Brush QC", to:"/laserbrushqc"},
    { primary: "Laser Brush Output", to: "/laserbrushoutput" },

    { primary: "Wrinkle In", to: "/wrinklein" },
    { primary: "Wrinkle QC", to: "/wrinkleqc" },
    { primary: "Wrinkle Output", to: "/wrinkleoutput" },

    { primary: "Tag In", to: "/tagin" },
    { primary: "Tag QC", to: "/tagqc" },
    { primary: "Tag Output", to: "/tagoutput" },
    
    { primary: "Tie Input", to: "/tiein" },
    { primary: "Tie QC", to: "/tieqc" },
    { primary: "Tie Output", to: "/tieoutput" },
    
  ];

  const WetProcessItemContent: MenuItem[] = [
    { primary: "Default", to: "/" },
  ];

  const [dryProcess, setDryProcess] = useState(false);
  const [ItemContent, setItemContent] = useState<MenuItem[]>([]);

  // Initialize sidebar items based on current route
  useEffect(() => {
    if (
      location.pathname.startsWith("/planning") ||
      location.pathname.startsWith("/washreceive") ||
      location.pathname.startsWith("/createbatch") ||
      location.pathname.startsWith("/qceditdel") ||

      location.pathname.startsWith("/whiskerin") ||
       location.pathname.startsWith("/whiskerqc") ||
       location.pathname.startsWith("/whiskeroutput") ||

      location.pathname.startsWith("/laserwhiskerin") ||
      location.pathname.startsWith("/laserwhiskerqc") ||
      location.pathname.startsWith("/laserwhiskeroutput") ||
   
      
      location.pathname.startsWith("/brushin") ||
      location.pathname.startsWith("/brushqc") ||
      location.pathname.startsWith("/brushoutput") ||

      location.pathname.startsWith("/laserbrushin") ||
      location.pathname.startsWith("/laserbrushqc") ||
      location.pathname.startsWith("/laserbrushoutput") ||
      
      
      location.pathname.startsWith("/wrinklein") ||
      location.pathname.startsWith("/wrinkleqc") ||
      location.pathname.startsWith("/wrinkleoutput")||

      location.pathname.startsWith("/tagin") ||
      location.pathname.startsWith("/tagqc") ||
      location.pathname.startsWith("/tagoutput") ||

      location.pathname.startsWith("/tiein") ||
      location.pathname.startsWith("/tieqc") ||
      location.pathname.startsWith("/tieoutput")
    ) {
      setDryProcess(true);
      setItemContent(DryProcessItemContent);
    } else {
      setDryProcess(false);
      setItemContent(WetProcessItemContent);
    }
  }, [location.pathname]);

  // Navigate back or fallback to default
  const goBackOrFallback = (fallback: string) => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  // Handle Dry/Wet Process button clicks
  const handleProcessClick = (isDry: boolean) => {
    setDryProcess(isDry);
    setItemContent(isDry ? DryProcessItemContent : WetProcessItemContent);
    const fallback = isDry ? "/planning" : "/";
    goBackOrFallback(fallback);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "#485e68" }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            sx={{ flexGrow: 1, alignContent: "center", alignItems: "center" }}
          >
            PTS Wash Module
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <p
              onClick={() => handleProcessClick(true)}
              style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
            >
              Dry Process
            </p>

            <p
              onClick={() => handleProcessClick(false)}
              style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
            >
              Wet Process
            </p>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 200,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 200,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar /> {/* empty toolbar to push content below AppBar */}
        <Box sx={{ overflow: "auto" }}>
          <List>
            {ItemContent.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={item.to}
                    sx={{
                      bgcolor: isActive ? "action.selected" : "inherit",
                      "&:hover": {
                        bgcolor: "action.selected",
                      },
                    }}
                  >
                    <ListItemText primary={item.primary} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
