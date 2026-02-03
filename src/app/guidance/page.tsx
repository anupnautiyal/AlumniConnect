import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, ThumbsUp, HelpCircle, GraduationCap, Briefcase, Code, Plus } from "lucide-react"

const MOCK_QUESTIONS = [
  {
    id: 1,
    category: "Career",
    title: "How to prepare for FAANG system design interviews?",
    author: "Alex Rivera",
    role: "Student",
    content: "I'm entering my final year and want to target top tech companies. What resources do you recommend for system design?",
    replies: 8,
    likes: 12,
    date: "1 day ago"
  },
  {
    id: 2,
    category: "Academics",
    title: "Master's in AI vs. working immediately after undergrad?",
    author: "Sophie Kim",
    role: "Junior",
    content: "I'm torn between getting more specialized education or getting industry experience. Alumni in AI, what's your take?",
    replies: 15,
    likes: 24,
    date: "3 days ago"
  },
  {
    id: 3,
    category: "Skills",
    title: "Is learning Rust worth it in 2024?",
    author: "Marcus Doe",
    role: "Sophomore",
    content: "Seeing a lot of buzz around Rust. Should I switch my focus from C++ to Rust for systems programming?",
    replies: 5,
    likes: 9,
    date: "5 days ago"
  }
]

export default function GuidancePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Query & Guidance System</h1>
          <p className="text-muted-foreground">Ask questions and get advice from alumni who've been in your shoes.</p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Ask a Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <button className="flex items-center gap-3 px-6 py-3 hover:bg-muted text-primary font-medium border-l-4 border-primary bg-primary/5">
                  <HelpCircle className="h-4 w-4" /> All Queries
                </button>
                <button className="flex items-center gap-3 px-6 py-3 hover:bg-muted text-muted-foreground">
                  <GraduationCap className="h-4 w-4" /> Academics
                </button>
                <button className="flex items-center gap-3 px-6 py-3 hover:bg-muted text-muted-foreground">
                  <Briefcase className="h-4 w-4" /> Career Guidance
                </button>
                <button className="flex items-center gap-3 px-6 py-3 hover:bg-muted text-muted-foreground">
                  <Code className="h-4 w-4" /> Skill Development
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-6">
            <Input placeholder="Search discussions..." className="bg-card shadow-sm" />
          </div>

          <div className="space-y-6">
            {MOCK_QUESTIONS.map((q) => (
              <Card key={q.id} className="border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none uppercase text-[10px] tracking-wider font-bold">
                      {q.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{q.date}</span>
                  </div>
                  <CardTitle className="text-xl hover:text-primary cursor-pointer transition-colors">
                    {q.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{q.content}</p>
                </CardContent>
                <CardFooter className="border-t bg-muted/10 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {q.author[0]}
                      </div>
                      <span className="font-semibold text-foreground">{q.author}</span>
                      <span>•</span>
                      <span>{q.role}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" /> {q.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" /> {q.replies} Replies
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}