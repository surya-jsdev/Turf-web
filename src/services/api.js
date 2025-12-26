// API Service

const API_URL = 'http://localhost:5000/api';

export const turfs = [
  {
    id: 1,
    name: "Thunder Bolt Arena",
    sport: "Football",
    image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=800",
    location: "Downtown Sports Complex",
    price: 1200,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Green Valley Pitch",
    sport: "Football",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800",
    location: "Green Valley",
    price: 1000,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Master Blaster Nets",
    sport: "Cricket",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
    location: "Westside Hub",
    price: 800,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Spin Kings Arena",
    sport: "Cricket",
    image: "https://images.unsplash.com/photo-1593341646261-284774810978?auto=format&fit=crop&q=80&w=800",
    location: "North Avenue",
    price: 900,
    rating: 4.2,
  },
  {
    id: 5,
    name: "Smash Pickleball Court",
    sport: "Pickleball",
    image: "https://images.unsplash.com/photo-1626248316335-58d044238721?auto=format&fit=crop&q=80&w=800",
    location: "City Center",
    price: 1500,
    rating: 4.9,
  }
];

export const slots = [
  "06:00 AM - 07:00 AM",
  "07:00 AM - 08:00 AM",
  "08:00 AM - 09:00 AM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
  "07:00 PM - 08:00 PM",
  "08:00 PM - 09:00 PM",
];

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return response.json();
};

export const signupUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }
  return response.json();
};

export const processPayment = async (amount, details) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, transactionId: "TXN" + Math.floor(Math.random() * 1000000) });
    }, 1500);
  });
};

export const saveBooking = async (bookingData) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error('Booking failed');
  return response.json();
};

export const getTurfs = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(turfs), 500);
  });
};

export const getTurfById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(turfs.find(t => t.id === parseInt(id))), 500);
  });
};
