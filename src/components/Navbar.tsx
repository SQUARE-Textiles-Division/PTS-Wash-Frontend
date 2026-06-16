// ./components/Navbar.tsx
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box, CssBaseline, AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { tbCellColor } from "./Colors/Colors";
import logo from '../assets/PTS Wash Logo.png'
import { MenuText } from "../MenuText";
import ROLES, { ROLES_ADD } from "../Roles";
import useAuth from "../hooks/useAuth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { dryProcessRoles } from "../DryProcessRoles";
import { wetProcessRoles } from "../WetProcessRoles";
import { firstWashRoles } from "../1stWashRoles";
import { secondWashRoles } from "../2ndWashRoles";
import { thirdWashRoles } from "../3rrdWashRoles";
import { finalWashRoles } from "../FinalWashRoles";
import RoleBasedHome from "./RoleBasedHome";




type MenuItem = {
  primary: string;
  to?: string;
  children?: MenuItem[];
};

export default function Navbar() {
  const {auth}=useAuth()


  

const hasDryProcessRole = dryProcessRoles.some(role =>
  auth?.roles?.includes(role)
);
const hasWetProcessRole = wetProcessRoles.some(role =>
  auth?.roles?.includes(role)
);
const matchedRole = Object.keys(ROLES_ADD).find(role =>
  auth?.roles?.includes(ROLES[role as keyof typeof ROLES])
);
const hasFirstWashRole=firstWashRoles.some(role=>
  auth?.roles?.includes(role)
)
const hasSecondWashRole=secondWashRoles.some(role=>
  auth?.roles?.includes(role)
)
const hasThirdWashRole=thirdWashRoles.some(role=>
  auth?.roles?.includes(role)
)
const hasFinalWashRole=finalWashRoles.some(role=>
  auth?.roles?.includes(role)
)
  // const {isLoading } = useAuth();

  // if (isLoading) return <p>Loading...</p>;
  // if (isLoading) return null; // or loader
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
    // if()
    ...(auth?.roles?.includes(ROLES.Production)
      ?[{ primary: "Planning", to: "/planning" }]
      : []),

    // { primary: "Create Batch", to: "/createbatch" },
    // { primary: "QC Update", to: "/qceditdel" },

    ...(auth?.roles?.includes(ROLES.WhiskerIn)
      ? [{ primary: "Whisker In", to: "/whiskerin" }]
      : []),
    
    ...(auth?.roles?.includes(ROLES.WhiskerQC)
      ?[{ primary: "Whisker QC", to: "/whiskerqc" }]
      :[]),

    ...(auth?.roles?.includes(ROLES.WhiskerOut)
      ?[ {primary: "Whisker QC Pass", to: "/whiskeroutput" }]
      :[]
      ),
    ...(auth?.roles?.includes(ROLES.LaserWhiskerIn)
      ?[{ primary: "Laser Whisker In", to: "/laserwhiskerin" }]
      :[]
      ),

     ...(auth?.roles?.includes(ROLES.LaserWhiskerQC)
      ?[{primary:"Laser Whisker QC", to:"/laserwhiskerqc"}]
      :[]
      ),
     ...(auth?.roles?.includes(ROLES.LaserWhiskerOut)
      ?[{ primary: "Laser Whisker QC Pass", to: "/laserwhiskeroutput" }]
      :[]
      ),
     ...(auth?.roles?.includes(ROLES.BrushIn)
      ?[{ primary: "Brush In", to: "/brushin" }]
      :[]
      ),
     ...(auth?.roles?.includes(ROLES.BrushQC)
      ?[{primary: "Brush QC", to: "/brushqc" }]
      :[]
      ),
     ...(auth?.roles?.includes(ROLES.BrushOut)
      ?[{ primary: "Brush QC Pass", to: "/brushoutput" }]
      :[]
      ),
    ...(auth?.roles?.includes(ROLES.LaserBrushIn)
      ?[{ primary: "Laser Brush In", to: "/laserbrushin" }]
      :[]
      ),
    ...(auth?.roles?.includes(ROLES.LaserBrushQC)
      ?[{primary:"Laser Brush QC", to:"/laserbrushqc"}]
      :[]
      ),
      ...(auth?.roles?.includes(ROLES.LaserBrushOut)
      ?[{ primary: "Laser Brush QC Pass", to: "/laserbrushoutput" }]
      :[]
      ),
    
      ...(auth?.roles?.includes(ROLES.WrinkleIn)
      ?[{ primary: "Wrinkle In", to: "/wrinklein" }]
      :[]
      ),
    
      ...(auth?.roles?.includes(ROLES.WrinkleQC)
      ?[{ primary: "Wrinkle QC", to: "/wrinkleqc" }]
      :[]
      ),
      ...(auth?.roles?.includes(ROLES.WrinkleOut)
      ?[{ primary: "Wrinkle QC Pass", to: "/wrinkleoutput" }]
      :[]
      ),
    
    ...(auth?.roles?.includes(ROLES.TagIn)
      ?[{ primary: "Tag In", to: "/tagin" }]
      :[]
      ),
    ...(auth?.roles?.includes(ROLES.TagQC)
      ?[{ primary: "Tag QC", to: "/tagqc" }]
      :[]
      ),
    
    ...(auth?.roles?.includes(ROLES.TagOut)
      ?[{ primary: "Tag QC Pass", to: "/tagoutput" }]
      :[]
      ),
    ...(auth?.roles?.includes(ROLES.TieIn)
      ?[{ primary: "Tie In", to: "/tiein" }]
      :[]
      ),
    
    ...(auth?.roles?.includes(ROLES.TieQC)
      ?[{ primary: "Tie QC", to: "/tieqc" }]
      :[]
      ),
    ...(auth?.roles?.includes(ROLES.TieOut)
      ?[{ primary: "Tie QC Pass", to: "/tieoutput" }]
      :[]
      ),
    
    
  ];

  const WetProcessItemContent: (MenuItem & { children?: MenuItem[] }) []= [
    ...(hasFirstWashRole
          ?[ {primary:"1st Wash",
                  children:[
                    ...(auth?.roles?.includes(ROLES.FirstWashBatch)
                    ?[ { primary: "Create Batch", to: "/firstwash/createbatch" }]
                    :[]
                  ),
                  
                    // { primary: "Create Batch (With Dry)", to: "/batchwithdry" },
                    ...(auth?.roles?.includes(ROLES.FirstLoadStart) || auth?.roles?.includes(ROLES.FirstLoadFinish)
                  
                    ?[
                      { primary: "Load",
                        children: [
                          ...(auth?.roles?.includes(ROLES.FirstLoadStart)
                          ?[{ primary: "Load Start", to: "/firstwash/loadstart" }]
                          :[]
                        ),
                        ...(auth?.roles?.includes(ROLES.FirstLoadFinish)
                        ?[{ primary: "Load Finish & Process Start", to: "/firstwash/loadfinish" }]
                        :[]
                        ),
                        ],
                    }
                    ]
                    :[]
                  ),
                  ...(auth?.roles?.includes(ROLES.FirstProcessFinish)||auth?.roles?.includes(ROLES.FirstUnloadFinish)
                  ?[
                    { primary: "Unload",
                      // to: "",
                      children: [
                        ...(auth?.roles?.includes(ROLES.FirstProcessFinish)
                        ?[{ primary: "Process Finish & Unload Start", to: "/firstwash/processfinish" }]
                        :[]
                        ),
                        ...(auth?.roles?.includes(ROLES.FirstUnloadFinish)
                        ?[ { primary: "UnLoad Finish", to: "/firstwash/unloadfinish" }]
                        :[]
                        ),
                      
                      ],
                    }
                  ]
                  :[]
                  ),
                    
                    ...(auth?.roles?.includes(ROLES.FirstHydroIn) || auth?.roles?.includes(ROLES.FirstHydroOut)
                  ?[
                      { primary: "Hydro",
                      // to: "",
                      children: [
                        ...(auth?.roles?.includes(ROLES.FirstHydroIn)
                          ?[{ primary: "Hydro In", to: "/firstwash/hydroin" }]
                          :[]
                        ),
                        ...(auth?.roles?.includes(ROLES.FirstHydroOut)
                        ?[{ primary: "Hydro Out", to: "/firstwash/hydroout" }]
                        :[]
                        )
                      ],
                    }
                  ]
                  :[]
                  ),
                  ...(auth?.roles?.includes(ROLES.FirstConveyerIn) || auth?.roles?.includes(ROLES.FirstConveyerOut) || auth?.roles?.includes(ROLES.FirstOvenIn) 
                  || auth?.roles?.includes(ROLES.FirstOvenOut) || auth?.roles?.includes(ROLES.FirstTumbleIn) || auth?.roles?.includes(ROLES.FirstTumbleOut)
                  ?[

                    {
                      primary: "Dryer",
                      children: [
                        ...(auth?.roles?.includes(ROLES.FirstConveyerIn)
                        ?[
                          { primary: "Dryer Conveyor In", to: "/firstwash/dryerconveyorin" }
                        ]
                        :[]
                      ) ,
                      ...(auth?.roles?.includes(ROLES.FirstConveyerOut) 
                        ?[{ primary: "Dryer Conveyor Out", to: "/firstwash/dryerconveyorout" }]
                        :[]
                        ),
                        ...(auth?.roles?.includes(ROLES.FirstOvenIn) 
                        ?[{ primary: "Dryer Oven In", to: "/firstwash/dryerovenin" }]
                        :[]
                      ),
                        ...(auth?.roles?.includes(ROLES.FirstOvenOut) 
                        ?[
                          { primary: "Dryer Oven Out", to: "/firstwash/dryerovenout" }
                        ]
                        :[]
                      ),
                        ...(auth?.roles?.includes(ROLES.FirstTumbleIn) 
                        ?[
                          { primary: "Dryer Tumble In", to: "/firstwash/dryertumblein" }
                        ]
                        :[]
                      ),
                      ...(auth?.roles?.includes(ROLES.FirstTumbleOut) 
                        ?[
                          { primary: "Dryer Tumble Out", to: "/firstwash/dryertumbleout" },
                        ]
                        :[]
                      ),
                        
                      
                      ],
                    }
                  ]
                  :[]
                ),
                  ...(auth?.roles?.includes(ROLES.FirstWashQC)
                  ?[{primary: "QC",to:"/firstwashqc"}]
                  :[]
                ),  
                ...(auth?.roles?.includes(ROLES.FirstWashRewashBatch)
                  ?[{
                      primary:"Rewash",
                      children:[
                        { primary: "Create Batch", to: "/firstwash/rewashcreatebatch" },
                      ]
                    }]
                  :[]
                )
                    

                  ]}]
              :[]
      ),
   
   ...(hasSecondWashRole
              ?[{
                primary:'2nd Wash',
                children:[
                  ...(auth?.roles?.includes(ROLES.SecondWashBatch)
                    ?[{ primary: "Create Batch", to: "/secondwash/createbatch" }]
                    :[]
                ),
                ...(auth?.roles?.includes(ROLES.SecondLoadStart) || auth?.roles?.includes(ROLES.SecondLoadFinish)
                ?[
                    { primary: "Load",
                    children: [
                      ...(auth?.roles?.includes(ROLES.SecondLoadStart) 
                      ?[{ primary: "Load Start", to: "/secondwash/loadstart" }]
                      :[]
                    ),
                    ...(auth?.roles?.includes(ROLES.SecondLoadFinish)
                      ?[{ primary: "Load Finish & Process Start", to: "/secondwash/loadfinish" }]
                      :[]
                  )
                    ],
                  },
                ]
                :[]
              ),

              ...(auth?.roles?.includes(ROLES.SecondProcessFinish) || auth?.roles?.includes(ROLES.SecondUnloadFinish)
              ?[
                { primary: "Unload",
                    // to: "",
                    children: [
                      ...(auth?.roles?.includes(ROLES.SecondProcessFinish)
                            ?[{ primary: "Process Finish & Unload Start", to: "/secondwash/processfinish" }]
                            :[]
                      ),
                      ...(auth?.roles?.includes(ROLES.SecondUnloadFinish)
                          ?[{ primary: "UnLoad Finish", to: "/secondwash/unloadfinish" }]
                          :[]
                    )
                      
                    ],
                  }
              ]
              :[]
            ),
                  
            ...(auth?.roles?.includes(ROLES.SecondHydroIn) || auth?.roles?.includes(ROLES.SecondHydroOut)
            ?[{ primary: "Hydro",
                    // to: "",
                    children: [
                      ...(auth?.roles?.includes(ROLES.SecondHydroIn)
                          ?[{ primary: "Hydro In", to: "/secondwash/hydroin" }]
                          :[]
                      ),
                      ...(auth?.roles?.includes(ROLES.SecondHydroOut)
                          ?[{ primary: "Hydro Out", to: "/secondwash/hydroout" }]
                          :[]
                      )
                    ],
                  },]
            :[]
          ),
          ...(auth?.roles?.includes(ROLES.SecondConveyerIn) || auth?.roles?.includes(ROLES.SecondConveyerOut) || auth?.roles?.includes(ROLES.SecondOvenIn)
            || auth?.roles?.includes(ROLES.SecondOvenOut) || auth?.roles?.includes(ROLES.SecondTumbleIn) || auth?.roles?.includes(ROLES.SecondTumbleOut)
            ?[
                {
                  primary: "Dryer",
                  children: [
                    ...(auth?.roles?.includes(ROLES.SecondConveyerIn)
                        ?[{ primary: "Dryer Conveyor In", to: "/secondwash/dryerconveyorin" }]
                        :[]
                    ),
                    ...(auth?.roles?.includes(ROLES.SecondConveyerOut)
                        ?[{ primary: "Dryer Conveyor Out", to: "/secondwash/dryerconveyorout" }]
                        :[]
                    ),
                      ...(auth?.roles?.includes(ROLES.SecondOvenIn)
                        ?[{ primary: "Dryer Oven In", to: "/secondwash/dryerovenin" }]
                        :[]
                    ),
                      ...(auth?.roles?.includes(ROLES.SecondOvenOut)
                        ?[{ primary: "Dryer Oven Out", to: "/secondwash/dryerovenout" }]
                        :[]
                    ),
                     ...(auth?.roles?.includes(ROLES.SecondTumbleIn)
                        ?[{ primary: "Dryer Tumble In", to: "/secondwash/dryertumblein" }]
                        :[]
                    ),
                    ...(auth?.roles?.includes(ROLES.SecondTumbleOut)
                        ?[{ primary: "Dryer Tumble Out", to: "/secondwash/dryertumbleout" },]
                        :[]
                    ),
                    
                  ],
                },
            ]
            :[]
          ),
          
          ...(auth?.roles?.includes(ROLES.SecondWashQC)
            ?[{primary: "QC",to:"/secondwashqc"}]
            :[]
          ),
          ...(auth?.roles?.includes(ROLES.SecondWashRewashBatch)
              ?[{
                  primary:"Rewash",
                  children:[
                    { primary: "Create Batch", to: "/secondwash/rewashcreatebatch" },
                  ]
              }]
              :[]
          ),
          
        ]
      }]
      :[]
   ) ,
   ...(hasThirdWashRole?[
    {
      primary:'3rd Wash',
      children:[
        ...(auth?.roles?.includes(ROLES.ThirdWashBatch)
            ?[{ primary: "Create Batch", to: "/thirdwash/createbatch" }]
            :[]
        ),
        ...(auth?.roles?.includes(ROLES.ThirdLoadStart) || auth?.roles?.includes(ROLES.ThirdLoadFinish)
            ?[
               { primary: "Load",
                children: [
                  ...(auth?.roles?.includes(ROLES.ThirdLoadStart)
                      ?[{ primary: "Load Start", to: "/thirdwash/loadstart" }]
                      :[]
                  ),
                  ...(auth?.roles?.includes(ROLES.ThirdLoadFinish)
                      ?[{ primary: "Load Finish & Process Start", to: "/thirdwash/loadfinish" }]
                      :[]
                  )
                ],
              }
            ]
            :[]
        ),
        ...(auth?.roles?.includes(ROLES.ThirdProcessFinish) || auth?.roles?.includes(ROLES.ThirdUnloadFinish)
            ?[{ primary: "Unload",
              // to: "",
              children: [
                ...(auth?.roles?.includes(ROLES.ThirdProcessFinish)
                    ?[{ primary: "Process Finish & Unload Start", to: "/thirdwash/processfinish" }]
                    :[]
                ),
                ...(auth?.roles?.includes(ROLES.ThirdUnloadFinish)
                    ?[{ primary: "UnLoad Finish", to: "/thirdwash/unloadfinish" }]
                    :[]
                )
              ],
            }]
            :[]
        ),
        ...(auth?.roles?.includes(ROLES.ThirdHydroIn) || auth?.roles?.includes(ROLES.ThirdHydroOut)
            ?[{ primary: "Hydro",
                // to: "",
                children: [
                  ...(auth?.roles?.includes(ROLES.ThirdHydroIn)
                      ?[{ primary: "Hydro In", to: "/thirdwash/hydroin" }]
                      :[]
                  ),
                  ...(auth?.roles?.includes(ROLES.ThirdHydroOut)
                      ?[{ primary: "Hydro Out", to: "/thirdwash/hydroout" }]
                      :[]
                  ),
                ],
              }]
            :[]
        ),
        
       
        
        
         {
          primary: "Dryer",
          children: [
            { primary: "Dryer Conveyor In", to: "/thirdwash/dryerconveyorin" },
            { primary: "Dryer Conveyor Out", to: "/thirdwash/dryerconveyorout" },
            { primary: "Dryer Oven In", to: "/thirdwash/dryerovenin" },
            { primary: "Dryer Oven Out", to: "/thirdwash/dryerovenout" },
            { primary: "Dryer Tumble In", to: "/thirdwash/dryertumblein" },
            { primary: "Dryer Tumble Out", to: "/thirdwash/dryertumbleout" },
          
          ],
        },
        {primary: "QC",to:"/thirdwashqc"},
        {
          primary:"Rewash",
          children:[
            { primary: "Create Batch", to: "/thirdwash/rewashcreatebatch" },
          ]
        }
      ]
    },
   ]:[]),
     
   ...(hasFinalWashRole
    ?[
      {
      primary:'Final Wash',
      children:[
        { primary: "Create Batch", to: "/finalwash/createbatch" },
        { primary: "Load",
          children: [
            { primary: "Load Start", to: "/finalwash/loadstart" },
            { primary: "Load Finish & Process Start", to: "/finalwash/loadfinish" },
          ],
        },
        { primary: "Unload",
          // to: "",
          children: [
            { primary: "Process Finish & Unload Start", to: "/finalwash/processfinish" },
            { primary: "UnLoad Finish", to: "/finalwash/unloadfinish" },
          ],
        },
        { primary: "Hydro",
          // to: "",
          children: [
            { primary: "Hydro In", to: "/finalwash/hydroin" },
            { primary: "Hydro Out", to: "/finalwash/hydroout" },
          ],
        },
         {
          primary: "Dryer",
          children: [
            { primary: "Dryer Conveyor In", to: "/finalwash/dryerconveyorin" },
            { primary: "Dryer Conveyor Out", to: "/finalwash/dryerconveyorout" },
            { primary: "Dryer Oven In", to: "/finalwash/dryerovenin" },
            { primary: "Dryer Oven Out", to: "/finalwash/dryerovenout" },
            { primary: "Dryer Tumble In", to: "/finalwash/dryertumblein" },
            { primary: "Dryer Tumble Out", to: "/finalwash/dryertumbleout" },
          
          ],
        },
        {primary: "QC",to:"/finalwashqc"},
        {
          primary:"Rewash",
          children:[
            { primary: "Create Batch", to: "/finalwash/rewashcreatebatch" },
          ]
        }
      ]
    }
    ]
    :[]
   ),
    
    
  ];
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [dryProcess, setDryProcess] = useState(false);
  const [ItemContent, setItemContent] = useState<MenuItem[]>([]);

  // Initialize sidebar items based on current route
  useEffect(() => {
    if (
      location.pathname.startsWith("/planning") ||
      location.pathname.startsWith("/createbatch") ||
      // location.pathname.startsWith("/qceditdel") ||

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
      location.pathname.startsWith("/firstwash/rewashcreatebatch")||

      location.pathname.startsWith("/secondwash/createbatch")||
      location.pathname.startsWith("/secondwash/hydroin")||
      location.pathname.startsWith("/secondwash/hydroout")||
      location.pathname.startsWith("/secondwash/loadstart")||
      location.pathname.startsWith("/secondwash/loadfinish")||
      location.pathname.startsWith("/secondwash/processfinish")||
      location.pathname.startsWith("/secondwash/unloadfinish")||
      location.pathname.startsWith("/secondwash/dryerconveyorin")||
      location.pathname.startsWith("/secondwash/dryerconveyorout")||
      location.pathname.startsWith("/secondwash/dryerovenin")||
      location.pathname.startsWith("/secondwash/dryerovenout")||
      location.pathname.startsWith("/secondwash/dryertumblein")||
      location.pathname.startsWith("/secondwash/dryertumbleout")||
      location.pathname.startsWith("/secondwashqc")||
      location.pathname.startsWith("/secondwash/rewashcreatebatch")||

      location.pathname.startsWith("/thirdwash/createbatch")||
      location.pathname.startsWith("/thirdwash/hydroin")||
      location.pathname.startsWith("/thirdwash/hydroout")||
      location.pathname.startsWith("/thirdwash/loadstart")||
      location.pathname.startsWith("/thirdwash/loadfinish")||
      location.pathname.startsWith("/thirdwash/processfinish")||
      location.pathname.startsWith("/thirdwash/unloadfinish")||
      location.pathname.startsWith("/thirdwash/dryerconveyorin")||
      location.pathname.startsWith("/thirdwash/dryerconveyorout")||
      location.pathname.startsWith("/thirdwash/dryerovenin")||
      location.pathname.startsWith("/thirdwash/dryerovenout")||
      location.pathname.startsWith("/thirdwash/dryertumblein")||
      location.pathname.startsWith("/thirdwash/dryertumbleout")||
      location.pathname.startsWith("/thirdwashqc")||
      location.pathname.startsWith("/thirdwash/rewashcreatebatch")||

      location.pathname.startsWith("/finalwash/createbatch")||
      location.pathname.startsWith("/finalwash/hydroin")||
      location.pathname.startsWith("/finalwash/hydroout")||
      location.pathname.startsWith("/finalwash/loadstart")||
      location.pathname.startsWith("/finalwash/loadfinish")||
      location.pathname.startsWith("/finalwash/processfinish")||
      location.pathname.startsWith("/finalwash/unloadfinish")||
      location.pathname.startsWith("/finalwash/dryerconveyorin")||
      location.pathname.startsWith("/finalwash/dryerconveyorout")||
      location.pathname.startsWith("/finalwash/dryerovenin")||
      location.pathname.startsWith("/finalwash/dryerovenout")||
      location.pathname.startsWith("/finalwash/dryertumblein")||
      location.pathname.startsWith("/finalwash/dryertumbleout")||
      location.pathname.startsWith("/finalwashqc")||
      location.pathname.startsWith("/finalwash/rewashcreatebatch")
    ) {
      setDryProcess(false);
      setItemContent(WetProcessItemContent);
    }
    else {
      setItemContent([
        ...(auth?.roles?.includes(ROLES.MasterRouting)
        ?[{ primary: "Master Routing", to: "/masterroute" }]
        :[]),
          ...(auth?.roles?.includes(ROLES.WashReceive)
        ?[{ primary: "Wash Receive", to: "/washreceive" }]
        :[]),
        
        
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
      if (matchedRole) {
        window.open(
          ROLES_ADD[matchedRole as keyof typeof ROLES_ADD].route,
          "_blank"
        );
      }
      // if(auth?.roles?.includes(ROLES.Production))
      //   window.open(ROLES_ADD.Production.route, "_blank")
      // else if(auth?.roles?.includes(ROLES.WhiskerIn))
      //   window.open(ROLES_ADD.WhiskerIn.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.WhiskerQC))
      //   window.open(ROLES_ADD.WhiskerQC.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.WhiskerOut))
      //   window.open(ROLES_ADD.WhiskerOut.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.LaserWhiskerIn))
      //   window.open(ROLES_ADD.LaserWhiskerIn.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.LaserWhiskerQC))
      //   window.open(ROLES_ADD.LaserWhiskerQC.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.LaserWhiskerOut))
      //   window.open(ROLES_ADD.LaserWhiskerOut.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.BrushIn))
      //   window.open(ROLES_ADD.BrushIn.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.BrushQC))
      //   window.open(ROLES_ADD.BrushQC.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.BrushOut))
      //   window.open(ROLES_ADD.BrushOut.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.LaserBrushIn))
      //   window.open(ROLES_ADD.LaserBrushIn.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.LaserBrushQC))
      //   window.open(ROLES_ADD.LaserBrushQC.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.LaserBrushOut))
      //   window.open(ROLES_ADD.LaserBrushOut.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.WrinkleIn))
      //   window.open(ROLES_ADD.WrinkleIn.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.WrinkleQC))
      //   window.open(ROLES_ADD.WrinkleQC.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.WrinkleOut))
      //   window.open(ROLES_ADD.WrinkleOut.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.TagIn))
      //   window.open(ROLES_ADD.TagIn.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.TagQC))
      //   window.open(ROLES_ADD.TagQC.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.TagOut))
      //   window.open(ROLES_ADD.TagOut.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.TieIn))
      //   window.open(ROLES_ADD.TieIn.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.TieQC))
      //   window.open(ROLES_ADD.TieQC.route,"_blank")
      // else if(auth?.roles?.includes(ROLES.TieOut))
      //   window.open(ROLES_ADD.TieOut.route,"_blank")
    }
    else{
      // window.open("/firstwash/createbatch", "_blank")
      if (matchedRole) {
        window.open(
          ROLES_ADD[matchedRole as keyof typeof ROLES_ADD].route,
          "_blank"
        );
      }
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
            {auth?.roles?.includes(ROLES.MasterRouting) &&(
               <p
              // onClick={() => navigate("/washreceive")}
              onClick={()=>window.open("/masterroute", "_blank")}
              style={{ textDecoration: "none", color: "#485e68", cursor: "pointer",  }}
            >
              Master Routing
            </p>
            )}
           {auth?.roles?.includes(ROLES.WashReceive) &&(
            <p
              
              onClick={()=>window.open("/washreceive", "_blank")}
              style={{ textDecoration: "none", color: "#485e68", cursor: "pointer",  }}
            >
              Wash Receive
            </p>)}
            {hasDryProcessRole
            &&(
            <p
              onClick={() => handleProcessClick(true)}
              style={{ textDecoration: "none", color: "#485e68", cursor: "pointer",  }}
            >
              Dry Process
            </p>)}

            {hasWetProcessRole &&(<p
              onClick={() => handleProcessClick(false)}
              style={{ textDecoration: "none", color: "#485e68", cursor: "pointer" }}
            >
              Wet Process
            </p>)}
           <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                color: "#485e68",
                cursor: "pointer",
              }}
            >
              <AccountCircleIcon />
              {auth.userId}
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
