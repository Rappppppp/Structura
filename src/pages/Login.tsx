import { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, Eye, EyeOff, Facebook, Phone, Mail } from 'lucide-react';
import blueprintBg from '@/assets/blueprint-bg.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const carouselImages = [
    '/images/login/1.jpg',
    '/images/login/2.jpg',
    '/images/login/3.jpg',
    '/images/login/4.jpg',

  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role);
    navigate('/dashboard');
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4"
      style={{ backgroundImage: `url(${blueprintBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="grid grid-cols-2 w-full max-w-6xl h-screen max-h-[60vh] animate-fade-in">
        <div className="col-span-1 p-8 rounded-l-xl bg-card/95 backdrop-blur-sm shadow-xl h-full flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center">
              <img src="/logo.png" alt="" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Structura</h1>
            <p className="mt-1 text-sm text-muted-foreground">JohnWin Architectural and Engineering Services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
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
              className="h-10 w-full rounded-md bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              Sign In
            </button>

            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => setForgotOpen(true)} className="text-primary hover:underline">Forgot Password?</button>
              <button type="button" onClick={() => setRegisterOpen(true)} className="text-primary hover:underline">Register Client</button>
            </div>
          </form>
        </div>

        <div className="col-span-1 hidden md:flex bg-card/95 backdrop-blur-sm shadow-xl rounded-r-xl overflow-hidden">
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
            <CarouselPrevious className="left-2 border-slate-600 text-slate-700 hover:bg-slate-700/50 hover:text-slate-300" />
            <CarouselNext className="right-2 border-slate-600 text-slate-700 hover:bg-slate-700/50 hover:text-slate-300" />
          </Carousel>
        </div>
      </div>

      <div className='absolute bottom-0 w-full px-6 mb-4'>
        <div className='flex justify-between w-full text-blue-900 font-semibold 
                  animate-fade-in-up opacity-0'
          style={{ animation: 'fadeInUp 1s forwards' }}>

          <a href='https://www.facebook.com/wj.architectengineer' target='_blank' className='flex items-center gap-2 hover:scale-105 transition-all'>
            <Facebook className='text-blue-700' />
            JohnWin Architectural and Engineering Services
          </a>

          <div className='flex items-center gap-2'>
            <Phone />
            <a href="tel:+639951330630" className='hover:scale-105 transition-all'>
              0995-133-0630
              </a> / 
              <a href="tel:+639612322387"
              className='hover:scale-105 transition-all'>
                0961-232-2387
                </a>
          </div>

          <a href='mailto:wjdesignbuild@gmail.com' className='flex items-center gap-2 hover:scale-105 transition-all'>
            <Mail />
            wjdesignbuild@gmail.com
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Enter your email address and we'll send you a password reset link.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
            <input type="email" placeholder="you@example.com" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForgotOpen(false)}>Cancel</Button>
            <Button onClick={() => { setForgotOpen(false); toast({ title: 'Reset Link Sent', description: 'Check your email for the password reset link.' }); }}>Send Reset Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Client Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register as Client</DialogTitle>
            <DialogDescription>Create a client account to track your projects and communicate with your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
              <input placeholder="John Smith" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Company</label>
              <input placeholder="Your company name" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input type="email" placeholder="you@company.com" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <input type="password" placeholder="Create a strong password" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegisterOpen(false)}>Cancel</Button>
            <Button onClick={() => { setRegisterOpen(false); toast({ title: 'Registration Submitted', description: 'Your account request has been submitted for review.' }); }}>Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
