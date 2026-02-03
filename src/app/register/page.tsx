'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GraduationCap, Briefcase, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'mentor'
  });
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Account created!",
        description: `Welcome to AlumniConnect, ${formData.firstName}!`,
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
      <Card className="w-full max-w-lg border-none shadow-xl">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="bg-primary p-3 rounded-2xl mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Create an account</CardTitle>
          <CardDescription>
            Join the network and start connecting
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">I am a...</Label>
              <RadioGroup 
                defaultValue="student" 
                className="grid grid-cols-2 gap-4"
                onValueChange={(val) => setFormData({ ...formData, role: val as any })}
              >
                <div>
                  <RadioGroupItem
                    value="student"
                    id="student"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="student"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all",
                      formData.role === 'student' && "border-primary bg-primary/5"
                    )}
                  >
                    <User className="mb-3 h-6 w-6" />
                    <span className="font-bold">Student</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="mentor"
                    id="mentor"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="mentor"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all",
                      formData.role === 'mentor' && "border-primary bg-primary/5"
                    )}
                  >
                    <Briefcase className="mb-3 h-6 w-6" />
                    <span className="font-bold">Mentor</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  required 
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  required 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
