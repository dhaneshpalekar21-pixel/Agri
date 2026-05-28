import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Download } from 'lucide-react'

export default function InvoiceView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const invoice = {
    id,
    shop: { name: 'Patil Krushi Seva Kendra', address: 'Baramati, Pune - 413102, Maharashtra', gst: '27AABCU9603R1ZX', phone: '+91 9876543210' },
    customer: { name: 'Suresh Patil', phone: '9876543210', village: 'Baramati' },
    items: [
      { name: 'Urea Fertilizer 50kg', qty: 2, unit: 'Bag', price: 450, total: 900 },
      { name: 'DAP Fertilizer 50kg', qty: 1, unit: 'Bag', price: 1350, total: 1350 },
      { name: 'Chlorpyrifos 500ml', qty: 3, unit: 'Bottle', price: 320, total: 960 },
    ],
    subtotal: 3210,
    gst: 577.8,
    discount: 0,
    total: 3787.8,
    paymentType: 'Cash',
    date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    createdBy: 'Admin',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary text-sm">
            <Printer size={15} /> Print
          </button>
        </div>
      </div>

      {/* Invoice Card */}
      <div id="invoice-print" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6" style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
          <div className="flex items-start justify-between text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌾</span>
                <h1 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>{invoice.shop.name}</h1>
              </div>
              <p className="text-sm opacity-80">{invoice.shop.address}</p>
              <p className="text-sm opacity-80">GST: {invoice.shop.gst}</p>
              <p className="text-sm opacity-80">Ph: {invoice.shop.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold opacity-30">TAX INVOICE</p>
              <p className="font-bold text-lg">{invoice.id}</p>
              <p className="text-sm opacity-80">{invoice.date}</p>
              <p className="text-sm opacity-80">{invoice.time}</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Bill To</p>
              <p className="font-semibold text-gray-800">{invoice.customer.name}</p>
              <p className="text-sm text-gray-500">{invoice.customer.phone}</p>
              <p className="text-sm text-gray-500">{invoice.customer.village}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Payment</p>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {invoice.paymentType}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 py-4">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                {['#', 'Product', 'Qty', 'Rate', 'Amount'].map(h => (
                  <th key={h} className="text-left py-2 text-xs font-semibold text-gray-400 uppercase"
                    style={{ textAlign: h === 'Rate' || h === 'Amount' ? 'right' : 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="py-3 text-sm text-gray-400">{i + 1}</td>
                  <td className="py-3">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.unit}</p>
                  </td>
                  <td className="py-3 text-sm text-gray-700">{item.qty}</td>
                  <td className="py-3 text-sm text-gray-700 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-sm font-semibold text-gray-900 text-right">₹{item.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="ml-auto max-w-xs space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>GST @ 18%</span>
              <span>₹{invoice.gst.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-₹{invoice.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
              <span>Total</span>
              <span style={{ color: '#2E7D32' }}>₹{invoice.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Thank you for your business! 🌾</p>
          <p className="text-xs text-gray-400 mt-1">Powered by AgroERP — KrushiCare AMS</p>
        </div>
      </div>
    </div>
  )
}
