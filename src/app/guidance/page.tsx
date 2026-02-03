'use client';

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, ThumbsUp, Plus, Loader2, Send } from "lucide-react"
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function GuidancePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const guidanceQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'guidanceRequests'), orderBy('datePosted', 'desc'));
  }, [firestore]);

  const { data: requests, isLoading } = useCollection(guidanceQuery);

  const isStudent = user && !isUserLoading; // Simple check, could be more specific based on profile role

  const handlePostQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !firestore) return;

    const formData = new FormData(e.currentTarget);
    const newRequest = {
      id: crypto.randomUUID(),
      studentId: user.uid,
      studentName: user.displayName || "Anonymous Student",
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: "General",
      datePosted: new Date().toISOString(),
      likes: 0,
      replies: 0
    };

    addDocumentNonBlocking(collection(firestore, 'guidanceRequests'), newRequest);
    
    toast({
      title: "Question posted!",
      description: "Your request for guidance is now visible to the community.",
    });
    setIsDialogOpen(false);
  };

  const filteredRequests = requests?.filter(req => 
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline text-primary">Guidance System</h1>
          <p className="text-muted-foreground">Ask questions and get advice from alumni who've been in your shoes.</p>
        </div>
        
        {isStudent && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 rounded-full shadow-lg">
                <Plus className="mr-2 h-4 w-4" /> Ask a Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handlePostQuestion}>
                <DialogHeader>
                  <DialogTitle>Ask the Community</DialogTitle>
                  <DialogDescription>
                    What's on your mind? Alumni and mentors are here to help.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Question Title</Label>
                    <Input id="title" name="title" placeholder="e.g. How to prepare for technical interviews?" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Details</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Provide some context for your question..." 
                      className="min-h-[120px]" 
                      required 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Post Question
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Input 
            placeholder="Search discussions..." 
            className="bg-card shadow-sm h-12 text-lg" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading guidance requests...</p>
            </div>
          ) : filteredRequests && filteredRequests.length > 0 ? (
            filteredRequests.map((q) => (
              <Card key={q.id} className="border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none uppercase text-[10px] tracking-wider font-bold">
                      {q.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(q.datePosted).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl hover:text-primary cursor-pointer transition-colors font-headline">
                    {q.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{q.description}</p>
                </CardContent>
                <CardFooter className="border-t bg-muted/10 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {q.studentName?.[0] || 'S'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">{q.studentName}</span>
                      <span className="text-[10px] text-muted-foreground">Student</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" /> {q.likes || 0}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" /> {q.replies || 0} Replies
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
              <p className="text-muted-foreground">No questions found. Be the first to ask!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
