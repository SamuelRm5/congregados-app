import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FishSymbol } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app/songs" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app/songs');
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4">
            <FishSymbol className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-navy">Congregados</h1>
          <p className="text-sm text-navy/60 mt-1">Área de miembros</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@congregados.com"
              autoComplete="email"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Iniciar sesión
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-navy/40 mt-6">
          Solo miembros autorizados pueden acceder.
        </p>
      </div>
    </div>
  );
}
