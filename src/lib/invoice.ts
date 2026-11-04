import { jsPDF } from 'jspdf';

export function generateOrderInvoice(order: any) {
  const doc = new jsPDF();

  const primaryColor = '#1e293b';
  const accentColor = '#e11d48';

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('ClothSpace Marketplace', 20, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Peer-to-Peer Designer Clothing Sharing Platform', 20, 30);

  // Invoice Details right-aligned
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER INVOICE', 140, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const orderId = order.id || order._id || 'ORD-0000';
  doc.text(`Invoice #: ${String(orderId).slice(-8).toUpperCase()}`, 140, 27);
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  doc.text(`Date: ${dateStr}`, 140, 33);

  // Buyer Information
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed & Shipped To:', 20, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Customer: ${order.buyerName || 'Valued Fashion Connoisseur'}`, 20, 63);
  doc.text(`Email: ${order.buyerEmail || 'N/A'}`, 20, 70);
  doc.text(`Phone: ${order.phone || 'N/A'}`, 20, 77);
  doc.text(`Address: ${order.shippingAddress || 'N/A'}`, 20, 84);

  // Designer / Seller Information
  doc.setFont('helvetica', 'bold');
  doc.text('Designer / Atelier:', 120, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Atelier: ${order.sellerName || 'ClothSpace Verified Designer'}`, 120, 63);
  doc.text(`Seller Email: ${order.sellerEmail || 'N/A'}`, 120, 70);
  doc.text(`Status: ${order.status || 'Confirmed'}`, 120, 77);
  doc.text(`Payment: ${order.paymentMethod || 'Cash on Delivery'}`, 120, 84);

  // Line separator
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(20, 95, 190, 95);

  // Items Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(20, 102, 170, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Apparel Item & Specification', 25, 108);
  doc.text('Size', 110, 108);
  doc.text('Qty', 130, 108);
  doc.text('Unit Price', 145, 108);
  doc.text('Total', 172, 108);

  // Item Row
  doc.setFont('helvetica', 'normal');
  const title = order.clothTitle || 'Bespoke Designer Apparel';
  doc.text(title.length > 35 ? title.substring(0, 32) + '...' : title, 25, 122);
  doc.text(String(order.size || 'M'), 112, 122);
  doc.text(String(order.quantity || 1), 133, 122);
  doc.text(`$${Number(order.unitPrice || order.totalPrice || 0).toFixed(2)}`, 147, 122);
  doc.text(`$${Number(order.totalPrice || 0).toFixed(2)}`, 172, 122);

  // Fabric & Category Note
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const detailStr = `Category: ${order.clothCategory || 'General'} | Fabric: ${order.fabric || 'Premium Textile'} | Origin: ${order.brandOrigin || 'Artisanal Studio'}`;
  doc.text(detailStr, 25, 128);

  // Table Bottom Line
  doc.setDrawColor(203, 213, 225);
  doc.line(20, 135, 190, 135);

  // Totals Summary
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.text('Subtotal:', 140, 147);
  doc.text(`$${Number(order.totalPrice || 0).toFixed(2)}`, 172, 147);

  doc.text('Shipping (Standard Designer):', 140, 154);
  doc.text('$0.00 (Free)', 167, 154);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Grand Total:', 140, 165);
  doc.text(`$${Number(order.totalPrice || 0).toFixed(2)}`, 170, 165);

  // Platform Guarantee & Notes
  doc.setFillColor(248, 250, 252);
  doc.rect(20, 185, 170, 35, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('ClothSpace Buyer Protection Guarantee', 25, 193);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('• 100% Authentic quality fabrics verified by independent boutique tailors.', 25, 200);
  doc.text('• 7-day hassle-free designer exchange guarantee on sizing discrepancies.', 25, 205);
  doc.text('• 24/7 dedicated customer concierge support: concierge@clothspace.com', 25, 210);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for supporting independent fashion designers and sustainable clothing sharing.', 105, 260, { align: 'center' });
  doc.text('ClothSpace Inc. — Fashion with Substance', 105, 265, { align: 'center' });

  // Save the PDF
  doc.save(`ClothSpace-Invoice-${String(orderId).slice(-6)}.pdf`);
}
