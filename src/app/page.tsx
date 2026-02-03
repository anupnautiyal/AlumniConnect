'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, PlusCircle, Share2, MessageCircle, Loader2, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // User Profile
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  // Opportunities Collection
  const opportunitiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'opportunities'), orderBy('datePosted', 'desc'), limit(20));
  }, [firestore]);
  const { data: opportunities, isLoading: isOppLoading } = useCollection(opportunitiesQuery);

  const isMentor = userData?.role === 'mentor' || userData?.role === 'alumni';

  const handlePostOpportunity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !firestore) return;

    const formData = new FormData(e.currentTarget);
    const newOpp = {
      id: crypto.randomUUID(),
      alumniId: user.uid,
      postedBy: `${userData?.firstName} ${userData?.lastName}`,
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      datePosted: new Date().toISOString(),
      image: `https://picsum.photos/seed/${Math.random()}/800/400`
    };

    addDocumentNonBlocking(collection(firestore, 'opportunities'), newOpp);
    
    toast({
      title: "Opportunity posted!",
      description: "Your post is now live in the feed.",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline text-primary">Opportunity Feed</h1>
          <p className="text-muted-foreground">Discover internships, referrals, and projects posted by your alumni network.</p>
        </div>
        
        {isUserLoading || isUserDataLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking permissions...</span>
          </div>
        ) : (
          isMentor && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 rounded-full shadow-lg">
                  <PlusCircle className="mr-2 h-4 w-4" /> Post Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <form onSubmit={handlePostOpportunity}>
                  <DialogHeader>
                    <DialogTitle>Post New Opportunity</DialogTitle>
                    <DialogDescription>
                      Share a job opening, internship, or project with the student community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" placeholder="e.g. Software Engineering Intern" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" name="company" placeholder="Company Name" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="e.g. Remote" required />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Opportunity Type</Label>
                      <Select name="type" defaultValue="Internship">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" placeholder="Tell us about the role..." className="min-h-[100px]" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" /> Publish Opportunity
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isOppLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading the latest opportunities...</p>
            </div>
          ) : opportunities && opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <Card key={opp.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image 
                    src={opp.image || `https://picsum.photos/seed/${opp.id}/800/400`} 
                    alt={opp.title} 
                    fill 
                    className="object-cover" 
                    data-ai-hint="office tech"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={cn(
                      "font-medium shadow-sm",
                      opp.type === "Internship" ? "bg-secondary" : 
                      opp.type === "Referral" ? "bg-primary" : "bg-teal-600"
                    )}>
                      {opp.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1 font-headline">{opp.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="font-semibold text-primary">{opp.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {opp.location}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{opp.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/30 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">
                      {opp.postedBy?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-medium">{opp.postedBy}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2 w-2" /> {new Date(opp.datePosted).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                      <Link href={`/messages?recipientId=${opp.alumniId}`}>
                        <MessageCircle className="mr-2 h-4 w-4" /> Connect
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold">No opportunities yet</h3>
              <p className="text-muted-foreground">Check back later or post the first one!</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Network Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Verified Alumni</span>
                <span className="text-xl font-bold text-primary">1,248</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Open Opportunities</span>
                <span className="text-xl font-bold text-secondary">{opportunities?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="text-lg font-headline">Community Wisdom</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Browse our guidance feed to find advice and insights from experienced graduates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white" asChild>
                <Link href="/guidance">View Guidance Feed</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
