import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTurfById, slots, processPayment, saveBooking } from '../services/api';
import PaymentGateway from '../components/PaymentGateway';
import { MapPin, CheckCircle, ArrowLeft, Calendar, Clock } from 'lucide-react';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [turf, setTurf] = useState(null);
    const [step, setStep] = useState(1);

    // In a real app, get from Context. For demo, we might need to store it in localStorage on login
    // or just pass a mock ID if the user isn't strictly logged in via the new backend yet.
    // Let's assume we store user in localStorage on login.
    const user = JSON.parse(localStorage.getItem('user')) || { _id: 'mock_user_id', name: 'Guest' };

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [paymentDetails, setPaymentDetails] = useState({ holder: '', number: '', cvv: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getTurfById(id).then(setTurf);
    }, [id]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        await processPayment(turf.price, paymentDetails);
        setProcessing(false);
        setStep(3);
    };

    if (!turf) return <div className="container" style={{ padding: '4rem' }}>Loading...</div>;

    if (step === 3) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <CheckCircle size={48} color="#10b981" />
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Booking Confirmed!</h2>
                <p className="text-muted" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
                    You have successfully booked <strong>{turf.name}</strong> for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>.
                </p>
                <button onClick={() => navigate('/')} className="btn btn-primary">Back to Home</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <button
                onClick={() => step === 1 ? navigate(-1) : setStep(1)}
                className="text-muted flex-center"
                style={{ background: 'none', gap: '0.5rem', marginBottom: '2rem', padding: 0 }}
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media (min-width: 768px)': { gridTemplateColumns: '2fr 1fr' } }}>
                <div>
                    {/* Steps Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <span style={{ color: step >= 1 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold' }}>1. Select Slot</span>
                        <span style={{ height: '1px', width: '30px', background: 'var(--border)' }}></span>
                        <span style={{ color: step >= 2 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold' }}>2. Payment</span>
                    </div>

                    {step === 1 ? (
                        <div className="card" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                            <img
                                src={turf.image}
                                alt={turf.name}
                                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '20px', marginBottom: '2rem' }}
                            />
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{turf.name}</h1>
                            <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                                <MapPin size={18} /> {turf.location}
                            </p>

                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Select Date & Slot</h2>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    style={{ maxWidth: '300px' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: selectedSlot === slot ? '2px solid var(--primary)' : '1px solid var(--border)',
                                            background: selectedSlot === slot ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-card)',
                                            color: selectedSlot === slot ? 'white' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div style={{ fontSize: '0.85rem' }}>{slot}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Secure Payment</h2>
                            <PaymentGateway
                                amount={turf.price}
                                onPaymentComplete={async (result) => {
                                    console.log("Payment Result:", result);
                                    try {
                                        // Save to MongoDB
                                        // We need to import saveBooking. Let's assume it's imported above or we specifically imported it.
                                        // Wait, I need to update imports first.
                                        await saveBooking({
                                            userId: user._id || 'mock_user_id',
                                            turfId: turf.id,
                                            date: selectedDate,
                                            slot: selectedSlot,
                                            amount: turf.price,
                                            paymentDetails: result
                                        });
                                        setStep(3);
                                    } catch (err) {
                                        alert("Booking failed: " + err.message);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <div className="glass-card" style={{ position: 'sticky', top: '100px', padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Booking Summary</h3>

                        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Date</span>
                                <span>{selectedDate}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Time</span>
                                <span>{selectedSlot || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Price</span>
                                <span>₹{turf.price}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>₹{selectedSlot ? turf.price : 0}</span>
                        </div>

                        {step === 1 && (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={!selectedSlot}
                                onClick={() => setStep(2)}
                            >
                                Proceed to Pay
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
