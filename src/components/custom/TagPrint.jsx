import { useRef } from "react";
import Barcode from "react-barcode";
import { Button } from "../ui/button";

const TagPrint = ({ barcode, weight, bhori, tola, roti, cost }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1200');
    const content = printRef.current.innerHTML;

    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write(`
      <style>
        @media print {
          @page {
            size: 38.1mm 25.4mm;
            margin: 0;
          }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
          }
        }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Printable Tag Area */}
      <div
        ref={printRef}
        className="print:block w-[38.1mm] h-[25.4mm] p-1 border border-gray-300 rounded-sm shadow-sm bg-white text-gray-800 text-[7px] leading-tight flex items-center justify-between"
      >
        {/* Left: Barcode */}
        <div className="flex justify-center items-center w-1/2">
          {barcode && (
            <Barcode value={barcode} width={1} height={30} displayValue={false} />
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center w-1/2 pl-1">
          {weight && <p>Weight: {weight}g</p>}
          {bhori && <p>Bhori: {bhori}</p>}
          {tola && <p>Tola: {tola}</p>}
          {roti && <p>Roti: {roti}</p>}
          {cost && <p className="font-semibold">৳ {cost}</p>}
        </div>
      </div>

      {/* Print Button */}
      <Button
        type="button"
        className="w-1/2 text-xl h-14 bg-green-600 hover:bg-green-700 text-white"
        onClick={handlePrint}
      >
        Print
      </Button>
    </div>
  );
};

export default TagPrint;
