'use client';

import { useState } from 'react';
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, User, MessageSquare, ArrowRight, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { matchAlumniMentors, type MatchAlumniMentorsOutput } from '@/ai/flows/match-alumni-mentors';
import { cn } from '@/lib/utils';

export default function MatchmakingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchAlumniMentorsOutput | null>(null);

  // Get current user profile
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userData } = useDoc(userDocRef);

  // Get all mentors
  const mentorsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), where('role', 'in', ['mentor', 'alumni']));
  }, [firestore]);
  const { data: allMentors } = useCollection(mentorsQuery);

  const handleGetMatches = async () => {
    if (!userData || !allMentors || allMentors.length === 0) return;
    
    setIsMatching(true);
    try {
      const studentProfile = `
        Major: ${userData.major || 'Not specified'}
        Bio: ${userData.bio || 'Not specified'}
        Skills: ${userData.skills?.join(', ') || 'Not specified'}
      `;

      const alumniProfiles = allMentors.map(m => ({
        id: m.id,
        fullName: `${m.firstName} ${m.lastName}`,
        role: m.role || 'Alumni',
        bio: m.bio || '',
        skills: m.skills || []
      }));

      const results = await matchAlumniMentors({
        studentProfile,
        alumniProfiles
      });

      setMatchResults(results);
    } catch (error) {
      console.error('Matchmaking failed:', error);
    } finally {
      setIsMatching(false);
    }
  };

  const recommendedMentors = allMentors?.filter(m => 
    matchResults?.recommendedMentorIds.includes(m.id)
  );

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Powered by Genkit AI</span>
        </div>
        <h1 className="text-4xl font-bold font-headline text-primary mb-4">AI Mentor Matchmaking</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We use artificial intelligence to analyze your profile and connect you with mentors who best align with your career aspirations and technical background.
        </p>
      </div>

      {!matchResults ? (
        <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
          <CardHeader className="text-center pt-12 pb-8">
            <div className="mx-auto bg-white p-4 rounded-3xl shadow-sm mb-6 w-fit">
              <BrainCircuit className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Find Your Career Navigator</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Our AI will look at your major, skills, and bio to find the perfect professional match.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-12">
            <Button 
              size="lg" 
              onClick={handleGetMatches} 
              disabled={isMatching || !userData}
              className="rounded-full h-14 px-10 text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              {isMatching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Network...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate My Matches
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card border rounded-2xl p-6 shadow-sm border-primary/20 bg-primary/5">
            <h3 className="font-bold font-headline text-lg mb-2 flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              AI Insight
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "{matchResults.reasoning}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedMentors?.map((mentor) => (
              <Card key={mentor.id} className="flex flex-col border-none shadow-md hover:shadow-xl transition-all group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 overflow-hidden relative">
                      {mentor.image ? (
                        <Image src={mentor.image} alt={mentor.firstName} fill className="object-cover" />
                      ) : (
                        <User className="h-8 w-8" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mentor.firstName} {mentor.lastName}</CardTitle>
                      <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest bg-white">
                        {mentor.role}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {(mentor.skills || []).slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-[9px] py-0 bg-muted/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  <Button className="w-full rounded-full" asChild>
                    <Link href={`/messages?recipientId=${mentor.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" /> Message Mentor
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="ghost" onClick={() => setMatchResults(null)} className="text-muted-foreground hover:text-primary">
              Try again with a different focus
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
