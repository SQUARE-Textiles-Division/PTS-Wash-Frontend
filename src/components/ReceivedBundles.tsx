import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { TableRowProps } from '@mui/material/TableRow';
import { useVirtualizer } from "@tanstack/react-virtual";
import Paper from '@mui/material/Paper';
import type BundleInfo from '../TypeAnnotations/BundleInfo';
import { tbCellColor,tbRowColor } from './Colors/Colors';
import React from 'react';
import type IndividualInfo from '../TypeAnnotations/IndividualInfo';

interface Props {
    rows: IndividualInfo[];
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // backgroundColor: '#485e68',
    backgroundColor: tbCellColor,
    lineHeight:0.5,
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    lineHeight:0.6,
    padding: '4px 6px',
    
    // paddingRight:'50px'
  },
}));

const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
  // height: '5px', 
  '&:nth-of-type(odd)': {
    backgroundColor: tbRowColor
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));




// const Row = React.memo(({ index, style, data }: any) => {
//   const row = data[index];

//   return (
//     <StyledTableRow style={style} key={row.bundle_barcode}>
//       <StyledTableCell>{row.mpo}</StyledTableCell>
//       <StyledTableCell align="center">{row.buyer}</StyledTableCell>
//       <StyledTableCell align="center">{row.style}</StyledTableCell>
//       <StyledTableCell align="center">{row.so}</StyledTableCell>
//       <StyledTableCell align="center">{row.bundle_barcode}</StyledTableCell>
//       <StyledTableCell align="center">{row.bundle_no}</StyledTableCell>
//       <StyledTableCell align="center">{row.marker}</StyledTableCell>
//       <StyledTableCell align="center">{row.size}</StyledTableCell>
//       <StyledTableCell align="center">{row.shade}</StyledTableCell>
//       <StyledTableCell align="center">{row.color}</StyledTableCell>
//       <StyledTableCell align="center">{row.quantity}</StyledTableCell>
//     </StyledTableRow>
//   );
// });

export default function ReceivedBundles({ rows }: Props) {


  const parentRef = React.useRef<HTMLDivElement | null>(null);

  // 🔥 Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 3, // row height
    overscan: 20
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  return (
      <TableContainer
        component={Paper}
        ref={parentRef}
        elevation={0}
        sx={{
          maxHeight: 480,          // vertical scrollbar
          overflowX: "auto",       // horizontal scrollbar
          overflowY: "auto",
          marginLeft:'235px',
          maxWidth: 1150,
          border:"none",
          position:'fixed',
          top:125
        }}
      >
        <Table
          stickyHeader
          // force horizontal scroll if screen is smaller
          aria-label="customized table"
          sx={{
            '& .MuiTableCell-root':{
                borderBottom:'none'
            },
            
          }}
        >
        <TableHead> 
          <TableRow 
          // component="div"
          >
            <StyledTableCell>MPO</StyledTableCell>
            <StyledTableCell align="center">Buyer</StyledTableCell>
            <StyledTableCell align="center">Style</StyledTableCell>
            <StyledTableCell align="center">Sales Order</StyledTableCell>
             {/* <StyledTableCell align="center">Bundle Barcode</StyledTableCell> */}
             <StyledTableCell align="center">Individual Barcode</StyledTableCell>
            {/* <StyledTableCell align="center">Bundle No</StyledTableCell> */}
            <StyledTableCell align="center">Marker No</StyledTableCell>
            <StyledTableCell align="center">Size</StyledTableCell>
            <StyledTableCell align="center">Shade</StyledTableCell>
            <StyledTableCell align="center">Color</StyledTableCell>
            {/* <StyledTableCell align="center">Quantity</StyledTableCell> */}
            {/* <StyledTableCell align="center">Status</StyledTableCell> */}
          </TableRow>
        </TableHead>
        {/* <TableBody
          // component="div"
          style={{
            position: "relative",
            height: rowVirtualizer.getTotalSize()
          }}
        >
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];

            return (
              <StyledTableRow
                // component="div" 
                key={row.individual_barcode}
                style={{
                  // position: "absolute",
                  top: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                  width: "100%",
                }}
              >
                <StyledTableCell component="th" scope="row">
                    {row.mpo}
                </StyledTableCell>
                <StyledTableCell align="center">{row.buyer}</StyledTableCell>
                <StyledTableCell align="center">{row.style}</StyledTableCell>
                <StyledTableCell align="center">{row.so}</StyledTableCell>
                {/* <StyledTableCell align="center">{row.bundle_barcode}</StyledTableCell> */}
                 {/* <StyledTableCell align="center">{row.individual_barcode}</StyledTableCell>
                {/* <StyledTableCell align="center">{row.bundle_no}</StyledTableCell> */}
                {/* <StyledTableCell align="center">{row.marker}</StyledTableCell> */}
                {/* <StyledTableCell align="center">{row.size}</StyledTableCell> */}
                {/* <StyledTableCell align="center">{row.shade}</StyledTableCell> */}
                {/* <StyledTableCell align="center">{row.color}</StyledTableCell>  */}
                {/* <StyledTableCell align="center">{row.quantity}</StyledTableCell> */}
              {/* </StyledTableRow> */}
            {/* ); */}
          {/* })} */}
        {/* </TableBody> */}
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={`${row.individual_barcode}`}>
              <StyledTableCell component="th" scope="row">
                {row.mpo}
              </StyledTableCell>
              <StyledTableCell align="center">{row.buyer}</StyledTableCell>
              <StyledTableCell align="center">{row.style}</StyledTableCell>
              <StyledTableCell align="center">{row.so}</StyledTableCell>
              <StyledTableCell align="center">{row.individual_barcode}</StyledTableCell>
              
              <StyledTableCell align="center">{row.marker}</StyledTableCell>
              <StyledTableCell align="center">{row.size}</StyledTableCell>
              <StyledTableCell align="center">{row.shade}</StyledTableCell>
              <StyledTableCell align="center">{row.color}</StyledTableCell>

   
           </StyledTableRow>)
          )}
          </TableBody>
      </Table>
    </TableContainer>
  );
}
