import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { updatePasswordByEmail } from '../utils/auth';

export function ResetPassword({ token, onDone }: { token: string; onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await fetch(`/make-server-cb3d09a5/reset/${encodeURIComponent(token)}`);
        const data = await res.json();
        if (res.ok && data.email) setEmail(data.email);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmail();
  }, [token]);

  const handleSubmit = async () => {
    if (!newPassword) return alert('Enter a new password');
    if (newPassword.length < 8) {
      return alert('Password must be at least 8 characters long');
    }
    
    setLoading(true);
    try {
      const res = await fetch('/make-server-cb3d09a5/reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Failed to confirm token: ${data?.error || 'unknown'}`);
        setLoading(false);
        return;
      }

      // Update demo users with hashed password
      const ok = await updatePasswordByEmail(data.email, newPassword);
      if (ok) {
        alert('Password updated. You can now sign in with the new password.');
        onDone();
      } else {
        alert('Failed to update local demo user.');
      }
    } catch (err) {
      console.error(err);
      alert('Error confirming reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset password</h2>
      <p className="text-sm mb-4">Resetting password for: <strong>{email || token}</strong></p>
      <div className="space-y-3">
        <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
        <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save new password'}</Button>
        <Button variant="ghost" onClick={onDone}>Cancel</Button>
      </div>
    </div>
  );
}

export default ResetPassword;
