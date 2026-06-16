import FirstWashQC from "./components/WetProcess/FirstWashQC"


const ROLES={
  Production:'Production/IE',
  WashReceive:'WashReceive',
  MasterRouting:'MasterRouting',

  BrushIn:'BrushInAuthority',
  BrushQC:'BrushQCAuthority',
  BrushOut:'BrushOutAuthority',

  LaserBrushIn:'LaserBrushInAuthority',
  LaserBrushQC:'LaserBrushQCAuthority',
  LaserBrushOut:'LaserBrushOutAuthority',

  LaserWhiskerIn:'LaserWhiskerInAuthority',
  LaserWhiskerQC:'LaserWhiskerQCAuthority',
  LaserWhiskerOut:'LaserWhiskerOutAuthority',

  WrinkleIn:'WrinkleInAuthority',
  WrinkleQC:'WrinkleQCAuthority',
  WrinkleOut:'WrinkleOutAuthority',

  TagIn:'TagInAuthority',
  TagQC:'TagQCAuthority',
  TagOut:'TagOutAuthority',

  TieIn:'TieInAuthority',
  TieQC:'TieQCAuthority',
  TieOut:'TieOutAuthority',
  
  FirstHydroIn:'FirstWashHydroIn',
  FirstHydroOut:'FirstWashHydroOut',
  FirstLoadStart:'FirstWashLoadStart',
  FirstLoadFinish:'FirstWashLoadFinish',
  FirstProcessFinish:'FirstWashProcessFinish',
  FirstUnloadFinish:'FirstWashUnloadFinish',
  FirstTumbleIn:'FirstWashTumbleIn',
  FirstTumbleOut:'FirstWashTumbleOut',
  FirstConveyerIn:'FirstWashConveyerIn',
  FirstConveyerOut:'FirstWashConveyerOut',
  FirstOvenIn:'FirstWashOvenIn',
  FirstOvenOut:'FirstWashOvenOut',
  FirstWashQC:'FirstWashQC',
  FirstWashBatch:'FirstWashBatch',
  FirstWashRewashBatch:'FirstWashRewashBatch',
  // Second Wash
  SecondHydroIn: 'SecondWashHydroIn',
  SecondHydroOut: 'SecondWashHydroOut',
  SecondLoadStart: 'SecondWashLoadStart',
  SecondLoadFinish: 'SecondWashLoadFinish',
  SecondProcessFinish: 'SecondWashProcessFinish',
  SecondUnloadFinish: 'SecondWashUnloadFinish',
  SecondTumbleIn: 'SecondWashTumbleIn',
  SecondTumbleOut: 'SecondWashTumbleOut',
  SecondConveyerIn: 'SecondWashConveyerIn',
  SecondConveyerOut: 'SecondWashConveyerOut',
  SecondOvenIn: 'SecondWashOvenIn',
  SecondOvenOut: 'SecondWashOvenOut',
  SecondWashQC: 'SecondWashQC',
  SecondWashBatch: 'SecondWashBatch',
  SecondWashRewashBatch:'SecondWashRewashBatch',

  // Third Wash
  ThirdHydroIn: 'ThirdWashHydroIn',
  ThirdHydroOut: 'ThirdWashHydroOut',
  ThirdLoadStart: 'ThirdWashLoadStart',
  ThirdLoadFinish: 'ThirdWashLoadFinish',
  ThirdProcessFinish: 'ThirdWashProcessFinish',
  ThirdUnloadFinish: 'ThirdWashUnloadFinish',
  ThirdTumbleIn: 'ThirdWashTumbleIn',
  ThirdTumbleOut: 'ThirdWashTumbleOut',
  ThirdConveyerIn: 'ThirdWashConveyerIn',
  ThirdConveyerOut: 'ThirdWashConveyerOut',
  ThirdOvenIn: 'ThirdWashOvenIn',
  ThirdOvenOut: 'ThirdWashOvenOut',
  ThirdWashQC: 'ThirdWashQC',
  ThirdWashBatch: 'ThirdWashBatch',
  ThirdWashRewashBatch:'ThirdWashRewashBatch',

  // Final Wash
  FinalHydroIn: 'FinalWashHydroIn',
  FinalHydroOut: 'FinalWashHydroOut',
  FinalLoadStart: 'FinalWashLoadStart',
  FinalLoadFinish: 'FinalWashLoadFinish',
  FinalProcessFinish: 'FinalWashProcessFinish',
  FinalUnloadFinish: 'FinalWashUnloadFinish',
  FinalTumbleIn: 'FinalWashTumbleIn',
  FinalTumbleOut: 'FinalWashTumbleOut',
  FinalConveyerIn: 'FinalWashConveyerIn',
  FinalConveyerOut: 'FinalWashConveyerOut',
  FinalOvenIn: 'FinalWashOvenIn',
  FinalOvenOut: 'FinalWashOvenOut',
  FinalWashQC: 'FinalWashQC',
  FinalWashBatch: 'FinalWashBatch',
  FinalWashRewashBatch:'FinalWashRewashBatch',

  WhiskerIn:'WhiskerInAuthority',
  WhiskerQC:'WhikserQCAuthority',
  WhiskerOut:'WhiskerOutAuthority'
}




