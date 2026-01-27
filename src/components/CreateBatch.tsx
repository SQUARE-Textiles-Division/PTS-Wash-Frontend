import { useRef, useState } from "react";
import type BundleInfo from "../TypeAnnotations/BundleInfo";
import CheckReceive from "./CheckReceive";
import BatchBundles from "./BatchBundles";
import { QRCodeCanvas } from "qrcode.react";
import { Typography ,Paper,Box,Button} from "@mui/material";
import { useReactToPrint } from "react-to-print";

export default function CreateBatch() {
        

    const [items, setItems] = useState<BundleInfo[]>([]);
    const [qrData, setQrData] = useState<any | null>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
    });
     return (
            <div style={
            {
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                gap:'20px',
            }
            }>
                <CheckReceive items={items} setItems={setItems} qrData={qrData} setQrData={setQrData} />
                <BatchBundles rows={items}></BatchBundles>
                    {qrData && (
                            <Paper
                                ref={printRef}
                                elevation={5}
                                sx={{
                                mt: 3,
                                px: 2,
                                pt:1,
                                pb:1,
                                // p: 3,
                                width: 280,
                                textAlign: "center",
                                }}
                            >
                                {/* <Typography
                                gutterBottom
                                sx={{
                                    writingMode: "vertical-rl",   // vertical text
                                    textOrientation: "mixed",
                                    mx: "auto",                  // center inside Paper
                                    textAlign: "right",
                                    fontSize: 14,
                                }}
                                >
                                {qrData.routing.map((item: any, index: number) => (
                                    <span key={index}>
                                    {`${item.stage}->`}
                                    </span>
                                ))}
                                </Typography> */}

                                <QRCodeCanvas
                                value={`W8220${qrData.date}B00000000${qrData.batch_id}`}
                                size={200}
                                level="H"
                                />

                                <Box sx={{ textAlign: "left" }}>
                                <Typography variant="body2" sx={{
                                    textAlign: "center",
                                    fontSize: 12,
                                    mb: 2
                                }}>
                                    {`W8220${qrData.date}B${String(qrData.batch_id).padStart(10, '0')}`}
                                </Typography>
                                <Typography variant="body2">
                                    <b>Total Quantity:</b> {qrData.total_items}
                                </Typography>
                                 <Typography variant="body2">
                                    <b>MPO</b> {qrData.mpo}
                                </Typography>
                                <Typography variant="body2">
                                    <b>Size:</b> {qrData.size}
                                </Typography>
                                <Typography variant="body2">
                                    <b>Color:</b> {qrData.color}
                                </Typography>
                                
                                </Box>
                            </Paper>)
                    }
                    {qrData && (
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={handlePrint}
                        >
                            Print QR Code
                        </Button>
                )}
                {/* <ReceivedBundles rows={items} /> */}
            </div>
  )
}