import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { X, Scale } from "lucide-react"
import { auth, db } from "../lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  User
} from "firebase/auth"
import { countries } from "../lib/countries"

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier
  }
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (user: any) => void
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [view, setView] = useState<'signIn' | 'register' | 'forgotPassword'>('signIn');
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null);

  const createUserDocument = async (user: User, additionalData = {}) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();
      try {
        await setDoc(userRef, { displayName, email, photoURL, createdAt, ...additionalData });
      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setView('signIn');
      setName("");
      setEmail("");
      setPassword("");
      setCountryCode("+91");
      setPhoneNumber("");
      setOtp("");
      setLoading(false);
      setShowOtpInput(false);
      setConfirmationResult(null);
      setError(null);
      setMessage(null);
    }
  }, [isOpen]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible', 'callback': (response: any) => {} });
    }
    return window.recaptchaVerifier;
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess(userCredential.user);
    } catch (error: any) { setError(error.message); } finally { setLoading(false); }
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const fullPhoneNumber = `${countryCode}-${phoneNumber}`;
      await createUserDocument(userCredential.user, { phoneNumber: fullPhoneNumber });
      onAuthSuccess(userCredential.user);
    } catch (error: any) { setError(error.message); } finally { setLoading(false); }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true); setError(null); setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      setView('signIn');
    } catch (error: any) { setError(error.message); } finally { setLoading(false); }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const recaptchaVerifier = setupRecaptcha();
      const fullPhoneNumber = `${countryCode}-${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
    } catch (error: any) { setError(error.message); } finally { setLoading(false); }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setLoading(true); setError(null);
    try {
      const result = await confirmationResult.confirm(otp);
      await createUserDocument(result.user, { phoneNumber: result.user.phoneNumber });
      onAuthSuccess(result.user);
    } catch (error: any) { setError(error.message); } finally { setLoading(false); }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true); setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
      onAuthSuccess(result.user);
    } catch (error: any) { setError(error.message); } finally { setLoading(false); }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl grid md:grid-cols-2">
        <div className="hidden md:block relative">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://placehold.co/800x600/000000/FFFFFF?text=Legal+Port')` }} onError={(e) => { e.currentTarget.style.backgroundImage = `url('https://placehold.co/800x600/cccccc/ffffff?text=Image+Not+Found')` }} />
          <div className="relative z-10 flex flex-col justify-end h-full p-10 bg-black/50 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white rounded-full p-2"><Scale className="h-6 w-6 text-black" /></div>
              <h1 className="text-2xl font-bold">Legal Port</h1>
            </div>
            <h2 className="text-3xl font-bold leading-tight">Your Legal Journey Starts Here.</h2>
            <p className="mt-2 text-gray-300">Access top-tier legal experts with a few clicks.</p>
          </div>
        </div>
        <div className="p-8 relative overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="h-6 w-6" /></button>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}
          {view === 'signIn' && (
            <>
              <div className="text-center mb-8"><h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2><p className="text-gray-500">Sign in to access your account</p></div>
              <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
  <TabsTrigger 
    value="email" 
    className="bg-white data-[state=active]:bg-white text-gray-700 data-[state=active]:text-gray-900 font-medium"
  >
    Email
  </TabsTrigger>
  <TabsTrigger 
    value="phone" 
    className="bg-white data-[state=active]:bg-white text-gray-700 data-[state=active]:text-gray-900 font-medium"
  >
    Phone
  </TabsTrigger>
</TabsList>
                <TabsContent value="email" className="mt-6">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="signin-email">Email</Label><Input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
                    <div className="space-y-2"><Label htmlFor="signin-password">Password</Label><Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" /></div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 transition-transform transform hover:scale-105" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Button>
                    <div className="text-center"><button type="button" onClick={() => setView('forgotPassword')} className="text-sm text-teal-600 hover:underline">Forgotten password?</button></div>
                  </form>
                </TabsContent>
                <TabsContent value="phone" className="mt-6">
                  {!showOtpInput ? (
                    <form onSubmit={handlePhoneSignIn} className="space-y-4">
                      <div className="space-y-2"><Label htmlFor="phone-number-login">Phone Number</Label>
                        <div className="flex items-center gap-2">
                        <Select onValueChange={setCountryCode} defaultValue={countryCode}>
  <SelectTrigger className="w-auto bg-white border-gray-300">
    <SelectValue placeholder="Select Country" />
  </SelectTrigger>
  <SelectContent className="bg-white border-gray-300 shadow-lg">
    {countries.map(country => (
      <SelectItem 
        key={country.name} 
        value={country.code}
        className="bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
      >
        {country.flag} {country.code}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
<Input id="phone-number-login" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="1234567890" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 transition-transform transform hover:scale-105" disabled={loading}>{loading ? "Sending OTP..." : "Send OTP"}</Button>
                    </form>
                  ) : (
                    <form onSubmit={handleOtpVerify} className="space-y-4">
                      <div className="space-y-2"><Label htmlFor="otp">Enter OTP</Label><Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="123456" /></div>
                      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 transition-transform transform hover:scale-105" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
          {view === 'register' && (
            <>
              <div className="text-center mb-8"><h2 className="text-2xl font-bold text-gray-900">Create an Account</h2><p className="text-gray-500">Join Legal Port today!</p></div>
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="signup-name">Full Name</Label><Input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" /></div>
                <div className="space-y-2"><Label htmlFor="signup-email">Email</Label><Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
                <div className="space-y-2"><Label htmlFor="signup-phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={setCountryCode} defaultValue={countryCode}><SelectTrigger className="w-auto"><SelectValue placeholder="Select Country" /></SelectTrigger><SelectContent>{countries.map(country => (<SelectItem key={country.name} value={country.code}>{country.flag} {country.code}</SelectItem>))}</SelectContent></Select>
                    <Input id="signup-phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="1234567890" />
                  </div>
                </div>
                <div className="space-y-2"><Label htmlFor="signup-password">Password</Label><Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" /></div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 transition-transform transform hover:scale-105" disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</Button>
              </form>
            </>
          )}
          {view === 'forgotPassword' && (
            <>
              <div className="text-center mb-8"><h2 className="text-2xl font-bold text-gray-900">Reset Password</h2><p className="text-gray-500">Enter your email to receive a reset link.</p></div>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 transition-transform transform hover:scale-105" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
              </form>
            </>
          )}
          <div className="mt-6">
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-gray-300" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-white px-2 text-gray-600 font-medium">
        {view === 'signIn' ? 'Or' : 'Already have an account?'}
      </span>
    </div>
  </div>
            {view === 'signIn' && (<Button variant="outline" className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-black border-gray-300 transition-colors" onClick={() => setView('register')}>Register Now</Button>)}
            {view !== 'signIn' && (<Button variant="outline" className="w-full mt-4" onClick={() => setView('signIn')}>Sign In</Button>)}
            <Button variant="outline" className="w-full mt-4 transition-colors hover:bg-gray-100 bg-white border-gray-300 text-gray-900" onClick={handleGoogleSignIn} disabled={loading}><svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 8.4 244 8.4c69.1 0 125.3 27.8 172.4 72.4l-66.5 64.2c-23.7-22.3-57.2-35.8-95.9-35.8-71.3 0-129.5 58.2-129.5 129.5s58.2 129.5 129.5 129.5c83.3 0 115.7-59.2 119.5-89.5H244v-83.8h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Sign in with Google</Button>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  )
}