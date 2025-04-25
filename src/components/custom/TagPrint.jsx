import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import styled from "styled-components";
import PropTypes from "prop-types";

const TagWrapper = styled.div`
  width: 58.42mm;
  height: 12.7mm;
  padding: 0;
  background: white;
  color: #000;
  font-size: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;


const BarcodeArea = styled.div`
  width: 52%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 95% !important;
    height: 100% !important;
  }
`;


const InfoArea = styled.div`
  width: 48%;
  height: 100%;
  padding-left: 1mm;
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    margin: 0;
    padding: 0;
     font-size: 8px
    line-height: 1.1;
    white-space: nowrap;
  }
`;


const TagContent = React.forwardRef(
  ({ barcode, weight, bhori, ana, roti, point, karrat }, ref) => {
    // Build individual field strings conditionally
    const line1 = weight ? `Weight : ${weight} g` : "";

    const partsLine2 = [];
    if (bhori) partsLine2.push(`B : ${bhori}`);
    if (ana) partsLine2.push(`A : ${ana}`);
    if (roti) partsLine2.push(`T : ${roti}`);
    if (point) partsLine2.push(`P : ${point}`);
    const line2 = partsLine2.join(" | ");

    const line3 = karrat ? `Karrat : ${karrat}` : "";

    return (
      <div ref={ref}>
        <TagWrapper>
          <BarcodeArea>
            {barcode && (
              <Barcode value={barcode} width={1} height={40} displayValue={false} />
            )}
          </BarcodeArea>
          <InfoArea>
            {line1 && <p>{line1}</p>}
            {line2 && <p>{line2}</p>}
            {line3 && <p>{line3}</p>}
          </InfoArea>
        </TagWrapper>
      </div>
    );
  }
);




TagContent.displayName = "TagContent";

TagContent.propTypes = {
  barcode: PropTypes.string,
  weight: PropTypes.number,
  bhori: PropTypes.number,
  ana: PropTypes.number,
  roti: PropTypes.number,
  point: PropTypes.number,
  karrat: PropTypes.number,
};

// Main Print Component
const TagPrint = ({ barcode, weight, bhori, ana, roti, point, karrat }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `barcode-tag-${barcode}`,
    onAfterPrint: () => console.log("Print done"),
  });

  useEffect(() => {
    if (barcode) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [barcode]);

  return (
    <div id="print-section" style={{ display: "none" }}>
      <TagContent
        ref={componentRef}
        barcode={barcode}
        weight={weight}
        bhori={bhori}
        ana={ana}
        roti={roti}
        point={point}
        karrat={karrat}
      />
    </div>
  );
};

export default TagPrint;
