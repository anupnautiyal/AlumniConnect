import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Phone, Video, MoreVertical, Circle } from "lucide-react"

const MOCK_CONVERSATIONS = [
  { id: 1, name: "Dr. Sarah Johnson", lastMsg: "Glad to help! Let me know if you need anything else.", time: "10:45 AM", online: true, unread: false },
  { id: 2, name: "Michael Chen", lastMsg: "I've reviewed your portfolio. Check the comments.", time: "Yesterday", online: false, unread: true },
  { id: 3, name: "Elena Rodriguez", lastMsg: "The meeting for the project is scheduled for Friday.", time: "Tuesday", online: true, unread: false }
]

const MOCK_MESSAGES = [
  { id: 1, sender: "me", text: "Hi Dr. Sarah, I'm interested in your cloud infra project!", time: "10:15 AM" },
  { id: 2, sender: "Sarah", text: "Hello! That's great to hear. Do you have experience with Kubernetes?", time: "10:20 AM" },
  { id: 3, sender: "me", text: "Yes, I've worked on a few side projects using K8s and Docker.", time: "10:30 AM" },
  { id: 4, sender: "Sarah", text: "Perfect. Glad to help! Let me know if you need anything else.", time: "10:45 AM" }
]

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-6 px-4 h-[calc(100vh-80px)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border bg-card rounded-xl shadow-lg h-full overflow-hidden">
        {/* Sidebar */}
        <div className="md:col-span-1 border-r flex flex-col h-full bg-muted/10">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 bg-card" placeholder="Search chats..." />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {MOCK_CONVERSATIONS.map((chat) => (
              <div key={chat.id} className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors relative">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {chat.name[0]}
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-semibold text-sm truncate">{chat.name}</span>
                      <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
                  </div>
                  {chat.unread && (
                    <div className="h-2 w-2 bg-primary rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex md:col-span-2 flex-col h-full bg-card">
          {/* Chat Header */}
          <div className="p-4 border-b flex justify-between items-center bg-card/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                SJ
              </div>
              <div>
                <h3 className="font-bold text-sm">Dr. Sarah Johnson</h3>
                <div className="flex items-center gap-1.5">
                  <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                  <span className="text-[10px] text-muted-foreground">Active now</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6 space-y-4">
            <div className="flex flex-col gap-4">
              {MOCK_MESSAGES.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'me' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted text-foreground rounded-tl-none'
                  }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t bg-card/50">
            <div className="flex items-center gap-2">
              <Input placeholder="Type a message..." className="bg-muted/30" />
              <Button size="icon" className="bg-primary rounded-full shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}