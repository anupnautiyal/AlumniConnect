'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, GraduationCap, Code, Briefcase, Settings, Edit2, LogOut, Loader2 } from "lucide-react"
import { useUser, useDoc, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  if (isUserLoading || isUserDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const role = userData?.role || 'STUDENT';
  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'User';

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="w-full md:w-1/3 space-y-6">
            <Card className="border-none shadow-md overflow-hidden text-center">
              <div className="h-24 bg-primary" />
              <CardHeader className="-mt-12">
                <div className="mx-auto h-24 w-24 rounded-full border-4 border-card bg-muted flex items-center justify-center text-primary overflow-hidden shadow-lg relative group">
                  <User className="h-12 w-12" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Edit2 className="text-white h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="mt-4">{fullName}</CardTitle>
                <CardDescription>{role === 'mentor' ? 'Verified Mentor' : 'Student Member'}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <Badge className={cn(
                  "mb-4",
                  role === 'mentor' ? "bg-secondary" : "bg-primary"
                )}>
                  {role.toUpperCase()} ROLE
                </Badge>
                <p className="text-sm text-muted-foreground px-2">
                  {userData?.bio || "No bio added yet. Tell people about yourself!"}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" /> Account Settings
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Code className="h-4 w-4 text-secondary" /> Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {["React", "Node.js", "Python", "TypeScript", "AWS", "SQL"].map(s => (
                  <Badge key={s} variant="secondary" className="bg-muted text-xs">{s}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" /> Academic Profile
                  </CardTitle>
                  <CardDescription>Your university background and focus areas.</CardDescription>
                </div>
                <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase">University</Label>
                    <p className="font-medium">Tech Institute of Technology</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase">Expected Graduation</Label>
                    <p className="font-medium">May 2026</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase">Major</Label>
                    <p className="font-medium">Computer Science & Engineering</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase">GPA</Label>
                    <p className="font-medium">3.8 / 4.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" /> Career Aspirations
                  </CardTitle>
                  <CardDescription>Tell mentors about your professional goals.</CardDescription>
                </div>
                <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea 
                    defaultValue="I am looking for an internship in a fast-paced product-led organization. I am specifically interested in distributed systems and want to learn more about how large scale systems are architected." 
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Open Source", "FinTech", "AI/ML", "DevOps", "Startups"].map(i => (
                      <Badge key={i} className="bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 border-teal-200">
                        {i}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button className="bg-primary">Save Profile Changes</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
