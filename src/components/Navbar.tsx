// ./components/Navbar.tsx
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box, CssBaseline, AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { tbCellColor } from "./Colors/Colors";
import logo from '../assets/PTS Wash Logo.png'
import { MenuText } from "../MenuText";

type MenuItem = {
  primary: string;
  to?: string;
  children?: MenuItem[];
};
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const MenuItemRenderer = ({
  item,
  level = 0,
}: {
  item: MenuItem & { children?: MenuItem[] };
  level?: number;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === item.to;
  const isOpen = openSubmenus[item.primary] || false;

  const handleClick = () => {
    if (item.children) {
      setOpenSubmenus(prev => ({
        ...prev,
        [item.primary]: !isOpen,
      }));
    }
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          component={!item.children && item.to ? RouterLink : "div"}
          to={!item.children ? item.to : undefined}
          sx={{
            bgcolor: isActive ? tbCellColor : "#485e68",
            "&:hover": { bgcolor: tbCellColor, color: "white" },
            color: "white",
            paddingLeft: 4 + level * 4,
          }}
        >
          <ListItemText
            primaryTypographyProps={{ sx: { fontWeight: 600 } }}
            primary={item.primary}
          />
        </ListItemButton>
      </ListItem>

      {item.children && isOpen && (
        <List disablePadding>
          {item.children.map(child => (
            <MenuItemRenderer
              key={child.primary}
              item={child}
              level={level + 1}
            />
          ))}
        </List>
      )}
    </>
  );
};
  const DryProcessItemContent: MenuItem[] = [
    { primary: "Planning", to: "/planning" },
    // { primary: "Create Batch", to: "/createbatch" },
    { primary: "QC Update", to: "/qceditdel" },

    { primary: "Whisker In", to: "/whiskerin" },
    { primary: "Whisker QC", to: "/whiskerqc" },
    { primary: "Whisker QC Pass", to: "/whiskeroutput" },

    { primary: "Laser Whisker In", to: "/laserwhiskerin" },
    {primary:"Laser Whisker QC", to:"/laserwhiskerqc"},
    { primary: "Laser Whisker QC Pass", to: "/laserwhiskeroutput" },
    
    { primary: "Brush In", to: "/brushin" },
    {primary: "Brush QC", to: "/brushqc" },
    { primary: "Brush QC Pass", to: "/brushoutput" },

    { primary: "Laser Brush In", to: "/laserbrushin" },
    {primary:"Laser Brush QC", to:"/laserbrushqc"},
    { primary: "Laser Brush QC Pass", to: "/laserbrushoutput" },

    { primary: "Wrinkle In", to: "/wrinklein" },
    { primary: "Wrinkle QC", to: "/wrinkleqc" },
    { primary: "Wrinkle QC Pass", to: "/wrinkleoutput" },

    { primary: "Tag In", to: "/tagin" },
    { primary: "Tag QC", to: "/tagqc" },
    { primary: "Tag QC Pass", to: "/tagoutput" },
    
    { primary: "Tie Input", to: "/tiein" },
    { primary: "Tie QC", to: "/tieqc" },
    { primary: "Tie QC Pass", to: "/tieoutput" },
    
  ];

  const WetProcessItemContent: (MenuItem & { children?: MenuItem[] }) []= [
    {
      primary:"First Wash",
      children:[
        { primary: "Create Batch", to: "/firstwash/createbatch" },
        // { primary: "Create Batch (With Dry)", to: "/batchwithdry" },
        
        { primary: "Load",
          children: [
            { primary: "Load Start", to: "/firstwash/loadstart" },
            { primary: "Load Finish & Process Start", to: "/firstwash/loadfinish" },
          ],
        },
        { primary: "Unload",
          // to: "",
          children: [
            { primary: "Process Finish & Unload Start", to: "/firstwash/processfinish" },
            { primary: "UnLoad Finish", to: "/firstwash/unloadfinish" },
          ],
        },
        { primary: "Hydro",
          // to: "",
          children: [
            { primary: "Hydro In", to: "/firstwash/hydroin" },
            { primary: "Hydro Out", to: "/firstwash/hydroout" },
          ],
        },
        {
          primary: "Dryer",
          children: [
            { primary: "Dryer Conveyor In", to: "/firstwash/dryerconveyorin" },
            { primary: "Dryer Conveyor Out", to: "/firstwash/dryerconveyorout" },
            { primary: "Dryer Oven In", to: "/firstwash/dryerovenin" },
            { primary: "Dryer Oven Out", to: "/firstwash/dryerovenout" },
            { primary: "Dryer Tumble In", to: "/firstwash/dryertumblein" },
            { primary: "Dryer Tumble Out", to: "/firstwash/dryertumbleout" },
          
          ],
        },
        {primary: "QC",to:"/firstwashqc"},
      ]
    },

    {
      primary:"Rewash",
      children:[
        { primary: "Create Batch", to: "/firstwash/rewashcreatebatch" },
        
        // { primary: "Load",
        //   children: [
        //     { primary: "Load Start", to: "/loadstart" },
        //     { primary: "Load Finish & Process Start", to: "/loadfinish" },
        //   ],
        // },
        // { primary: "Unload",
        //   // to: "",
        //   children: [
        //     { primary: "Process Finish & Unload Start", to: "/processfinish" },
        //     { primary: "UnLoad Finish", to: "/unloadfinish" },
        //   ],
        // },
        // { primary: "Hydro",
        //   // to: "",
        //   children: [
        //     { primary: "Hydro In", to: "/hydroin" },
        //     { primary: "Hydro Out", to: "/hydroout" },
        //   ],
        // },
        // {
        //   primary: "Dryer",
        //   children: [
        //     { primary: "Dryer Conveyor In", to: "/dryerconveyorin" },
        //     { primary: "Dryer Conveyor Out", to: "/dryerconveyorout" },
        //     { primary: "Dryer Oven In", to: "/dryerovenin" },
        //     { primary: "Dryer Oven Out", to: "/dryerovenout" },
        //     { primary: "Dryer Tumble In", to: "/dryertumblein" },
        //     { primary: "Dryer Tumble Out", to: "/dryertumbleout" },
          
        //   ],
        // },
        // {primary: "First Wash QC",to:"/firstwashqc"},
      ]
    },
    
    // { primary: "Create Batch (Without Dry)", to: "/batchdry" },
    // { primary: "Create Batch (With Dry)", to: "/batchwithdry" },
    
    // { primary: "Load",
    //   to: "",
    //   children: [
    //     { primary: "Load Start", to: "/loadstart" },
    //     { primary: "Load Finish & Process Start", to: "/loadfinish" },
    //   ],
    // },
    // { primary: "Unload",
    //   to: "#",
    //   children: [
    //     { primary: "Process Finish & Unload Start", to: "/processfinish" },
    //     { primary: "UnLoad Finish", to: "/unloadfinish" },
    //   ],
    // },
    // { primary: "Hydro",
    //   to: "",
    //   children: [
    //     { primary: "Hydro In", to: "/hydroin" },
    //     { primary: "Hydro Out", to: "/hydroout" },
    //   ],
    // },
    // {
    //   primary: "Dryer",
    //   children: [
    //     { primary: "Dryer Conveyor In", to: "/dryerconveyorin" },
    //     { primary: "Dryer Conveyor Out", to: "/dryerconveyorout" },
    //     { primary: "Dryer Oven In", to: "/dryerovenin" },
    //     { primary: "Dryer Oven Out", to: "/dryerovenout" },
    //     { primary: "Dryer Tumble In", to: "/dryertumblein" },
    //     { primary: "Dryer Tumble Out", to: "/dryertumbleout" },
       
    //   ],
    // },
    
  ];
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [dryProcess, setDryProcess] = useState(false);
  const [ItemContent, setItemContent] = useState<MenuItem[]>([]);

  // Initialize sidebar items based on current route
  useEffect(() => {
    if (
      location.pathname.startsWith("/planning") ||
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
    } 
    else if (
      location.pathname.startsWith("/firstwash/createbatch") ||
      // location.pathname.startsWith("/batchwithdry") ||
      location.pathname.startsWith("/firstwash/hydroin") ||
      location.pathname.startsWith("/firstwash/hydroout")||
      location.pathname.startsWith("/firstwash/loadstart")||
      location.pathname.startsWith("/firstwash/loadfinish")||
      location.pathname.startsWith("/firstwash/processfinish")||
      location.pathname.startsWith("/firstwash/unloadfinish")||
      location.pathname.startsWith("/firstwash/dryerconveyorin")||
      location.pathname.startsWith("/firstwash/dryerconveyorout")||
      location.pathname.startsWith("/firstwash/dryerovenin")||
      location.pathname.startsWith("/firstwash/dryerovenout")||
      location.pathname.startsWith("/firstwash/dryertumblein")||
      location.pathname.startsWith("/firstwash/dryertumbleout")||
      location.pathname.startsWith("/firstwashqc")||
      location.pathname.startsWith("/firstwash/rewashcreatebatch")
    ) {
      setDryProcess(false);
      setItemContent(WetProcessItemContent);
    }
    else {
      setItemContent([
        { primary: "Master Routing", to: "/masterroute" },
        { primary: "Wash Receive", to: "/washreceive" }
      ]); // <-- nothing by default
    }
  }, [location.pathname]);

  // Navigate back or fallback to default
  // const goBackOrFallback = (fallback: string) => {
  //   if (window.history.state && window.history.state.idx > 0) {
  //     navigate(-1);
  //   } else {
  //     navigate(fallback);
  //   }
  // };

  // Handle Dry/Wet Process button clicks
  // const handleProcessClick = (isDry: boolean) => {
  //   setDryProcess(isDry);
  //   setItemContent(isDry ? DryProcessItemContent : WetProcessItemContent);
  //   const fallback = isDry ? "/planning" : "/";
  //   goBackOrFallback(fallback);
  // };
  const handleProcessClick = (isDry: boolean) => {
    setDryProcess(isDry);
    setItemContent(isDry ? DryProcessItemContent : WetProcessItemContent);

    // navigate(isDry ? "/planning" : "/batchdry");
    if(isDry){
      window.open("/planning", "_blank")
    }
    else{
      window.open("/firstwash/createbatch", "_blank")
    }
  };
  return (
    <Box sx={{ 
      // display:'flex',
      // alignItems:'center',
      // justifyContent:'space-between'
      // fontFamily:"'Inter', system-ui, sans-serif"

    }}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "white",height:"65px", boxShadow: "0px 1px 3px rgba(0,0,0,0.12)" }}
      >
        <Toolbar sx={{display:"flex",justifyContent:"space-between",paddingY:"5px"}}>
          {/* <Box sx={{
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          height:'80px'
        }}> */}
            <Box component='img' src={logo} sx={{
              // width:'100%',
              height:'100%',
              objectFit:'contain',
            }}>
            </Box>
            <Box sx={{  fontWeight:600 }}>
              <p style={{ fontSize:30 ,textDecoration: "none", color: "#485e68"  }}>
                {MenuText({ text: location.pathname })}
              </p>
            </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center",fontWeight:600 }}>
            <p
              // onClick={() => navigate("/washreceive")}
              onClick={()=>window.open("/masterroute", "_blank")}
              style={{ textDecoration: "none", color: "#485e68", cursor: "pointer",  }}
            >
              Master Routing
            </p>
            <p
              // onClick={() => navigate("/washreceive")}
              onClick={()=>window.open("/washreceive", "_blank")}
              style={{ textDecoration: "none", color: "#485e68", cursor: "pointer",  }}
            >
              Wash Receive
            </p>
            <p
              onClick={() => handleProcessClick(true)}
              style={{ textDecoration: "none", color: "#485e68", cursor: "pointer",  }}
            >
              Dry Process
            </p>

            <p
              onClick={() => handleProcessClick(false)}
              style={{ textDecoration: "none", color: "#485e68", cursor: "pointer" }}
            >
              Wet Process
            </p>
          </Box>
          {/* </Box> */}
        </Toolbar>
      </AppBar>

      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          // fontFamily:"'Inter', system-ui, sans-serif !important",

          width: 100,
          bgcolor:'#485e68',
          color:'white',
          paddingLeft:'10px',
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 200,
            
            boxSizing: "border-box",
          },
          
        }}
      >
        <Toolbar /> {/* empty toolbar to push content below AppBar */}
        <Box sx={{ overflow: "auto"}}>
            <List>
              {ItemContent.map(item => (
                <MenuItemRenderer key={item.primary} item={item} />
              ))}
            </List>
          {/* <List>
              {ItemContent.map((item) => {
                const isActive = location.pathname === item.to;

                // Parent item with children
                if (item.children) {
                  const isOpen = openSubmenus[item.primary] || false;

                  return (
                    <React.Fragment key={item.primary}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => setOpenSubmenus({ ...openSubmenus, [item.primary]: !isOpen })}
                          sx={{
                            bgcolor: isActive ? tbCellColor : "#485e68",
                            "&:hover": { bgcolor: tbCellColor, color: "white" },
                            color: "white",
                            paddingLeft: 4,
                          }}
                        >
                          <ListItemText primaryTypographyProps={{ sx: { fontWeight: 600 } }} primary={item.primary} />
                        </ListItemButton>
                      </ListItem>

                      {isOpen &&
                        item.children.map((child) => {
                          const isChildActive = location.pathname === child.to;
                          return (
                            <ListItem key={child.to} disablePadding>
                              <ListItemButton
                                component={RouterLink}
                                to={child.to}
                                sx={{
                                  bgcolor: isChildActive ? tbCellColor : "#5a6d76",
                                  "&:hover": { bgcolor: tbCellColor, color: "white" },
                                  color: "white",
                                  paddingLeft: 8,
                                }}
                              >
                                <ListItemText primaryTypographyProps={{ sx: { fontWeight: 500 } }} primary={child.primary} />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                    </React.Fragment>
                  );
                }

                // Regular item
                return (
                  <ListItem key={item.to} disablePadding>
                    <ListItemButton
                      component={RouterLink}
                      to={item.to}
                      sx={{
                        bgcolor: isActive ? tbCellColor : "#485e68",
                        "&:hover": { bgcolor: tbCellColor, color: "white" },
                        color: "white",
                        paddingLeft: 4,
                      }}
                    >
                      <ListItemText primaryTypographyProps={{ sx: { fontWeight: 600 } }} primary={item.primary} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List> */}
        </Box>
      </Drawer>
    </Box>
  );
}
