import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, ThumbsUp, HelpCircle, Plus } from "lucide-react"

const MOCK_QUESTIONS = [
  {
    id: 1,
    category: "General",
    title: "How to effectively network with alumni in specialized industries?",
    author: "Alex Rivera",
    role: "Student",
    content: "I'm looking for advice on the best way to reach out to alumni without being intrusive. What worked for you?",
    replies: 8,
    likes: 12,
    date: "1 day ago"
  },
  {
    id: 2,
    category: "General",
    title: "Balance between side projects and coursework?",
    author: "Sophie Kim",
    role: "Junior",
    content: "I'm trying to build my portfolio but my classes are getting intense. How did you manage your time during peak weeks?",
    replies: 15,
    likes: 24,
    date: "3 days ago"
  },
  {
    id: 3,
    category: "General",
    title: "Transitioning from university to a remote work environment?",
    author: "Marcus Doe",
    role: "Sophomore",
    content: "With many roles being remote or hybrid, what are some tips for staying productive and connected as a new grad?",
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

      <div className="max-w-4xl mx-auto">
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
  )
}
