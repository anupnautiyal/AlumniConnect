'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { User, GraduationCap, Code, Briefcase, Settings, Edit2, LogOut, Loader2, Save } from "lucide-react"
import { useUser, useDoc, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userDocRef) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      bio: formData.get('bio'),
      major: formData.get('major'),
      graduationYear: formData.get('graduationYear'),
    };

    updateDocumentNonBlocking(userDocRef, updates);
    
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
    setIsEditing(false);
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

  const role = userData?.role || 'student';
  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'User';

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSaveProfile} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="w-full md:w-1/3 space-y-6">
              <Card className="border-none shadow-md overflow-hidden text-center">
                <div className="h-24 bg-primary" />
                <CardHeader className="-mt-12">
                  <div className="mx-auto h-24 w-24 rounded-full border-4 border-card bg-muted flex items-center justify-center text-primary overflow-hidden shadow-lg relative">
                    <User className="h-12 w-12" />
                  </div>
                  <CardTitle className="mt-4">{fullName}</CardTitle>
                  <CardDescription>{role === 'mentor' || role === 'alumni' ? 'Verified Mentor' : 'Student Member'}</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Badge className={cn(
                    "mb-4 uppercase",
                    (role === 'mentor' || role === 'alumni') ? "bg-secondary" : "bg-primary"
                  )}>
                    {role}
                  </Badge>
                  <p className="text-sm text-muted-foreground px-2">
                    {userData?.bio || "No bio added yet. Tell people about yourself!"}
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex flex-col gap-2">
                  <Button type="button" variant="outline" className="w-full" onClick={() => setIsEditing(!isEditing)}>
                    <Edit2 className="mr-2 h-4 w-4" /> {isEditing ? "Cancel Editing" : "Edit Profile"}
                  </Button>
                  <Button type="button" variant="destructive" className="w-full" onClick={handleSignOut}>
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
                  {["React", "Node.js", "Python", "TypeScript", "AWS"].map(s => (
                    <Badge key={s} variant="secondary" className="bg-muted text-xs">{s}</Badge>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-2/3 space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <GraduationCap className="h-5 w-5 text-primary" /> Personal Information
                  </CardTitle>
                  <CardDescription>Update your basic identity and background.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" defaultValue={userData?.firstName} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" defaultValue={userData?.lastName} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major / Field</Label>
                      <Input id="major" name="major" defaultValue={userData?.major || "Computer Science"} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input id="graduationYear" name="graduationYear" defaultValue={userData?.graduationYear || "2026"} disabled={!isEditing} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea 
                      id="bio"
                      name="bio"
                      defaultValue={userData?.bio || "Tell us about your goals..."} 
                      className="min-h-[100px]"
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button type="submit" className="bg-primary">
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Briefcase className="h-5 w-5 text-primary" /> Career Interests
                  </CardTitle>
                  <CardDescription>Help mentors understand your aspirations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {["Open Source", "FinTech", "AI/ML", "DevOps", "Startups"].map(i => (
                      <Badge key={i} className="bg-teal-500/10 text-teal-600 border-teal-200">
                        {i}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