export const ROLES_ADD = {
  // =====================
  // CORE
  // =====================
  Production: {
    role: ROLES.Production,
    route: '/planning',
  },

  WashReceive: {
    role: ROLES.WashReceive,
    route: '/washreceive',
  },

  MasterRouting: {
    role: ROLES.MasterRouting,
    route: '/masterroute',
  },

  // =====================
  // FIRST WASH
  // =====================
  FirstHydroIn: {
    role: ROLES.FirstHydroIn,
    route: '/firstwash/hydroin',
  },
  FirstHydroOut: {
    role: ROLES.FirstHydroOut,
    route: '/firstwash/hydroout',
  },
  FirstLoadStart: {
    role: ROLES.FirstLoadStart,
    route: '/firstwash/loadstart',
  },
  FirstLoadFinish: {
    role: ROLES.FirstLoadFinish,
    route: '/firstwash/loadfinish',
  },
  FirstProcessFinish: {
    role: ROLES.FirstProcessFinish,
    route: '/firstwash/processfinish',
  },
  FirstUnloadFinish: {
    role: ROLES.FirstUnloadFinish,
    route: '/firstwash/unloadfinish',
  },
  FirstTumbleIn: {
    role: ROLES.FirstTumbleIn,
    route: '/firstwash/dryertumblein',
  },
  FirstTumbleOut: {
    role: ROLES.FirstTumbleOut,
    route: '/firstwash/dryertumbleout',
  },
  FirstConveyerIn: {
    role: ROLES.FirstConveyerIn,
    route: '/firstwash/dryerconveyorin',
  },
  FirstConveyerOut: {
    role: ROLES.FirstConveyerOut,
    route: '/firstwash/dryerconveyorout',
  },
  FirstOvenIn: {
    role: ROLES.FirstOvenIn,
    route: '/firstwash/dryerovenin',
  },
  FirstOvenOut: {
    role: ROLES.FirstOvenOut,
    route: '/firstwash/dryerovenout',
  },
  FirstWashQC: {
    role: ROLES.FirstWashQC,
    route: '/firstwashqc',
  },
  FirstWashBatch: {
    role: ROLES.FirstWashBatch,
    route: '/firstwash/createbatch',
  },

  // =====================
  // SECOND WASH
  // =====================
  SecondHydroIn: {
    role: ROLES.SecondHydroIn,
    route: '/secondwash/hydroin',
  },
  SecondHydroOut: {
    role: ROLES.SecondHydroOut,
    route: '/secondwash/hydroout',
  },
  SecondLoadStart: {
    role: ROLES.SecondLoadStart,
    route: '/secondwash/loadstart',
  },
  SecondLoadFinish: {
    role: ROLES.SecondLoadFinish,
    route: '/secondwash/loadfinish',
  },
  SecondProcessFinish: {
    role: ROLES.SecondProcessFinish,
    route: '/secondwash/processfinish',
  },
  SecondUnloadFinish: {
    role: ROLES.SecondUnloadFinish,
    route: '/secondwash/unloadfinish',
  },
  SecondTumbleIn: {
    role: ROLES.SecondTumbleIn,
    route: '/secondwash/dryertumblein',
  },
  SecondTumbleOut: {
    role: ROLES.SecondTumbleOut,
    route: '/secondwash/dryertumbleout',
  },
  SecondConveyerIn: {
    role: ROLES.SecondConveyerIn,
    route: '/secondwash/dryerconveyorin',
  },
  SecondConveyerOut: {
    role: ROLES.SecondConveyerOut,
    route: '/secondwash/dryerconveyorout',
  },
  SecondOvenIn: {
    role: ROLES.SecondOvenIn,
    route: '/secondwash/dryerovenin',
  },
  SecondOvenOut: {
    role: ROLES.SecondOvenOut,
    route: '/secondwash/dryerovenout',
  },
  SecondWashQC: {
    role: ROLES.SecondWashQC,
    route: '/secondwashqc',
  },
  SecondWashBatch: {
    role: ROLES.SecondWashBatch,
    route: '/secondwash/createbatch',
  },

  // =====================
  // THIRD WASH
  // =====================
  ThirdHydroIn: {
    role: ROLES.ThirdHydroIn,
    route: '/thirdwash/hydroin',
  },
  ThirdHydroOut: {
    role: ROLES.ThirdHydroOut,
    route: '/thirdwash/hydroout',
  },
  ThirdLoadStart: {
    role: ROLES.ThirdLoadStart,
    route: '/thirdwash/loadstart',
  },
  ThirdLoadFinish: {
    role: ROLES.ThirdLoadFinish,
    route: '/thirdwash/loadfinish',
  },
  ThirdProcessFinish: {
    role: ROLES.ThirdProcessFinish,
    route: '/thirdwash/processfinish',
  },
  ThirdUnloadFinish: {
    role: ROLES.ThirdUnloadFinish,
    route: '/thirdwash/unloadfinish',
  },
  ThirdTumbleIn: {
    role: ROLES.ThirdTumbleIn,
    route: '/thirdwash/dryertumblein',
  },
  ThirdTumbleOut: {
    role: ROLES.ThirdTumbleOut,
    route: '/thirdwash/dryertumbleout',
  },
  ThirdConveyerIn: {
    role: ROLES.ThirdConveyerIn,
    route: '/thirdwash/dryerconveyorin',
  },
  ThirdConveyerOut: {
    role: ROLES.ThirdConveyerOut,
    route: '/thirdwash/dryerconveyorout',
  },
  ThirdOvenIn: {
    role: ROLES.ThirdOvenIn,
    route: '/thirdwash/dryerovenin',
  },
  ThirdOvenOut: {
    role: ROLES.ThirdOvenOut,
    route: '/thirdwash/dryerovenout',
  },
  ThirdWashQC: {
    role: ROLES.ThirdWashQC,
    route: '/thirdwashqc',
  },
  ThirdWashBatch: {
    role: ROLES.ThirdWashBatch,
    route: '/thirdwash/createbatch',
  },

  // =====================
  // FINAL WASH
  // =====================
  FinalHydroIn: {
    role: ROLES.FinalHydroIn,
    route: '/finalwash/hydroin',
  },
  FinalHydroOut: {
    role: ROLES.FinalHydroOut,
    route: '/finalwash/hydroout',
  },
  FinalLoadStart: {
    role: ROLES.FinalLoadStart,
    route: '/finalwash/loadstart',
  },
  FinalLoadFinish: {
    role: ROLES.FinalLoadFinish,
    route: '/finalwash/loadfinish',
  },
  FinalProcessFinish: {
    role: ROLES.FinalProcessFinish,
    route: '/finalwash/processfinish',
  },
  FinalUnloadFinish: {
    role: ROLES.FinalUnloadFinish,
    route: '/finalwash/unloadfinish',
  },
  FinalTumbleIn: {
    role: ROLES.FinalTumbleIn,
    route: '/finalwash/dryertumblein',
  },
  FinalTumbleOut: {
    role: ROLES.FinalTumbleOut,
    route: '/finalwash/dryertumbleout',
  },
  FinalConveyerIn: {
    role: ROLES.FinalConveyerIn,
    route: '/finalwash/dryerconveyorin',
  },
  FinalConveyerOut: {
    role: ROLES.FinalConveyerOut,
    route: '/finalwash/dryerconveyorout',
  },
  FinalOvenIn: {
    role: ROLES.FinalOvenIn,
    route: '/finalwash/dryerovenin',
  },
  FinalOvenOut: {
    role: ROLES.FinalOvenOut,
    route: '/finalwash/dryerovenout',
  },
  FinalWashQC: {
    role: ROLES.FinalWashQC,
    route: '/finalwashqc',
  },
  FinalWashBatch: {
    role: ROLES.FinalWashBatch,
    route: '/finalwash/createbatch',
  },

  // =====================
  // PROCESSES
  // =====================
  WhiskerIn: {
    role: ROLES.WhiskerIn,
    route: '/whiskerin',
  },
  WhiskerQC: {
    role: ROLES.WhiskerQC,
    route: '/whiskerqc',
  },
  WhiskerOut: {
    role: ROLES.WhiskerOut,
    route: '/whiskeroutput',
  },
  LaserWhiskerIn:{
    role:ROLES.LaserWhiskerIn,
    route:'/laserwhiskerin'
  },
  LaserWhiskerQC:{
    role:ROLES.LaserWhiskerQC,
    route:'/laserwhiskerqc'
  },
  LaserWhiskerOut:{
    role:ROLES.LaserWhiskerOut,
    route:'/laserwhiskeroutput'
  },
  BrushIn:{
    role:ROLES.BrushIn,
    route:'/brushin'
  },
  BrushQC:{
    role:ROLES.BrushQC,
    route:'/brushqc'
  },
  BrushOut:{
    role:ROLES.BrushOut,
    route:'/brushoutput'
  },
  LaserBrushIn:{
    role:ROLES.LaserBrushIn,
    route:'/laserbrushin'
  },
  LaserBrushQC:{
    role:ROLES.LaserBrushQC,
    route:'/laserbrushqc'
  },
  LaserBrushOut:{
    role:ROLES.LaserBrushOut,
    route:'/laserbrushqc'
  },
  WrinkleIn:{
    role:ROLES.WrinkleIn,
    route:'/wrinklein'
  },
  WrinkleQC:{
    role:ROLES.WrinkleQC,
    route:'/wrinkleqc'
  },
  WrinkleOut:{
    role:ROLES.WrinkleOut,
    route:'/wrinkleoutput'
  },
  TagIn:{
    role:ROLES.TagIn,
    route:'tagin'
  },
  TagQC:{
    role:ROLES.TagQC,
    route:'/tagqc'
  },
  TagOut:{
    role:ROLES.TagOut,
    route:'/tagoutput'
  },
  TieIn:{
    role:ROLES.TieIn,
    route:'/tiein'
  },
  TieQC:{
    role:ROLES.TieQC,
    route:'/tieqc'
  },
  TieOut:{
    role:ROLES.TieOut,
    route:'/tieoutput'
  }

};

// export default ROLES_ADD
export default ROLES