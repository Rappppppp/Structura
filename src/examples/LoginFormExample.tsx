/**
 * Example: Login Form - Using React Query Mutations
 * Demonstrates authentication flow with proper error handling
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getUserErrorMessage } from '@/lib/errorHandler';

export const LoginFormExample = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // AuthContext.login wraps the mutation
      await login(formData.email, formData.password);

      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });

      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (err) {
      // Error is already shown via toast in AuthContext
      // But you can access it here if needed
      const errorMessage = getUserErrorMessage(err);
      console.error('Login error:', errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      {/* Display error message if login fails */}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

/**
 * Key patterns:
 * 1. Using AuthContext's login mutation
 * 2. Proper loading state display
 * 3. Error handling and display
 * 4. Redirect after successful login
 * 5. Disable form while loading
 * 6. Type-safe form handling
 */
