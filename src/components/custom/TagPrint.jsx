import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";

// Printable Tag Content Component
const TagContent = ({ barcode, weight, bhori, tola, roti }) => (
  <div
    className="w-[38.1mm] h-[25.4mm] p-1 border border-gray-300 rounded-sm shadow-sm bg-white text-gray-800 text-[7px] leading-tight flex items-center justify-between"
  >
    <div className="flex justify-center items-center w-1/2">
      {barcode && (
        <Barcode value={barcode} width={1} height={30} displayValue={false} />
      )}
    </div>
    <div className="flex flex-col justify-center w-1/2 pl-1">
      {weight && <p>Weight: {weight}g</p>}
      {bhori && <p>Bhori: {bhori}</p>}
      {tola && <p>Tola: {tola}</p>}
      {roti && <p>Roti: {roti}</p>}
    </div>
  </div>
);

// Main Tag Print Component
const TagPrint = ({ barcode, weight, bhori, tola, roti }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `barcode-tag-${barcode}`,
    onAfterPrint: () => console.log("Print success"),
  });

  useEffect(() => {
    if (barcode) {
      setTimeout(() => {
        handlePrint();
      }, 500); // wait for render
    }
  }, [barcode]);

  return (
    <div style={{ display: "none" }}>
      <div ref={componentRef}>
        <TagContent
          barcode={barcode}
          weight={weight}
          bhori={bhori}
          tola={tola}
          roti={roti}
        />
      </div>
    </div>
  );
};

export default TagPrint;
