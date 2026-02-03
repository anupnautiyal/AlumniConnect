import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, Linkedin, Mail, MessageSquare } from "lucide-react"
import Image from "next/image"

const MOCK_ALUMNI = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    class: "2015",
    role: "Senior Staff Engineer @ Google",
    skills: ["Distributed Systems", "Go", "Cloud Architecture"],
    bio: "Passionate about building scalable systems and mentoring early-career engineers. Specialized in cloud-native solutions.",
    image: "https://picsum.photos/seed/alumni1/200/200"
  },
  {
    id: 2,
    name: "Michael Chen",
    class: "2018",
    role: "Lead Product Designer @ Airbnb",
    skills: ["UI/UX", "Product Strategy", "Figma"],
    bio: "Design lead with a focus on travel experiences. I love helping students transition into product design.",
    image: "https://picsum.photos/seed/alumni2/200/200"
  },
  {
    id: 3,
    name: "Priya Sharma",
    class: "2016",
    role: "Senior Data Scientist @ Netflix",
    skills: ["Machine Learning", "Python", "A/B Testing"],
    bio: "Focused on recommendation algorithms. Happy to chat about data science interview prep and career paths.",
    image: "https://picsum.photos/seed/alumni3/200/200"
  },
  {
    id: 4,
    name: "James Wilson",
    class: "2012",
    role: "VP of Engineering @ Stripe",
    skills: ["Leadership", "Payments", "Scaling"],
    bio: "Building global payment infrastructure. interested in supporting students who want to enter fintech.",
    image: "https://picsum.photos/seed/alumni4/200/200"
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    class: "2019",
    role: "Founder @ EcoStartup",
    skills: ["Entrepreneurship", "Sustainability", "Venture Capital"],
    bio: "Recent founder focused on climate tech. Can guide on startup building and raising initial rounds.",
    image: "https://picsum.photos/seed/alumni5/200/200"
  },
  {
    id: 6,
    name: "Kevin Park",
    class: "2017",
    role: "Security Analyst @ Microsoft",
    skills: ["Cybersecurity", "Ethics", "Cloud Security"],
    bio: "Protecting cloud assets for millions of users. Ask me about cybersecurity certifications and roles.",
    image: "https://picsum.photos/seed/alumni6/200/200"
  }
]

export default function DirectoryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Verified Alumni Directory</h1>
          <p className="text-muted-foreground">Connect with graduates who are leading in their fields.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name, role, or skill..." />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ALUMNI.map((alumnus) => (
          <Card key={alumnus.id} className="flex flex-col border-none shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-muted transition-colors group-hover:border-primary">
                <Image 
                  src={alumnus.image} 
                  alt={alumnus.name} 
                  fill 
                  className="object-cover" 
                  data-ai-hint="portrait"
                />
              </div>
              <div>
                <CardTitle className="text-lg">{alumnus.name}</CardTitle>
                <p className="text-xs font-semibold text-secondary">Class of {alumnus.class}</p>
                <p className="text-sm font-medium text-primary mt-0.5">{alumnus.role}</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{alumnus.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {alumnus.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-muted/50 text-[10px] py-0">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 pt-4 flex justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" variant="default" className="bg-primary">
                <MessageSquare className="mr-2 h-3.5 w-3.5" /> Message
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}