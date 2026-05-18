import { useRef, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { formatBDT } from '@/utils/currencyFormatter';

interface PrintInvoiceProps {
  order: {
    order_no: string;
    created_at: string;
    status: string;
    total: string | number;
    delivery_charge: string | number;
    user_name: string;
    user_phone: string;
    user_email?: string;
    user_address?: string;
    products: Array<{
      id?: string | number;
      product_name: string;
      product_image?: string;
      quantity: number | string;
      price?: number | string;
      subtotal: number | string;
      service_type?: string;
    }>;
    payment?: {
      payment_method: string;
      transaction_number?: string;
    } | null;
    student?: {
      email?: string;
      personal_info?: { location?: string; district?: string };
    };
    student_address?: {
      address?: string;
    };
  };
  shippingInfo?: {
    name: string;
    address: string;
    phone: string;
  } | null;
  buyerProfile?: {
    student?: { name: string; email: string; mobile: string };
    personal_info?: { location?: string; district?: string };
  } | null;
  fullAddressText?: string | null;
  orderTransaction?: {
    payment_method?: string;
    Transaction_ID?: string;
  } | null;
  baseURL: string;
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({
  order,
  shippingInfo,
  buyerProfile,
  fullAddressText,
  orderTransaction,
  baseURL,
}) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  const subtotal = Number(order.total) - Number(order.delivery_charge);
  const invoiceNumber = order.order_no;
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const printDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const trackingUrl = `${window.location.origin}/order-tracking/${invoiceNumber}`;

  // Generate QR Code
  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, trackingUrl, {
        width: 90,
        margin: 1,
        color: { dark: '#1e293b', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [trackingUrl]);

  // Generate Barcode
  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, invoiceNumber, {
          format: 'CODE128',
          width: 2,
          height: 60,
          displayValue: true,
          fontSize: 12,
          font: 'monospace',
          textMargin: 4,
          margin: 5,
          background: '#ffffff',
          lineColor: '#1e293b',
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [invoiceNumber]);

  // Helper function to format address
  const formatAddress = (address: string | undefined) => {
    if (!address) return 'Not provided';
    if (!isNaN(Number(address))) {
      return 'Address not available';
    }
    return address;
  };

  return (
    <>
      <style>{`
        @media print {
          /* Hide all other elements on the page during print */
          body * {
            visibility: hidden;
          }
          /* Show only the print-only container and its children */
          .print-only, .print-only * {
            visibility: visible;
          }

          /* Force visibility of the invoice container */
          .print-only {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: white !important;
            z-index: 9999 !important;
          }
          
          /* Prevent page breaks inside critical sections */
          .print-only .section-no-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Table page breaking logic */
          .print-only table {
            page-break-inside: auto;
            width: 100% !important;
          }
          .print-only tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .print-only thead {
            display: table-header-group;
          }
          .print-only tfoot {
            display: table-footer-group;
          }
          
          @page { 
            margin: 15mm;
            size: A4;
          }

          /* Hide unwanted elements */
          button, .no-print { display: none !important; }
        }
      `}</style>

      <div className="print-only" style={{
        fontFamily: 'Arial, sans-serif',
        color: '#111',
        background: '#fff',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        {/* Invoice Header: 1 Row, 2 Columns */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '3px solid #f5d800',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>

          {/* Column 1: Logo & Invoice Number (Left Aligned) */}
          <div>
            <img
              src="/image/logo/logo.jpg"
              alt="Golden Life"
              style={{ height: '48px', objectFit: 'contain', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0, color: '#111', lineHeight: '1.2' }}>
                Invoice
              </h1>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#777', margin: 0 }}>
                #{order.order_no}
              </h2>
            </div>
          </div>

          {/* Column 2: Date & Status (Right Aligned) */}
          <div style={{ textAlign: 'right', alignSelf: 'flex-end' }}>
            <p style={{ fontSize: '20px', color: '#777', margin: 0 }}>
              Date: {orderDate} &nbsp;|&nbsp; Status: <span style={{ fontWeight: 'bold', color: '#111' }}>{order.status}</span>
            </p>
          </div>

        </div>
        {/* Billing + Shipping Info with QR/Barcode */}
        {/* Billing + Shipping Info with QR/Barcode */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '24px', borderTop: '1px solid #eee', paddingTop: '14px', marginBottom: '24px' }}>
          {/* Billing Info */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#111', textTransform: 'uppercase', marginBottom: '10px', marginTop: 0 }}>Billing Address</p>
            {buyerProfile ? (
              <>
                <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111' }}>{buyerProfile.student?.name || order.user_name}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>
                  {buyerProfile.personal_info?.location || buyerProfile.personal_info?.district || formatAddress(order.user_address)}
                </p>
                {buyerProfile.student?.email && <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{buyerProfile.student.email}</p>}
                <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{buyerProfile.student?.mobile || order.user_phone}</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111' }}>{order.user_name}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>
                  {order.student?.personal_info?.location || order.student_address?.address || fullAddressText || formatAddress(order.user_address)}
                </p>
                {order.student?.email && <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{order.student.email}</p>}
                <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{order.user_phone}</p>
              </>
            )}
          </div>

          {/* Shipping Address */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#111', textTransform: 'uppercase', marginBottom: '10px', marginTop: 0 }}>Shipping Address</p>
            {shippingInfo ? (
              <>
                <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111' }}>{shippingInfo.name}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{shippingInfo.address}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{shippingInfo.phone}</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111' }}>{order.user_name}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>
                  {order.student_address?.address || fullAddressText || formatAddress(order.user_address)}
                </p>
                <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{order.user_phone}</p>
              </>
            )}
          </div>

          {/* QR/Barcode Box */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <canvas ref={qrCanvasRef} width={90} height={90} style={{ borderRadius: '4px' }} />
            <svg ref={barcodeRef} style={{ maxWidth: '180px', height: '70px' }} />
          </div>
        </div>

        {/* Product Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px 14px 10px 0', textAlign: 'left', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Description</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px' }}>Qty</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '110px' }}>Unit Price</th>
              <th style={{ padding: '10px 0 10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '110px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((product) => {
              const qty = Number(product.quantity) || 1;
              const itemTotal = Number(product.subtotal) || 0;
              const unitPrice = qty > 0 ? (itemTotal / qty) : itemTotal;

              return (
                <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 14px 12px 0', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={product.product_image?.startsWith('http') ? product.product_image : (
                          product.service_type === 'course'
                            ? `${baseURL}/uploads/course/course_image/${product.product_image}`
                            : `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`
                        )}
                        alt={product.product_name}
                        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee', flexShrink: 0 }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/40?text=?'; }}
                      />
                      <span style={{ fontWeight: 700, color: '#111' }}>{product.product_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: '#555' }}>{qty}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#555' }}>{formatBDT(unitPrice, { compact: true })}</td>
                  <td style={{ padding: '12px 0 12px 14px', textAlign: 'right', fontWeight: 800, color: '#111' }}>{formatBDT(itemTotal, { compact: true })}</td>
                </tr>
              );
            })}
          </tbody>

        </table>

        {/* Totals */}
        <div className="section-no-break" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '280px', fontSize: '13px' }}>
            {[
              { label: 'Subtotal', value: formatBDT(subtotal, { compact: true }) },
              { label: 'Delivery Fee', value: formatBDT(Number(order.delivery_charge), { compact: true }) },
              { label: 'Total Amount Paid', value: formatBDT(Number(order.total), { compact: true }), bold: true },
              { label: 'Total Due', value: '৳0', bold: true },
            ].map(({ label, value, bold }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ color: bold ? '#111' : '#555', fontWeight: bold ? 800 : 500 }}>{label}</span>
                <span style={{ fontWeight: bold ? 800 : 600, color: '#111' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="section-no-break" style={{ padding: '12px', background: '#f0f7ff', border: '1px solid #dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CreditCard size={16} color="#2563eb" />
          <div>
            <div style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '14px' }}>{orderTransaction?.payment_method || order.payment?.payment_method || '—'}</div>
            <div style={{ fontSize: '12px', color: '#3b82f6' }}>
              TXN: {orderTransaction?.Transaction_ID || order.payment?.transaction_number || '—'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '11px', color: '#555', lineHeight: 1.6, marginTop: '24px' }}>
          <p style={{ margin: '0 0 15px 0' }}>
            Please note that depending on the availability of your products, your order will be shipped within 5 to 7 business days. Please go through the return instructions as well as warranty period of the products upon receiving. For any additional queries please call 654-123-123 or send us an email at support@goldenlife.my
          </p>
          <p style={{ fontWeight: 800, color: '#111', fontSize: '12px', margin: 0 }}>
            Thank you for shopping!
          </p>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic', margin: '10px 0 0 0' }}>
            Printed on: {printDateTime}
          </p>
        </div>
      </div>
    </>
  );
};

export default PrintInvoice;
