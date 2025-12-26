import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTurfs } from '../services/api';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const SportBadge = ({ sport }) => {
    const colors = {
        Football: 'bg-blue-500', // Just custom class concept, using inline for vanilla
        Cricket: 'bg-green-500',
        Pickleball: 'bg-orange-500'
    };

    const style = {
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: sport === 'Football' ? '#3b82f6' : sport === 'Cricket' ? '#10b981' : '#f97316',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    return <span style={style}>{sport}</span>;
};

const Home = () => {
    const [turfs, setTurfs] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTurfs().then(data => {
            setTurfs(data);
            setLoading(false);
        });
    }, []);

    const filteredTurfs = filter === 'All' ? turfs : turfs.filter(t => t.sport === filter);
    const categories = ['All', 'Football', 'Cricket', 'Pickleball'];

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                padding: '6rem 0',
                background: 'radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Book Your Game.<br />Own the Turf.
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        Premium sports venues for Football, Cricket, and Pickleball. Instant booking, zero hassle.
                    </p>
                    <button className="btn btn-primary" onClick={() => document.getElementById('turfs').scrollIntoView({ behavior: 'smooth' })}>
                        Explore Venues <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Turf Listing */}
            <section id="turfs" className="container" style={{ padding: '4rem 1rem' }}>
                <div className="flex-center" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '30px',
                                border: filter === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: filter === cat ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: filter === cat ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: filter === cat ? '600' : '400',
                                transition: 'all 0.3s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex-center" style={{ height: '200px' }}>
                        <div className="text-muted">Loading venues...</div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {filteredTurfs.map(turf => (
                            <div key={turf.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={turf.image}
                                        alt={turf.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                        <SportBadge sport={turf.sport} />
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{turf.name}</h3>
                                        <div className="flex-center" style={{ gap: '0.2rem', color: '#fbbf24' }}>
                                            <Star size={16} fill="#fbbf24" />
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{turf.rating}</span>
                                        </div>
                                    </div>

                                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                                        <MapPin size={16} />
                                        <span style={{ fontSize: '0.9rem' }}>{turf.location}</span>
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{turf.price}</span>
                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>/hour</span>
                                        </div>
                                        <Link to={`/booking/${turf.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
