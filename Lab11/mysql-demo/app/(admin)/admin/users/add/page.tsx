'use client';

import { useState } from 'react';

export default function AddUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'staff' | 'meeting_convener'>('staff');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('https://awt-project-glqp.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Something went wrong');
      } else {
        setMessage('User registered successfully');
        setName('');
        setEmail('');
        setPassword('');
        setRole('staff');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, padding: 30 }}>
      <h2>Add User (Admin)</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
      >
        <option value="staff">Staff</option>
        <option value="meeting_convener">Meeting Convener</option>
      </select>
      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Registering...' : 'Register User'}
      </button>

      <p>{message}</p>
    </div>
  );
}