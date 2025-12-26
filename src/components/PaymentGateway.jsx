import { useState } from 'react';
import { CreditCard, Smartphone, Check, Loader2 } from 'lucide-react';

const PaymentGateway = ({ amount, onPaymentComplete }) => {
    const [method, setMethod] = useState('card'); // 'card' | 'upi'
    const [processing, setProcessing] = useState(false);

    // Card Details State
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

    // UPI Details State
    const [upiId, setUpiId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate Network Request to Stripe/Bank
        setTimeout(() => {
            setProcessing(false);
            onPaymentComplete({
                method,
                transactionId: `${method === 'upi' ? 'UPI' : 'STR'}_` + Math.random().toString(36).substr(2, 9).toUpperCase()
            });
        }, 2000);
    };

    return (
        <div className="card" style={{ maxWidth: '600px', border: '1px solid var(--border)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => setMethod('card')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '12px',
                        border: method === 'card' ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: method === 'card' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                        color: method === 'card' ? 'var(--primary)' : 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s'
                    }}
                >
                    <CreditCard size={24} />
                    <span style={{ fontWeight: '600' }}>Card</span>
                </button>
                <button
                    onClick={() => setMethod('upi')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '12px',
                        border: method === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: method === 'upi' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                        color: method === 'upi' ? 'var(--primary)' : 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s'
                    }}
                >
                    <Smartphone size={24} />
                    <span style={{ fontWeight: '600' }}>UPI</span>
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {method === 'card' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Enter Card Details</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ width: '30px', height: '20px', background: '#ccc', borderRadius: '4px' }}></div> {/* Visa/Mastercard icons placeholder */}
                                <div style={{ width: '30px', height: '20px', background: '#ccc', borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardDetails.number}
                            onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                            required
                        />

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                required
                                style={{ flex: 1 }}
                            />
                            <input
                                type="text"
                                placeholder="CVC"
                                value={cardDetails.cvc}
                                onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                required
                                style={{ flex: 1 }}
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Card Holder Name"
                            value={cardDetails.name}
                            onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                            required
                        />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>UPI Payment</h3>
                        <label className="text-muted" style={{ fontSize: '0.9rem' }}>Enter your Virtual Payment Address (VPA)</label>
                        <input
                            type="text"
                            placeholder="username@bank"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                            required
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Verified by Stripe
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <Loader2 size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Processing...
                        </>
                    ) : (
                        `Pay ₹${amount}`
                    )}
                </button>
            </form>

            <style>{`
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default PaymentGateway;
