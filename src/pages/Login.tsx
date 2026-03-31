import { useState } from 'react';
import { useAuth, UserRole, extractErrorMessage } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, Eye, EyeOff, Facebook, Phone, Mail } from 'lucide-react';
import blueprintBg from '@/assets/blueprint-bg.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { authService } from '@/api/auth.service';

const roles: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'architect', label: 'Architect' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'client', label: 'Client' },
];

const Login = () => {
  const [email, setEmail] = useState('admin@structura.io');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState<UserRole>('admin');
  const [showPw, setShowPw] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const carouselImages = [
    '/images/login/1.jpg',
    '/images/login/2.jpg',
    '/images/login/3.jpg',
    '/images/login/4.jpg', 
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      toast({
        title: 'Login failed',
        description: extractErrorMessage(err) || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    try {
      setIsRegistering(true);
      await authService.register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        password_confirmation: registerForm.password,
        role: 'user',
        company: registerForm.company || undefined,
      });

      setRegisterOpen(false);
      setRegisterForm({ name: '', company: '', email: '', password: '' });
      toast({ title: 'Registration successful', description: 'Your account has been created. You can now sign in.' });
    } catch (err: unknown) {
      toast({
        title: 'Registration failed',
        description: extractErrorMessage(err) || 'Unable to register with the provided details.',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4"
      style={{ backgroundImage: `url(${blueprintBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="grid grid-cols-2 w-full max-w-6xl h-screen max-h-[60vh] animate-fade-in gap-0 overflow-hidden rounded-2xl shadow-2xl">
        <div className="col-span-1 p-8 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-xl h-full flex flex-col justify-center border border-border/50">
          {/* Logo */}
          <div className="mb-10 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-3 border border-primary/20 shadow-lg">
              <img src="/logo.png" alt="" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Structura</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">JohnWin Architectural and Engineering Services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all duration-200"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Roles  */}
            {/* <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
              <div className="grid grid-cols-4 gap-2">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`rounded-md border px-2 py-2 text-xs font-medium transition-all ${role === r.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div> */}

            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-gradient-to-r from-primary to-primary/80 font-semibold text-primary-foreground transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
            >
              Sign In
            </button>

            <div className="flex items-center justify-between text-sm pt-2">
              <button type="button" onClick={() => setForgotOpen(true)} className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">Forgot Password?</button>
              <button type="button" onClick={() => setRegisterOpen(true)} className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">Register Client</button>
            </div>
          </form>
        </div>

        <div className="col-span-1 hidden md:flex bg-gradient-to-br from-primary/10 via-card to-primary/5 backdrop-blur-xl border border-border/50 overflow-hidden">
          <Carousel className="w-full h-full flex flex-row">
            <CarouselContent className='flex flex-row h-full w-full p-0 m-0'>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="h-full w-full">
                  <div className="relative h-full w-full">
                    <img
                      src={image}
                      alt={`Carousel slide ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 border-border/50 text-foreground/60 hover:bg-primary/20 hover:text-foreground transition-all" />
            <CarouselNext className="right-2 border-border/50 text-foreground/60 hover:bg-primary/20 hover:text-foreground transition-all" />
          </Carousel>
        </div>
      </div>

      <div className='absolute bottom-0 w-full px-6 mb-4'>
        <div className='flex justify-between w-full text-foreground font-semibold 
                  animate-fade-in-up opacity-0 gap-6'
          style={{ animation: 'fadeInUp 1s forwards' }}>

          <a href='https://www.facebook.com/wj.architectengineer' target='_blank' className='flex items-center gap-2 hover:text-primary transition-colors active:scale-95 text-sm'>
            <Facebook className='h-5 w-5 text-primary' />
            <span className='hidden sm:inline'>JohnWin AES</span>
          </a>

          <div className='flex items-center gap-3 text-sm'>
            <Phone className='h-5 w-5 text-primary' />
            <a href="tel:+639951330630" className='hover:text-primary transition-colors active:scale-95'>
              0995-133-0630
            </a>
            <span className='text-muted-foreground'>/</span>
            <a href="tel:+639612322387" className='hover:text-primary transition-colors active:scale-95'>
              0961-232-2387
            </a>
          </div>

          <a href='mailto:wjdesignbuild@gmail.com' className='flex items-center gap-2 hover:text-primary transition-colors active:scale-95 text-sm'>
            <Mail className='h-5 w-5 text-primary' />
            <span className='hidden sm:inline'>Email Us</span>
          </a>
        </div>

        {/* Tailwind keyframes */}
        <style>
          {`
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 1s ease-out forwards;
      }
    `}
        </style>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="border border-border/50 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Reset Password</DialogTitle>
            <DialogDescription className="text-muted-foreground">Enter your email address and we'll send you a password reset link.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">Email Address</label>
            <input type="email" placeholder="you@example.com" className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setForgotOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80" onClick={() => { setForgotOpen(false); toast({ title: 'Reset Link Sent', description: 'Check your email for the password reset link.' }); }}>Send Reset Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Client Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="border border-border/50 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Register as Client</DialogTitle>
            <DialogDescription className="text-muted-foreground">Create a client account to track your projects and communicate with your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Full Name</label>
              <input
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                placeholder="John Smith"
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Company</label>
              <input
                value={registerForm.company}
                onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                placeholder="Your company name"
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="you@company.com"
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Create a strong password"
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRegisterOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80" onClick={handleRegister} disabled={isRegistering}>{isRegistering ? 'Registering...' : 'Register'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
