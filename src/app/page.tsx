'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Clock, PlusCircle, Share2, MessageCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const MOCK_OPPORTUNITIES = [
  {
    id: 1,
    title: "Summer Software Engineering Internship",
    company: "TechNova Solutions",
    location: "Remote / San Francisco",
    type: "Internship",
    postedBy: "Sarah Johnson",
    postedAt: "2 hours ago",
    description: "Looking for bright juniors or seniors for our cloud infrastructure team. Experience with React and Node.js is a plus. Great mentorship opportunities!",
    image: "https://picsum.photos/seed/tech1/800/400"
  },
  {
    id: 2,
    title: "Senior Product Manager - Referral",
    company: "InnovateX",
    location: "New York, NY",
    type: "Referral",
    postedBy: "David Chen",
    postedAt: "5 hours ago",
    description: "I have a few referral slots for a Senior PM role at my current company. Focus is on AI/ML consumer products. Reach out if you have 5+ years experience.",
    image: "https://picsum.photos/seed/tech2/800/400"
  },
  {
    id: 3,
    title: "Open Source Project Collaboration",
    company: "HealthTech Initiative",
    location: "Global",
    type: "Project",
    postedBy: "Elena Rodriguez",
    postedAt: "1 day ago",
    description: "Starting a project to build an accessible patient portal. Need UI/UX designers and accessibility experts. This is a volunteer project with great portfolio potential.",
    image: "https://picsum.photos/seed/tech3/800/400"
  }
]

export default function Home() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const isMentor = userData?.role === 'mentor' || userData?.role === 'alumni';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Opportunity Feed</h1>
          <p className="text-muted-foreground">Discover internships, referrals, and projects posted by your alumni network.</p>
        </div>
        
        {isUserLoading || isUserDataLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking permissions...</span>
          </div>
        ) : (
          isMentor && (
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Post Opportunity
            </Button>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {MOCK_OPPORTUNITIES.map((opp) => (
            <Card key={opp.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image 
                  src={opp.image} 
                  alt={opp.title} 
                  fill 
                  className="object-cover" 
                  data-ai-hint="office tech"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={cn(
                    "font-medium",
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
                    <CardTitle className="text-xl mb-1">{opp.title}</CardTitle>
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
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {opp.postedBy.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{opp.postedBy}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2 w-2" /> {opp.postedAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-primary">
                    <MessageCircle className="mr-2 h-4 w-4" /> Connect
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Network Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Verified Alumni</span>
                <span className="text-xl font-bold text-primary">1,248</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Open Opportunities</span>
                <span className="text-xl font-bold text-secondary">85</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary text-secondary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Alumni Guidance</CardTitle>
              <CardDescription className="text-secondary-foreground/80">
                Browse our query system to find advice and insights from experienced graduates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-background text-foreground" asChild>
                <Link href="/guidance">View Guidance Feed</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
