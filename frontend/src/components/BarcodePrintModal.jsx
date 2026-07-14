import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import { FiX, FiPrinter } from 'react-icons/fi';

const BarcodePrintModal = ({ product, onClose }) => {
    const printRef = useRef();

    const handlePrint = () => {
        const printContent = printRef.current;
        const windowPrint = window.open('', '', 'width=600,height=400');
        windowPrint.document.write(`
            <html>
                <head>
                    <title>Cetak Barcode - ${product.name}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            font-family: sans-serif;
                        }
                        .barcode-container {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .product-name {
                            font-size: 16px;
                            font-weight: bold;
                            margin-bottom: 5px;
                        }
                        .product-price {
                            font-size: 14px;
                            margin-bottom: 10px;
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        windowPrint.document.close();
        windowPrint.focus();
        setTimeout(() => {
            windowPrint.print();
            windowPrint.close();
        }, 250);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>Cetak Barcode</h2>
                    <button className="close-btn" onClick={onClose}><FiX /></button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                    
                    <div ref={printRef} className="barcode-print-area">
                        <div className="barcode-container">
                            <div className="product-name">{product.name}</div>
                            <div className="product-price">Rp {product.price?.toLocaleString('id-ID')}</div>
                            <Barcode 
                                value={product.id.toString().padStart(8, '0')} 
                                format="CODE128" 
                                width={1.5}
                                height={60}
                                displayValue={true}
                                fontSize={14}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', width: '100%' }}>
                        <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={handlePrint}>
                            <FiPrinter style={{ marginRight: '8px' }} /> Cetak Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarcodePrintModal;
