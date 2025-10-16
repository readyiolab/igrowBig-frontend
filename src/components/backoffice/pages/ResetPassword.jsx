// src/components/backoffice/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  resetPasswordAsync, 
  clearError, 
  clearMessage,
  selectAuthLoading,  // Add this
  selectAuthError,     // Add this
  selectAuthMessage    // Add this
} from '@/store/slices/authSlice';  // Import all from here
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Lock } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Now these are defined via the import above
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const message = useSelector(selectAuthMessage);
  const [validParams, setValidParams] = useState(true);

  useEffect(() => {
    if (!token || !email) {
      setValidParams(false);
    }
    dispatch(clearError());
    dispatch(clearMessage());
  }, [token, email, dispatch]);

  useEffect(() => {
    if (message && !loading && !error) {
      setTimeout(() => {
        navigate('/backoffice-login');
      }, 3000);
    }
  }, [message, loading, error, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());
    dispatch(clearMessage());

    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    await dispatch(resetPasswordAsync({ token, email, newPassword }));
  };

  if (!validParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <CardTitle>Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert variant="destructive">
              <AlertDescription>Missing token or email. Please request a new reset.</AlertDescription>
            </Alert>
            <Button className="w-full mt-4" onClick={() => navigate('/forgot-password')}>
              Request New Reset
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Lock className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <CardTitle>Reset Your Password</CardTitle>
          <p className="text-sm text-gray-600">Enter a new password for {email}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter new password"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>

            {(localError || error) && (
              <Alert variant="destructive">
                <XCircle className="w-4 h-4" />
                <AlertDescription>{localError || error.message || error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button
              type="button"
              onClick={() => navigate('/backoffice-login')}
              className="text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;