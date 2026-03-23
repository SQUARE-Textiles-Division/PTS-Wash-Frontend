import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type BundleInfo from '../TypeAnnotations/BundleInfo';
import { tbCellColor,tbRowColor } from './Colors/Colors';

interface Props {
    rows: BundleInfo[];
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // backgroundColor: '#485e68',
    backgroundColor: tbCellColor,
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: tbRowColor
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));





export default function ReceivedBundles({ rows }: Props) {
  return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: 300,          // vertical scrollbar
          overflowX: "auto",       // horizontal scrollbar
          overflowY: "auto",
          marginLeft:'200px',
          maxWidth: 1100,
          border:"none"
        }}
      >
        <Table
          stickyHeader
          // force horizontal scroll if screen is smaller
          aria-label="customized table"
          sx={{
            '& .MuiTableCell-root':{
                borderBottom:'none'
            }
            
          }}
        >
        <TableHead>
          <TableRow>
            <StyledTableCell>MPO</StyledTableCell>
            <StyledTableCell align="center">Buyer</StyledTableCell>
            <StyledTableCell align="center">Style</StyledTableCell>
            <StyledTableCell align="center">Sales Order</StyledTableCell>
             <StyledTableCell align="center">Bundle Barcode</StyledTableCell>
            <StyledTableCell align="center">Bundle No</StyledTableCell>
            <StyledTableCell align="center">Marker No</StyledTableCell>
            <StyledTableCell align="center">Size</StyledTableCell>
            <StyledTableCell align="center">Shade</StyledTableCell>
            <StyledTableCell align="center">Color</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={`${row.mpo}-${row.bundle_no}-${row.size}-${row.shade}-${row.color}-${row.quantity}`}>
              <StyledTableCell component="th" scope="row">
                {row.mpo}
              </StyledTableCell>
              <StyledTableCell align="center">{row.buyer}</StyledTableCell>
              <StyledTableCell align="center">{row.style}</StyledTableCell>
              <StyledTableCell align="center">{row.so}</StyledTableCell>
              <StyledTableCell align="center">{row.bundle_barcode}</StyledTableCell>
              <StyledTableCell align="center">{row.bundle_no}</StyledTableCell>
              
              <StyledTableCell align="center">{row.marker}</StyledTableCell>
              <StyledTableCell align="center">{row.size}</StyledTableCell>
              <StyledTableCell align="center">{row.shade}</StyledTableCell>
              <StyledTableCell align="center">{row.color}</StyledTableCell>
              <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                <StyledTableCell align="center">{row.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
