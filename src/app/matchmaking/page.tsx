"use client"

import { useState } from "react"
import { matchAlumniMentors } from "@/ai/flows/match-alumni-mentors"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BrainCircuit, UserCheck, MessageSquare, Loader2 } from "lucide-react"

const MOCK_ALUMNI_DATA = [
  "Dr. Sarah Johnson, Class of 2015, Senior Staff Engineer @ Google. Expertise in Distributed Systems and Cloud Architecture. Enjoys mentoring engineers.",
  "Michael Chen, Class of 2018, Lead Product Designer @ Airbnb. Skills in UI/UX and Product Strategy. Helps with portfolio reviews.",
  "Priya Sharma, Class of 2016, Senior Data Scientist @ Netflix. Expert in Machine Learning and Python. Guides on data career paths.",
  "James Wilson, Class of 2012, VP of Engineering @ Stripe. Leadership and Fintech expert. Mentors aspiring managers.",
  "Elena Rodriguez, Class of 2019, Founder @ EcoStartup. Entrepreneurship and Venture Capital. Can guide on starting new ventures."
]

export default function MatchmakingPage() {
  const [studentProfile, setStudentProfile] = useState("")
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<string[]>([])

  const handleMatch = async () => {
    if (!studentProfile) return
    setLoading(true)
    try {
      const result = await matchAlumniMentors({
        studentProfile,
        alumniProfiles: MOCK_ALUMNI_DATA
      })
      setMatches(result.matches)
    } catch (error) {
      console.error("Matchmaking error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-2 border-primary text-primary px-3 py-1">
          <Sparkles className="h-3 w-3 mr-1" /> Powered by AI
        </Badge>
        <h1 className="text-4xl font-headline font-bold text-primary mb-3">Smart Mentor Matchmaking</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our intelligent system analyzes your profile and aspirations to connect you with the most relevant alumni mentors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-secondary" />
              Tell us about yourself
            </CardTitle>
            <CardDescription>
              Include your academic background, skills, interests, and career goals for the best matches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="e.g., I'm a 3rd-year CS student interested in Cloud Computing and AI. I want to build a career in Big Tech and looking for guidance on system design interviews..."
              className="min-h-[150px] resize-none"
              value={studentProfile}
              onChange={(e) => setStudentProfile(e.target.value)}
            />
            <Button 
              className="w-full bg-primary h-12 text-lg" 
              onClick={handleMatch}
              disabled={loading || !studentProfile}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Profiles...
                </>
              ) : (
                "Find My Matches"
              )}
            </Button>
          </CardContent>
        </Card>

        {matches.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-teal-600" />
              Recommended Mentors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match, idx) => {
                const parts = match.split(',')
                const name = parts[0] || "Alumnus"
                return (
                  <Card key={idx} className="border-l-4 border-l-secondary overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-primary">{name}</CardTitle>
                      <CardDescription className="font-medium text-secondary">Match Score: High</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{match}</p>
                    </CardContent>
                    <CardFooter className="bg-muted/30 pt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" /> Message Mentor
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}