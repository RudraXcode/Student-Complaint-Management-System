import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GraduationCap, Shield, Sparkles, Building } from 'lucide-react';
import { UniversitySelector } from './UniversitySelector';
import { getDemoCredentials } from '../utils/auth';
import { INDIAN_UNIVERSITIES } from '../utils/constants';

interface LoginPageProps {
  onLogin: (email: string, password: string, university: string) => void;
  onOAuthSignIn?: (provider: 'azure' | 'google' | 'github') => Promise<{ success: boolean; error?: string; data?: any }>;
}

export function LoginPage({ onLogin, onOAuthSignIn }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [loading, setLoading] = useState(false);

  const demoCredentials = getDemoCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!university) {
      alert('Please select your university');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onLogin(email, password, university);
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = () => {
    const target = email.trim();
    // If the field is empty or looks like a roll number, ask for an email
    if (!target || !target.includes('@')) {
      alert('Please enter your registered email address in the Email field to receive a reset mail. If you signed in with a roll number, enter the email associated with your account.');
      return;
    }

    const subject = 'SCMS: Password reset request';
    const body = `Hello,%0D%0A%0D%0AI forgot my password for the Student Complaint Management System. Please help reset my account for this email: ${target}%0D%0A%0D%0AThanks,%0D%0A`;
    const mailto = `mailto:${encodeURIComponent(target)}?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Open the user's default mail client (Outlook will be used if it's the default)
    window.location.href = mailto;
  };

  const handleAutoSendReset = async () => {
    const target = email.trim();
    if (!target || !target.includes('@')) {
      alert('Please enter your registered email address to send a reset email.');
      return;
    }

    try {
      const res = await fetch('/make-server-cb3d09a5/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Failed to send reset: ${data?.error || 'unknown error'}`);
        return;
      }

      if (data.token && data.resetUrl) {
        // No provider configured — show the reset URL to the developer/user
        alert(`Reset URL (no email provider configured):\n${data.resetUrl}`);
        return;
      }

      alert('If configured, a password reset email has been sent. Check your inbox.');
    } catch (err) {
      console.error(err);
      alert('Error sending reset request. Is the server functions endpoint running?');
    }
  };

  const fillCredentials = (type: 'student' | 'admin' | 'department', deptIndex?: number) => {
    if (type === 'student') {
      setEmail(demoCredentials.student.email);
      setPassword(demoCredentials.student.password);
      setUniversity(demoCredentials.student.university);
    } else if (type === 'admin') {
      setEmail(demoCredentials.admin.email);
      setPassword(demoCredentials.admin.password);
      setUniversity(demoCredentials.admin.university);
    } else if (type === 'department' && deptIndex !== undefined) {
      const dept = demoCredentials.departmentHeads[deptIndex];
      setEmail(dept.email);
      setPassword(dept.password);
      setUniversity(dept.university);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2F5DCE] to-[#4F46E5] rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <GraduationCap className="w-10 h-10 text-white" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
            SCMS Portal
          </h1>
          <p className="text-xl text-gray-600 mb-2">Student Complaint Management System</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
            <span className="text-2xl">🇮🇳</span>
            <p className="text-sm text-blue-700 font-medium">Supporting {Object.values(INDIAN_UNIVERSITIES).flat().length}+ Indian Universities</p>
          </div>
        </div>

        <Card className="backdrop-blur-xl bg-white/90 shadow-2xl border-0 hover:shadow-3xl transition-all duration-500">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Access your dashboard to manage complaints efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="student" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
                <TabsTrigger 
                  value="department" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Building className="w-4 h-4" />
                  Dept Head
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="student" className="space-y-6 mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="university" className="text-base font-semibold">University / Institution *</Label>
                    <UniversitySelector 
                      value={university} 
                      onChange={setUniversity}
                      placeholder="Select your university..."
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold">Email or Roll Number</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Enter your email or roll number"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-2 hover:border-[#2F5DCE] transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base font-semibold">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 border-2 hover:border-[#2F5DCE] transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Sign In as Student
                      </div>
                    )}
                  </Button>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Forgot password? Reset via email
                    </button>
                  </div>
                </form>
                <Button
                  variant="ghost"
                  className="w-full h-11 border-2 hover:border-[#2F5DCE] hover:bg-white mt-3"
                  onClick={async () => {
                    if (!onOAuthSignIn) {
                      alert('OAuth sign-in is not configured');
                      return;
                    }
                    const result = await onOAuthSignIn('azure');
                    if (!result.success && result.error) {
                      alert(`Microsoft sign-in failed: ${result.error}`);
                    }
                  }}
                  type="button"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                      <rect x="1" y="1" width="10" height="10" fill="#F35325" />
                      <rect x="13" y="1" width="10" height="10" fill="#81BC06" />
                      <rect x="1" y="13" width="10" height="10" fill="#05A6F0" />
                      <rect x="13" y="13" width="10" height="10" fill="#FFBA08" />
                    </svg>
                    Sign in with Microsoft
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-2 hover:border-[#2F5DCE] hover:bg-blue-50 transition-all duration-300"
                  onClick={() => fillCredentials('student')}
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Demo: Fill Student Credentials (IIT Delhi)
                  </div>
                </Button>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-6 mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="admin-university" className="text-base font-semibold">University / Institution *</Label>
                    <UniversitySelector 
                      value={university} 
                      onChange={setUniversity}
                      placeholder="Select university..."
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="admin-email" className="text-base font-semibold">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-2 hover:border-[#2F5DCE] transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="admin-password" className="text-base font-semibold">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 border-2 hover:border-[#2F5DCE] transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Sign In as Admin
                      </div>
                    )}
                  </Button>
                </form>
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-2 hover:border-[#2F5DCE] hover:bg-blue-50 transition-all duration-300"
                  onClick={() => fillCredentials('admin')}
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Demo: Fill Admin Credentials (IIT Delhi)
                  </div>
                </Button>
              </TabsContent>

              <TabsContent value="department" className="space-y-6 mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="dept-university" className="text-base font-semibold">University / Institution *</Label>
                    <UniversitySelector 
                      value={university} 
                      onChange={setUniversity}
                      placeholder="Select university..."
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="dept-email" className="text-base font-semibold">Department Head Email</Label>
                    <Input
                      id="dept-email"
                      type="email"
                      placeholder="Enter department head email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-2 hover:border-[#2F5DCE] transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="dept-password" className="text-base font-semibold">Password</Label>
                    <Input
                      id="dept-password"
                      type="password"
                      placeholder="Enter department head password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 border-2 hover:border-[#2F5DCE] transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Sign In as Department Head
                      </div>
                    )}
                  </Button>
                </form>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Demo Department Heads:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {demoCredentials.departmentHeads.map((dept, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="w-full text-xs py-2 h-auto border hover:border-[#2F5DCE] hover:bg-blue-50 transition-all duration-300"
                        onClick={() => fillCredentials('department', index)}
                        type="button"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          {dept.name}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8 space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Available Demo Accounts:</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                <span className="font-medium text-blue-700">Student Portal:</span>
                <span className="text-blue-600">rahul.sharma@university.in / student123</span>
              </div>
              <div className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2">
                <span className="font-medium text-purple-700">Admin Portal:</span>
                <span className="text-purple-600">admin@university.in / admin123</span>
              </div>
              <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                <span className="font-medium text-green-700">Department Heads:</span>
                <span className="text-green-600">Various departments / dept123</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-blue-700 font-medium">
            <span className="text-2xl">🏛️</span>
            <span>Trusted by {Object.values(INDIAN_UNIVERSITIES).flat().length}+ Universities across India</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}